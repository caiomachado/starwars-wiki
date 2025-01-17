"use client";

import { Fragment, useEffect, useState } from "react";
import { Card } from "./card";
import { useSearchParams } from "next/navigation";
import { PopularQuery } from "@/types";

export type RadioValue = 'people' | 'films';

type Props = {
    isSearching: boolean;
    handleSearch: (searchValue: string, radioValue: RadioValue) => void;
    initialValue?: string;
}

export function SearchCard({ isSearching, handleSearch, initialValue }: Props) {
    const searchParams = useSearchParams();
    const optionValue = searchParams.get('option') || 'people';
    const [popularQueries, setPopularQueries] = useState<PopularQuery[] | null>(null);
    const [inputValue, setInputValue] = useState(initialValue ?? '');
    const [radioValue, setRadioValue] = useState<RadioValue>(optionValue as RadioValue);

    useEffect(() => {
        async function getPopularQueries() {
            const response = await fetch('/api/v1/popular-queries');
            const { data } = await response.json();
            setPopularQueries(data);
        }

        getPopularQueries();
    }, [])

    return (
        <Card className="w-full h-fit flex flex-col gap-5 lg:max-w-[410px] lg:flex-1">
            <h2 className="font-semibold text-[#383838] text-sm leading-[18px]">What are you searching for?</h2>

            <div className="flex gap-[30px] items-center">
                <div className="flex items-center gap-2.5">
                    <input onChange={() => setRadioValue('people')} checked={radioValue === 'people'} type="radio" name="topic" id="people" className="size-4" />
                    <label htmlFor="people" className="font-bold text-sm leading-[18px]">People</label>
                </div>
                <div className="flex items-center gap-2.5">
                    <input onChange={() => setRadioValue('films')} checked={radioValue === 'films'} type="radio" name="topic" id="films" className="size-4" />
                    <label htmlFor="films" className="font-bold text-sm leading-[18px]">Movies</label>
                </div>
            </div>

            <input
                type="text"
                placeholder={radioValue === 'people' ? "e.g. Chewbacca, Yoda, Boba Fett" : 'e.g. A New Hope, Return of the Jedi'}
                className="rounded-[4px] leading-[18px] border text-sm text-[#383838] font-bold border-[#c4c4c4] h-10 w-full lg:shadow-[inset_0_1px_3px_0_#848484bf] px-2.5 placeholder:text-[#c4c4c4]"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
            />

            {popularQueries && (
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-[#383838] text-sm leading-[18px]">Popular</h3>

                    <p className="text-xs text-[#383838]">
                        {popularQueries?.length > 0 && popularQueries?.map((query, index) => {
                            return (
                                <Fragment key={`${query}-${index}`} >{index + 1}- {query.query} ({query.searchCount}){' '}</Fragment>
                            )
                        })}
                    </p>
                </div>
            )}

            <button
                type="button"
                className="rounded-[20px] w-full font-bold border text-white leading-[18px] text-sm py-2 px-4 bg-[#0ab463] border-[#0ab463] md:w-[260px] lg:w-full disabled:bg-[#c4c4c4] disabled:border-[#c4c4c4] disabled:hover:shadow-none hover:shadow-md transition"
                disabled={!inputValue}
                onClick={() => {
                    if (!isSearching) {
                        handleSearch(inputValue, radioValue)
                    }
                }}
            >
                {isSearching ? 'SEARCHING...' : 'SEARCH'}
            </button>
        </Card>
    )
}