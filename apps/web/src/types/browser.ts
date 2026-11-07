export type VisitVia =
  | 'typed'
  | 'link'
  | 'history'
  | 'search'
  | 'back'
  | 'forward';

export interface SitePayload {
  address: string;
  title: string;
  html: string;
  author: string;
  updatedAt?: string;
}

export interface SearchResultItem {
  address: string;
  title: string;
  author: string;
  textContent: string;
  snippet: string;
  updatedAt?: string;
}

export interface VisitRecord {
  person: string;
  address: string;
  via: VisitVia;
  visitedAt: string;
}

export interface PersonItem {
  name: string;
}

export type ViewType = 'site' | 'search' | 'publish';

export interface NavigationEntry {
  type: ViewType;
  address?: string;
  query?: string;
  title?: string;
  scrollY?: number;
}

