export default function TokenListItemLoading() {
    const loadingGradient = "bg-gradient-to-r from-primary-shimmer to-secondary-shimmer";

    return (
        <div className="flex items-center w-full py-2 duration-300 animate-fade-in">
            <div className={`flex h-[40px] w-[40px] flex-none mr-3 rounded-full animate-pulse ${loadingGradient}`} />

            <div className="flex justify-between w-full h-[90%]">
                <div className="flex flex-col items-start justify-between w-1/2">
                    <div className={`flex animate-pulse ${loadingGradient} h-[12px] w-full rounded-md`} />
                    <div className={`flex animate-pulse ${loadingGradient} h-[12px] w-1/3 rounded-md`} />
                </div>
                <div className="flex flex-col items-end justify-between w-1/2">
                    <div className={`flex animate-pulse ${loadingGradient} h-[12px] w-1/2 rounded-md`} />
                    <div className={`flex animate-pulse ${loadingGradient} h-[12px] w-1/4 rounded-md`} />
                </div>
            </div>
        </div>
    );
}
