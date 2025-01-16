import { PropsWithChildren } from "react";
import { Card } from "./card";

export function DetailsCard({ children }: PropsWithChildren) {
    return (
        <main className="mx-auto flex w-full p-[30px] pt-0 pb-6 gap-[30px]">
            <Card className="w-full mx-auto h-fit flex flex-col gap-[30px] lg:min-h-[417px] lg:w-[804px]">
                {children}
            </Card>
        </main>
    )
}