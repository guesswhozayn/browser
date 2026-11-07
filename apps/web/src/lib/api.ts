import { PersonItem, SearchResultItem, SitePayload, VisitRecord } from '../types/browser';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchPeople(): Promise<PersonItem[]> {
  const res = await fetch(`${API_BASE}/people`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch people');
  return res.json();
}

export async function fetchSite(address: string): Promise<SitePayload | null> {
  const res = await fetch(`${API_BASE}/sites/${encodeURIComponent(address)}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch site: ${res.statusText}`);
  return res.json();
}

export async function searchSites(query: string): Promise<SearchResultItem[]> {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function fetchVisits(person: string): Promise<VisitRecord[]> {
  const res = await fetch(
    `${API_BASE}/visits?person=${encodeURIComponent(person)}&limit=100`,
    { cache: 'no-store' },
  );
  if (!res.ok) throw new Error('Failed to fetch visits');
  return res.json();
}

export async function recordVisit(
  person: string,
  address: string,
  via: string,
): Promise<void> {
  await fetch(`${API_BASE}/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ person, address, via }),
  });
}

export async function publishSite(data: {
  address: string;
  title: string;
  html: string;
  author: string;
}): Promise<SitePayload> {
  const res = await fetch(`${API_BASE}/sites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message
        ? Array.isArray(errorBody.message)
          ? errorBody.message.join(', ')
          : errorBody.message
        : 'Failed to publish site',
    );
  }
  return res.json();
}

