"use client";

import { useState } from "react";
import { Card } from "./card";
import { useSearchParams } from "next/navigation";

export type RadioValue = 'people' | 'films';

type Props = {
    isSearching: boolean;
    handleSearch: (searchValue: string, radioValue: RadioValue) => void;
    initialValue?: string;
}

export function SearchCard({ isSearching, handleSearch, initialValue }: Props) {
    const searchParams = useSearchParams();
    const optionValue = searchParams.get('option') || 'people';
    const [inputValue, setInputValue] = useState(initialValue ?? '');
    const [radioValue, setRadioValue] = useState<RadioValue>(optionValue as RadioValue);

    async function onSearch() {
        handleSearch(inputValue, radioValue)
        await fetch('/api/queries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: inputValue
            })
        })
    }

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

            <button
                type="button"
                className="rounded-[20px] w-full font-bold border text-white leading-[18px] text-sm py-2 px-4 bg-[#0ab463] border-[#0ab463] md:w-[260px] lg:w-full disabled:bg-[#c4c4c4] disabled:border-[#c4c4c4] disabled:hover:shadow-none hover:shadow-md transition"
                disabled={!inputValue}
                onClick={onSearch}
            >
                {isSearching ? 'SEARCHING...' : 'SEARCH'}
            </button>
        </Card>
    )
}