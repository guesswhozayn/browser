'use client';

import { useCallback, useState } from 'react';
import { NavigationEntry, VisitVia } from '../types/browser';

interface BrowserState {
  entries: NavigationEntry[];
  cursor: number;
}

export function useBrowserSession(initialAddress = 'androon-lahore.zz') {
  const [state, setState] = useState<BrowserState>(() => ({
    entries: [{ type: 'site', address: initialAddress, scrollY: 0 }],
    cursor: 0,
  }));

  const currentEntry: NavigationEntry =
    state.entries[state.cursor] || {
      type: 'site',
      address: initialAddress,
      scrollY: 0,
    };

  const canGoBack = state.cursor > 0;
  const canGoForward = state.cursor < state.entries.length - 1;

  const saveScroll = useCallback((scrollY: number) => {
    setState((prev) => {
      const updated = [...prev.entries];
      if (updated[prev.cursor]) {
        updated[prev.cursor] = { ...updated[prev.cursor], scrollY };
      }
      return { ...prev, entries: updated };
    });
  }, []);

  const navigate = useCallback(
    (entry: NavigationEntry, currentScrollY?: number) => {
      setState((prev) => {
        const truncated = prev.entries.slice(0, prev.cursor + 1);
        if (currentScrollY !== undefined && truncated[prev.cursor]) {
          truncated[prev.cursor] = {
            ...truncated[prev.cursor],
            scrollY: currentScrollY,
          };
        }
        return {
          entries: [...truncated, { ...entry, scrollY: 0 }],
          cursor: truncated.length,
        };
      });
    },
    [],
  );

  const goBack = useCallback((currentScrollY?: number) => {
    setState((prev) => {
      if (prev.cursor <= 0) return prev;
      const updated = [...prev.entries];
      if (currentScrollY !== undefined && updated[prev.cursor]) {
        updated[prev.cursor] = {
          ...updated[prev.cursor],
          scrollY: currentScrollY,
        };
      }
      return {
        entries: updated,
        cursor: prev.cursor - 1,
      };
    });
  }, []);

  const goForward = useCallback((currentScrollY?: number) => {
    setState((prev) => {
      if (prev.cursor >= prev.entries.length - 1) return prev;
      const updated = [...prev.entries];
      if (currentScrollY !== undefined && updated[prev.cursor]) {
        updated[prev.cursor] = {
          ...updated[prev.cursor],
          scrollY: currentScrollY,
        };
      }
      return {
        entries: updated,
        cursor: prev.cursor + 1,
      };
    });
  }, []);

  const resetSession = useCallback((address = 'androon-lahore.zz') => {
    setState({
      entries: [{ type: 'site', address, scrollY: 0 }],
      cursor: 0,
    });
  }, []);

  return {
    currentEntry,
    entries: state.entries,
    cursor: state.cursor,
    canGoBack,
    canGoForward,
    navigate,
    goBack,
    goForward,
    saveScroll,
    resetSession,
  };
}

