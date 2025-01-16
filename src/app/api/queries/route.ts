import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../firebase";
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const start = new Date().getTime();
        const payload = await req.json();

        const searchedItemsRef = collection(db, 'searchedItems');

        const docRef = await addDoc(searchedItemsRef, {
            query: payload.query,
            url: req.url,
            latencyInMs: new Date().getTime() - start,
            method: req.method,
        });

        return NextResponse.json({ docId: docRef.id });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Unknown error occurred" },
            { status: 500 }
        );
    }
}