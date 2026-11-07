'use client';

import { SearchResultItem } from '../types/browser';

interface SearchViewProps {
  query: string;
  results: SearchResultItem[];
  loading: boolean;
  onNavigateSite: (address: string) => void;
}

export function SearchView({
  query,
  results,
  loading,
  onNavigateSite,
}: SearchViewProps) {
  return (
    <div className="h-full w-full overflow-y-auto bg-stone-50 px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-serif text-stone-900">
          Search Results for &ldquo;{query}&rdquo;
        </h2>
        <p className="mt-1 text-xs text-stone-500 font-mono">
          {loading ? 'Searching the web...' : `${results.length} pages found matching body prose`}
        </p>

        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="h-16 animate-pulse rounded-md bg-stone-200" />
            <div className="h-16 animate-pulse rounded-md bg-stone-200" />
            <div className="h-16 animate-pulse rounded-md bg-stone-200" />
          </div>
        ) : results.length === 0 ? (
          <div className="mt-12 rounded-lg border border-stone-200 bg-white p-8 text-center">
            <p className="text-sm text-stone-600">No pages found containing &ldquo;{query}&rdquo;.</p>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {results.map((res) => (
              <li
                key={res.address}
                className="rounded-lg border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigateSite(res.address)}
                    className="text-left font-medium text-sky-700 hover:underline"
                  >
                    {res.title}
                  </button>
                  <span className="font-mono text-xs text-stone-500">{res.address}</span>
                </div>
                <p className="mt-2 text-xs text-stone-500">By {res.author}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-700 font-serif">
                  {res.snippet}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

