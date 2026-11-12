'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { PersonItem } from '../types/browser';

interface PublishModalProps {
  isOpen: boolean;
  people: PersonItem[];
  defaultAuthor: string;
  onClose: () => void;
  onPublished: (address: string) => void;
  onPublishSubmit: (data: {
    address: string;
    title: string;
    html: string;
    author: string;
  }) => Promise<unknown>;
}

export function PublishModal({
  isOpen,
  people,
  defaultAuthor,
  onClose,
  onPublished,
  onPublishSubmit,
}: PublishModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(defaultAuthor);
  const [html, setHtml] = useState(
    '<article>\n  <h1>Page Title</h1>\n  <p>Write your HTML page here. Link to other sites using standard anchor tags like <a href="androon-lahore.zz">Androon Lahore</a>.</p>\n</article>',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultAuthor) {
      setAuthor(defaultAuthor);
    }
  }, [defaultAuthor]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onPublishSubmit({ address, title, html, author });
      onPublished(address);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="publish-title"
      className="m-auto w-full max-w-lg rounded-xl border border-stone-300 bg-white p-6 shadow-2xl backdrop:bg-stone-900/40"
    >
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <h2 id="publish-title" className="text-base font-semibold text-stone-900">
          Publish a Site
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="rounded p-1 text-stone-400 hover:text-stone-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && (
          <div className="rounded-md bg-rose-50 p-2.5 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="pub-address" className="block text-xs font-medium text-stone-700">
            Address
          </label>
          <input
            id="pub-address"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value.toLowerCase())}
            placeholder="my-site.zz"
            className="mt-1 h-8 w-full rounded-md border border-stone-300 px-2.5 font-mono text-xs outline-none focus:border-stone-500"
          />
        </div>

        <div>
          <label htmlFor="pub-title" className="block text-xs font-medium text-stone-700">
            Title
          </label>
          <input
            id="pub-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Small Web Site"
            className="mt-1 h-8 w-full rounded-md border border-stone-300 px-2.5 text-xs outline-none focus:border-stone-500"
          />
        </div>

        <div>
          <label htmlFor="pub-author" className="block text-xs font-medium text-stone-700">
            Author
          </label>
          <select
            id="pub-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 h-8 w-full rounded-md border border-stone-300 bg-white px-2 text-xs outline-none focus:border-stone-500"
          >
            {people.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pub-html" className="block text-xs font-medium text-stone-700">
            HTML Page
          </label>
          <textarea
            id="pub-html"
            required
            rows={8}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 p-2.5 font-mono text-xs outline-none focus:border-stone-500"
            spellCheck="false"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Site'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
