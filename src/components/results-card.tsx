"use client";

import { twMerge } from "tailwind-merge";
import { Card } from "./card";
import { NavButton } from "./nav-button";
import { useRouter, useSearchParams } from "next/navigation";
import { Movie, Person } from "@/types";
import { X } from "lucide-react";
import { useTransition } from "react";
import { SearchResults } from "@/app/page";

function isPerson(item: Person | Movie): item is Person {
    return Boolean((item as Person).height);
}

type Props = {
    isSearching: boolean;
    searchResults: SearchResults;
    handleResults: (data: SearchResults) => void;
}

export function ResultsCard({ isSearching, searchResults, handleResults }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const searchValue = searchParams.get('search') || '';
    const optionValue = searchParams.get('option') || 'people';
    const isContentLoading = isSearching || isPending;

    function handleSeeDetails(name: string, url: string) {
        const isPersonUrl = url.includes('/people');
        const id = url.split('/').filter(Boolean).at(-1);

        router.push(`/${isPersonUrl ? 'people' : 'movies'}/${id}?search=${searchValue}&option=${optionValue}&name=${name}`);
    }

    function handlePage(url: string | null) {
        if (!url) return;

        startTransition(async () => {
            const response = await fetch(url, {
                cache: 'force-cache',
            })
            const data = await response.json();
            handleResults(data);
        })
    }

    function handleClearResults() {
        router.replace('/');
        handleResults(null);
    }

    return (
        <Card className={twMerge("w-full h-fit flex-col gap-2.5 lg:max-w-[582px] md:flex lg:h-[582px] lg:flex-1", searchResults ? 'flex' : 'hidden')}>
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg leading-[22px]">Results</h2>
                {searchResults && searchResults?.results?.length > 0 && (
                    <button type="button" onClick={handleClearResults} className="group">
                        <X size={22} className="group-hover:text-[#0ab463] transition" />
                    </button>
                )}
            </div>
            <hr className="w-full border-[#c4c4c4]" />

            <ul className={twMerge("flex-1 max-h-4/5 flex flex-col gap-2.5 overflow-y-auto pr-4 custom-scrollbar", (!searchResults?.results?.length || isContentLoading) && 'items-center justify-center')}>
                {searchResults && searchResults?.results?.length > 0 && !isContentLoading && searchResults?.results?.map((result) => {
                    const personResult = isPerson(result);

                    return (
                        <li key={personResult ? result?.name : result?.title} className="flex flex-col gap-2.5 font-bold">
                            <div className="flex flex-col gap-4 sm:justify-between sm:items-center sm:flex-row sm:gap-0">
                                {personResult ? result?.name : result?.title}

                                <button
                                    type="button"
                                    className="rounded-[17px] font-bold border text-white leading-[18px] transition text-sm py-2 px-5 bg-[#0ab463] border-[#0ab463] hover:shadow-md"
                                    onClick={() => handleSeeDetails(personResult ? result?.name : result?.title, result?.url)}
                                >
                                    SEE DETAILS
                                </button>
                            </div>
                            <hr className="w-full border-[#c4c4c4]" />
                        </li>
                    )
                })}

                {!searchResults?.results?.length && !isContentLoading && (
                    <li className="text-[#c4c4c4] text-sm font-bold text-center lg:max-w-[324px]">
                        There are zero matches.<br className="hidden lg:block" /> Use the form to search for People or Movies.
                    </li>
                )}

                {isContentLoading && (
                    <li className="text-[#c4c4c4] text-sm font-bold text-center max-w-[324px] animate-pulse">
                        Searching...
                    </li>
                )}
            </ul>

            {!isContentLoading && searchResults && searchResults?.results?.length > 0 && (
                <footer className="flex items-center justify-center gap-4">
                    <NavButton
                        type="button"
                        disabled={!searchResults?.previous}
                        onClick={() => handlePage(searchResults?.previous)}
                    >
                        Previous
                    </NavButton>

                    <NavButton
                        type="button"
                        disabled={!searchResults?.next}
                        onClick={() => handlePage(searchResults?.next)}
                    >
                        Next
                    </NavButton>
                </footer>
            )}
        </Card>
    )
}