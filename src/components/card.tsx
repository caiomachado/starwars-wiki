import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
    className?: string;
}

export function Card({ children, className }: PropsWithChildren<Props>) {
    return (
        <div className={twMerge("rounded-[4px] bg-white sm:py-4 sm:px-[30px] sm:border sm:border-[#dadada] sm:shadow-[0_1px_2px_0_#848484bf] lg:py-[30px]", className)}>
            {children}
        </div>
    )
}