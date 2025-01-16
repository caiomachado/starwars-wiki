import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const searchValue = searchParams.get("search");

    try {
        const response = await fetch(`https://swapi.py4e.com/api/people?search=${searchValue}`, {
            cache: 'force-cache',
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch people with query ${searchValue}` },
                { status: 500 }
            );
        }

        const data = await response.json();

        return NextResponse.json({ data });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: "Unknown server error" },
            { status: 500 }
        );
    }
}