"use client";

import { RadioValue, SearchCard } from "@/components/search-card";
import { Movie, Person } from "@/types";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResultsCard } from "@/components/results-card";

export type SearchResults = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[] | Movie[]
} | null;

export default function Home() {
  const [isSearching, startSearchTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<SearchResults>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get('search') || '';

  function handleResults(data: SearchResults) {
    setSearchResults(data);
  }

  const handleSearch = useCallback((filterValue: string, radioValue: RadioValue) => {
    const params = new URLSearchParams(searchParams);
    params.set('search', filterValue);
    const validatedRadioValue = (radioValue !== 'people' && radioValue !== 'films') ? 'people' : radioValue;
    params.set('option', validatedRadioValue);

    startSearchTransition(async () => {
      const response = await fetch(`/api/v1/${radioValue}?search=${filterValue}`);
      const { data } = await response.json();
      setSearchResults(data);
      router.push(`?${params.toString()}`)
    });

  }, [searchParams, router])

  useEffect(() => {
    const search = searchParams.get('search');
    const option = searchParams.get('option') as RadioValue;

    if (search && option && !searchResults && !isSearching) {
      handleSearch(search, option);
    }
  }, [handleSearch, searchParams, searchResults, isSearching])

  return (
    <main className="w-full flex flex-col items-center p-[30px] pt-0 pb-6 gap-[30px] lg:flex-row lg:max-w-5xl lg:mx-auto lg:items-start">
      <SearchCard isSearching={isSearching} handleSearch={handleSearch} initialValue={searchValue} />

      <ResultsCard isSearching={isSearching} handleResults={handleResults} searchResults={searchResults} />
    </main>
  );
}
