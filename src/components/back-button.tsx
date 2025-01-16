"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function BackButton() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchValue = searchParams.get('search') || '';
    const nameValue = searchParams.get('name') || '';
    const optionValue = searchParams.get('option') || 'people';

    return (
        <button
            type="button"
            className="mt-auto w-fit rounded-[20px] font-bold border text-white leading-[18px] text-sm py-2 px-7 bg-[#0ab463] border-[#0ab463] hover:shadow-md transition"
            onClick={() => router.push(`/?search=${searchValue || nameValue}&option=${optionValue}`)}
        >
            BACK TO SEARCH
        </button>
    )
}