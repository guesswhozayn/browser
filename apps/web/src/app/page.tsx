'use client';

import { useEffect, useRef, useState } from 'react';
import { HistoryDrawer } from '../components/HistoryDrawer';
import { PublishModal } from '../components/PublishModal';
import { SandboxedViewport } from '../components/SandboxedViewport';
import { SearchView } from '../components/SearchView';
import { Toolbar } from '../components/Toolbar';
import { useBrowserSession } from '../hooks/useBrowserSession';
import {
  fetchPeople,
  fetchSite,
  fetchVisits,
  publishSite,
  recordVisit,
  searchSites,
} from '../lib/api';
import {
  PersonItem,
  SearchResultItem,
  SitePayload,
  VisitRecord,
} from '../types/browser';

export default function BrowserHome() {
  const [people, setPeople] = useState<PersonItem[]>([]);
  const [activePerson, setActivePerson] = useState('Elena Vance');
  const [addressInput, setAddressInput] = useState('tidepool.zz');
  const [site, setSite] = useState<SitePayload | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyVisits, setHistoryVisits] = useState<VisitRecord[]>([]);
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const {
    currentEntry,
    canGoBack,
    canGoForward,
    navigate,
    goBack,
    goForward,
    saveScroll,
    resetSession,
  } = useBrowserSession('tidepool.zz');

  const currentScrollYRef = useRef(0);

  useEffect(() => {
    fetchPeople()
      .then((data) => {
        setPeople(data);
        if (data.length > 0 && !data.some((p) => p.name === activePerson)) {
          setActivePerson(data[0].name);
        }
      })
      .catch(() => {});
  }, []);

  const refreshHistory = (person: string) => {
    fetchVisits(person)
      .then(setHistoryVisits)
      .catch(() => {});
  };

  useEffect(() => {
    refreshHistory(activePerson);
  }, [activePerson]);

  useEffect(() => {
    if (currentEntry.type === 'site' && currentEntry.address) {
      setAddressInput(currentEntry.address);
      fetchSite(currentEntry.address)
        .then((s) => setSite(s))
        .catch(() => setSite(null));
    } else if (currentEntry.type === 'search' && currentEntry.query) {
      setAddressInput(`?${currentEntry.query}`);
      setIsSearching(true);
      searchSites(currentEntry.query)
        .then((res) => {
          setSearchResults(res);
          setIsSearching(false);
        })
        .catch(() => {
          setSearchResults([]);
          setIsSearching(false);
        });
    }
  }, [currentEntry]);

  function handleNavigate(address: string, via = 'link') {
    const cleanAddr = address.trim().toLowerCase();
    navigate({ type: 'site', address: cleanAddr }, currentScrollYRef.current);
    recordVisit(activePerson, cleanAddr, via).then(() =>
      refreshHistory(activePerson),
    );
  }

  function handleSubmitAddress(input: string) {
    if (input.startsWith('?')) {
      const q = input.slice(1).trim();
      navigate({ type: 'search', query: q }, currentScrollYRef.current);
    } else {
      handleNavigate(input, 'typed');
    }
  }

  function handleUserChange(newPerson: string) {
    setActivePerson(newPerson);
    resetSession('tidepool.zz');
    recordVisit(newPerson, 'tidepool.zz', 'typed');
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-stone-100">
      <Toolbar
        people={people}
        activePerson={activePerson}
        addressInput={addressInput}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isHistoryOpen={isHistoryOpen}
        onSelectPerson={handleUserChange}
        onAddressInputChange={setAddressInput}
        onSubmitAddress={handleSubmitAddress}
        onGoBack={() => goBack(currentScrollYRef.current)}
        onGoForward={() => goForward(currentScrollYRef.current)}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        onOpenPublish={() => setIsPublishOpen(true)}
      />

      <main className="relative flex-1 overflow-hidden">
        {currentEntry.type === 'site' ? (
          <SandboxedViewport
            site={site}
            address={currentEntry.address || addressInput}
            scrollY={currentEntry.scrollY || 0}
            onNavigate={(addr) => handleNavigate(addr, 'link')}
            onScrollChange={(y) => {
              currentScrollYRef.current = y;
              saveScroll(y);
            }}
          />
        ) : (
          <SearchView
            query={currentEntry.query || ''}
            results={searchResults}
            loading={isSearching}
            onNavigateSite={(addr) => handleNavigate(addr, 'search')}
          />
        )}

        <HistoryDrawer
          isOpen={isHistoryOpen}
          person={activePerson}
          visits={historyVisits}
          onSelectVisit={(addr) => {
            handleNavigate(addr, 'history');
            setIsHistoryOpen(false);
          }}
          onClose={() => setIsHistoryOpen(false)}
        />

        <PublishModal
          isOpen={isPublishOpen}
          people={people}
          defaultAuthor={activePerson}
          onClose={() => setIsPublishOpen(false)}
          onPublished={(addr) => handleNavigate(addr, 'typed')}
          onPublishSubmit={publishSite}
        />
      </main>
    </div>
  );
}
