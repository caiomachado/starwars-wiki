import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../firebase";
import { collection, addDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const searchValue = searchParams.get("search");
    const start = new Date().getTime();
    const queryData = {
        query: searchValue,
        url: req.url,
        method: req.method,
    }

    const searchedItemsRef = collection(db, 'searchedItems');

    try {
        const response = await fetch(`https://swapi.py4e.com/api/films?search=${searchValue}`, {
            cache: 'force-cache',
        })

        if (!response.ok) {
            await addDoc(searchedItemsRef, {
                ...queryData,
                latencyInMs: new Date().getTime() - start,
                success: false,
            });

            return NextResponse.json(
                { error: `Failed to fetch films with query ${searchValue}` },
                { status: 500 }
            );
        }

        const data = await response.json();

        await addDoc(searchedItemsRef, {
            ...queryData,
            latencyInMs: new Date().getTime() - start,
            success: true,
        });

        return NextResponse.json({ data });
    } catch (err) {
        console.error(err);
        await addDoc(searchedItemsRef, {
            ...queryData,
            latencyInMs: new Date().getTime() - start,
            success: false,
        });

        return NextResponse.json(
            { error: "Unknown server error" },
            { status: 500 }
        );
    }
}