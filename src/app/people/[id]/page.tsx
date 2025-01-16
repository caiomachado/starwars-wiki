import { Person } from "@/types";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { Fragment } from "react";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ search: string, name: string, option: string }>;
}

export default async function PersonDetailsPage({ params, searchParams }: Props) {
    const { id } = await params;

    const { search, name, option } = await searchParams;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/people/${id}`);
    const { data: person }: { data: Person } = await response.json();

    if (!person.name) return (
        <>
            <h2 className="font-bold text-base sm:text-lg leading-[22px]">No data found for this person ({name})</h2>
            <BackButton />
        </>
    );

    const promiseMoviesResults = await Promise.allSettled(
        person.films.map(async (url) => {
            const response = await fetch(url, { cache: 'force-cache' });
            return response.json();
        })
    );
    const movies = promiseMoviesResults.map((promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
            return {
                name: promiseResult.value.title,
                url: promiseResult.value.url
            }
        }
    });

    return (
        <>
            <h2 className="font-bold text-lg leading-[22px]">{person.name}</h2>

            <div className="flex flex-col gap-8 sm:flex-row lg:gap-[100px]">
                <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-base leading-[20px]">Details</h3>
                    <hr className="w-full border-[#c4c4c4] mt-2.5 mb-[5px]" />

                    <p className="text-sm font-normal">
                        Birth Year: {person.birth_year}<br />
                        Gender: {person.gender}<br />
                        Eye Color: {person.eye_color}<br />
                        Hair Color: {person.hair_color}<br />
                        Height: {person.height}<br />
                        Mass: {person.mass}
                    </p>
                </div>

                <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-base leading-[20px]">Movies</h3>
                    <hr className="w-full border-[#c4c4c4] mt-2.5 mb-[5px]" />

                    <p className="text-sm font-normal">
                        {movies.length > 0 && movies.map((film, index) => {
                            const isLastItem = index === movies.length - 1;
                            const filmId = film?.url?.split('/').filter(Boolean).at(-1);
                            const url = `/movies/${filmId}?search=${search}&option=${option}&name=${film?.name}`;

                            return (
                                <Fragment key={film?.name}>
                                    <Link href={url} className="text-[#0094ff] underline">{film?.name}</Link>
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