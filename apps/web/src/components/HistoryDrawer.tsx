'use client';

import { VisitRecord } from '../types/browser';

interface HistoryDrawerProps {
  isOpen: boolean;
  person: string;
  visits: VisitRecord[];
  onSelectVisit: (address: string) => void;
  onClose: () => void;
}

export function HistoryDrawer({
  isOpen,
  person,
  visits,
  onSelectVisit,
  onClose,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <aside
      aria-label="Browsing history"
      className="absolute top-14 right-0 z-20 flex h-[calc(100%-3.5rem)] w-80 flex-col border-l border-stone-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            History
          </h2>
          <p className="text-sm font-medium text-stone-800">{person}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close history"
          className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2">
        {visits.length === 0 ? (
          <p className="p-4 text-center text-xs text-stone-500">No history recorded yet.</p>
        ) : (
          visits.map((v, i) => (
            <button
              key={`${v.address}-${v.visitedAt}-${i}`}
              type="button"
              onClick={() => onSelectVisit(v.address)}
              className="flex w-full flex-col items-start rounded-md p-2 text-left transition hover:bg-stone-50"
            >
              <span className="font-mono text-xs font-medium text-sky-800">
                {v.address}
              </span>
              <div className="mt-1 flex w-full items-center justify-between text-[11px] text-stone-500">
                <span className="capitalize text-stone-600 font-sans">via {v.via}</span>
                <time dateTime={v.visitedAt}>
                  {new Date(v.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

