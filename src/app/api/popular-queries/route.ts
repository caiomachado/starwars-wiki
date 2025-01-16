import { NextResponse } from "next/server";
import { db } from "../../../../firebase";
import { collection, getDocs, writeBatch, doc, } from 'firebase/firestore';

export async function GET() {
    try {
        const searchedItemsRef = collection(db, 'topSearches');
        const documents = await getDocs(searchedItemsRef);

        const docsData = documents.docs.map((doc) => {
            return {
                query: doc.id,
                searchCount: doc.data().searchCount,
            };
        });

        const sortedArrayBySearchCount = docsData.toSorted((current, next) => {
            return next.searchCount - current.searchCount;
        }).slice(0, 5);

        return NextResponse.json({ data: sortedArrayBySearchCount });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Unknown error occurred" },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const searchedItemsRef = collection(db, 'searchedItems');
        const documents = await getDocs(searchedItemsRef);

        const docsData = documents.docs.map((doc) => doc.data());

        const currentPopularQueries = docsData.reduce((acc, cur) => {
            if (!acc[cur.query]) {
                acc[cur.query] = [cur];
            } else {
                acc[cur.query].push(cur);
            }
            return acc;
        }, {})

        const topSearchesRef = collection(db, 'topSearches');
        const batch = writeBatch(db);

        Object.entries(currentPopularQueries).forEach(([query, items]) => {
            const itemDocRef = doc(topSearchesRef, query);

            batch.set(itemDocRef, {
                searchCount: items.length,
            });
        });

        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Unknown error occurred" },
            { status: 500 }
        );
    }
}