'use client';

import { useEffect, useRef } from 'react';
import { SitePayload } from '../types/browser';

interface SandboxedViewportProps {
  site: SitePayload | null;
  address: string;
  scrollY?: number;
  onNavigate: (address: string) => void;
  onScrollChange: (scrollY: number) => void;
}

export function SandboxedViewport({
  site,
  address,
  scrollY = 0,
  onNavigate,
  onScrollChange,
}: SandboxedViewportProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
        return;
      }

      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'NAVIGATE' && typeof data.address === 'string') {
        onNavigate(data.address);
      } else if (data.type === 'SCROLL' && typeof data.scrollY === 'number') {
        onScrollChange(data.scrollY);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onNavigate, onScrollChange]);

  const frameScript = `
    <script>
      (function() {
        document.addEventListener('click', function(e) {
          var target = e.target;
          while (target && target.tagName !== 'A') {
            target = target.parentElement;
          }
          if (target && target.tagName === 'A') {
            var href = target.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
              e.preventDefault();
              e.stopPropagation();
              window.parent.postMessage({ type: 'NAVIGATE', address: href }, '*');
            }
          }
        }, true);

        var lastScroll = 0;
        window.addEventListener('scroll', function() {
          var y = window.scrollY || document.documentElement.scrollTop;
          if (Math.abs(y - lastScroll) > 10) {
            lastScroll = y;
            window.parent.postMessage({ type: 'SCROLL', scrollY: y }, '*');
          }
        }, { passive: true });

        window.addEventListener('load', function() {
          var targetY = ${scrollY};
          if (targetY > 0) {
            window.scrollTo({ top: targetY, behavior: 'instant' });
          }
        });
      })();
    <\/script>
  `;

  if (!site) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-stone-50">
        <div className="max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xs">
          <p className="font-mono text-xs uppercase tracking-wider text-rose-600 font-semibold">
            404 Address Not Found
          </p>
          <h2 className="mt-2 text-xl font-medium text-stone-900">
            {address}
          </h2>
          <p className="mt-3 text-sm text-stone-600 leading-relaxed">
            The small web contains pointers to places that have ceased to exist or were never built. There is no page at this address.
          </p>
        </div>
      </div>
    );
  }

  const wrappedDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${site.title}</title>
        <style>
          :root { color-scheme: light; }
          body { margin: 0; padding: 24px 20px 60px; word-break: break-word; }
          a { color: #0284c7; text-decoration: underline; cursor: pointer; }
        </style>
      </head>
      <body>
        ${site.html}
        ${frameScript}
      </body>
    </html>
  `;

  return (
    <iframe
      ref={iframeRef}
      key={`${address}-${site.title}`}
      title={site.title}
      sandbox="allow-scripts"
      srcDoc={wrappedDoc}
      className="h-full w-full border-0 bg-white"
    />
  );
}

