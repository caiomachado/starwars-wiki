import { NextRequest, NextResponse } from "next/server";

interface UserRouteParams {
    id: string;
}

export async function GET(req: NextRequest, { params }: { params: UserRouteParams }) {
    const { id } = params;

    try {
        const response = await fetch(`https://swapi.py4e.com/api/people/${id}`, {
            cache: 'force-cache',
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch person ${id}` },
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