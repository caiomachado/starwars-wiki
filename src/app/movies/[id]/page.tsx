import { Movie } from "@/types";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { Fragment } from "react";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ search: string, name: string, option: string }>;
}

export default async function MovieDetailsPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { search, name, option } = await searchParams;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/films/${id}`);
    const { data: movie }: { data: Movie } = await response.json();

    if (!movie.title) return (
        <>
            <h2 className="font-bold text-base sm:text-lg leading-[22px]">No data found for this movie ({name})</h2>
            <BackButton />
        </>
    );

    const promisePeopleResults = await Promise.allSettled(
        movie?.characters?.map(async (url) => {
            const response = await fetch(url, { cache: 'force-cache' });
            return response.json();
        })
    );
    const people = promisePeopleResults?.map((promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
            return {
                name: promiseResult.value.name,
                url: promiseResult.value.url
            }
        }
    });

    return (
        <>
            <h2 className="font-bold text-lg leading-[22px]">{movie.title}</h2>

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-[100px]">
                <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-base leading-[20px]">Opening Crawl</h3>
                    <hr className="w-full border-[#c4c4c4] mt-2.5 mb-[5px]" />

                    <p className="text-sm text-justify font-normal sm:text-left lg:max-w-[220px]">{movie.opening_crawl}</p>
                </div>

                <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-base leading-[20px]">Characters</h3>
                    <hr className="w-full border-[#c4c4c4] mt-2.5 mb-[5px]" />

                    <p className="text-sm font-normal">
                        {people.length > 0 && people.map((person, index) => {
                            const isLastItem = index === people.length - 1;
                            const personId = person?.url?.split('/').filter(Boolean).at(-1);
                            const url = `/people/${personId}?search=${search}&option=${option}&name=${person?.name}`;

                            return (
                                <Fragment key={person?.name}>
                                    <Link href={url} className="text-[#0094ff] underline">{person?.name}</Link>
                                    {!isLastItem && ', '}
                                </Fragment>
                            )
                        })}
                    </p>
                </div>
            </div>

            <BackButton />
        </>
    )
}