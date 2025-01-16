"use client"

import { DetailsCard } from "@/components/details-card";
import { LoadingScreen } from "@/components/loading-screen";
import { PropsWithChildren, Suspense } from "react";

export default function MovieDetailsLayout({ children }: PropsWithChildren) {
    return (
        <DetailsCard>
            <Suspense fallback={<LoadingScreen className="my-auto" />}>
                {children}
            </Suspense>
        </DetailsCard>
    )
}