import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export function NavButton({ className, children, ...props }: ComponentProps<'button'>) {
    return (
        <button
            {...props}
            className={twMerge("border border-[#0ab463] transition rounded-[4px] p-2 text-[#0ab463] hover:text-white hover:bg-[#0ab463] disabled:text-[#383838] disabled:opacity-50 disabled:border-[#383838] disabled:hover:bg-white", className)}
        >
            {children}
        </button>
    )
}