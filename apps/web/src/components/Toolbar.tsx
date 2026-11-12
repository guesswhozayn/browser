'use client';

import { FormEvent, useState } from 'react';
import { PersonItem } from '../types/browser';

interface ToolbarProps {
  people: PersonItem[];
  activePerson: string;
  addressInput: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isHistoryOpen: boolean;
  onSelectPerson: (person: string) => void;
  onAddressInputChange: (val: string) => void;
  onSubmitAddress: (val: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onToggleHistory: () => void;
  onOpenPublish: () => void;
}

export function Toolbar({
  people,
  activePerson,
  addressInput,
  canGoBack,
  canGoForward,
  isHistoryOpen,
  onSelectPerson,
  onAddressInputChange,
  onSubmitAddress,
  onGoBack,
  onGoForward,
  onToggleHistory,
  onOpenPublish,
}: ToolbarProps) {
  const [isSearchMode, setIsSearchMode] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = addressInput.trim();
    if (!trimmed) return;
    onSubmitAddress(trimmed);
  }

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b border-stone-200 bg-white px-4 select-none">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onGoBack}
          disabled={!canGoBack}
          aria-label="Back"
          className="flex h-8 w-8 items-center justify-center rounded-md text-stone-700 transition hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onGoForward}
          disabled={!canGoForward}
          aria-label="Forward"
          className="flex h-8 w-8 items-center justify-center rounded-md text-stone-700 transition hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-1 items-center">
        <div className="relative flex w-full items-center">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => onAddressInputChange(e.target.value)}
            placeholder={isSearchMode ? "Search web prose..." : "Enter address (e.g. androon-lahore.zz) or ?search..."}
            className="h-9 w-full rounded-md border border-stone-300 bg-stone-50 px-3 pr-20 text-sm font-mono text-stone-800 placeholder-stone-400 outline-none transition focus:border-stone-500 focus:bg-white focus:ring-1 focus:ring-stone-500"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <button
            type="button"
            onClick={() => {
              if (!isSearchMode) {
                setIsSearchMode(true);
                if (!addressInput.startsWith('?')) {
                  onAddressInputChange(addressInput ? `?${addressInput}` : '?');
                }
              } else {
                setIsSearchMode(false);
                if (addressInput.startsWith('?')) {
                  onAddressInputChange(addressInput.slice(1));
                }
              }
            }}
            className="absolute right-2 rounded px-2 py-0.5 text-xs font-sans text-stone-500 hover:bg-stone-200"
          >
            {isSearchMode ? 'Address' : 'Search'}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-stone-600">
          <span className="hidden sm:inline">Browsing as:</span>
          <select
            value={activePerson}
            onChange={(e) => onSelectPerson(e.target.value)}
            className="h-8 rounded-md border border-stone-300 bg-white px-2 text-xs font-medium text-stone-800 outline-none focus:border-stone-500"
          >
            {people.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onToggleHistory}
          aria-expanded={isHistoryOpen}
          className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition ${
            isHistoryOpen ? 'bg-stone-200 text-stone-900' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </button>

        <button
          type="button"
          onClick={onOpenPublish}
          className="flex h-8 items-center gap-1 rounded-md bg-stone-900 px-3 text-xs font-medium text-white transition hover:bg-stone-800"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Publish
        </button>
      </div>
    </header>
  );
}

