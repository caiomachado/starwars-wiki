import { twMerge } from "tailwind-merge";

type Props = {
    className?: string;
};

export function LoadingScreen({ className }: Props) {
    return (
        <div className={twMerge("w-full flex items-center justify-center", className)}>
            <div className="relative flex items-center gap-4">
                <div className="flex items-center justify-center relative">
                    <div className="w-8 sm:w-20 h-3 bg-gray-800 rounded-lg shadow-inner border-2 border-gray-700 relative">
                        <div className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 w-1 h-1 bg-gray-500 rounded" />
                        <div className="absolute top-1/2 left-5 sm:left-10 transform -translate-y-1/2 w-1 h-1 bg-gray-500 rounded" />
                        <div className="hidden absolute top-1/2 right-2 transform -translate-y-1/2 w-3 sm:block h-1 bg-gray-700 rounded" />
                    </div>

                    <div className="w-60 sm:w-80 h-2 bg-[#0ab463] blur-sm rounded-r-lg absolute left-8 sm:left-20 animate-growMobile sm:animate-grow">
                        <div className="w-60 sm:w-80 h-4 animate-growMobile sm:animate-grow shadow-[inset_0_0_6px_8px_#0ab463] blur-md z-10" />
                    </div>
                </div>

                <span className="text-2xl text-stroke text-stroke-white font-bold tracking-[12px] sm:tracking-[28px] text-transparent bg-clip-text z-10">
                    LOADING
                </span>
            </div>
        </div>
    )
}