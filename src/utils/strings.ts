export function cutAndAddEllipsis(string: string, cutLength: number) {
    return string.slice(0, cutLength) + "…";
}

export function cutMiddleAndAddEllipsis(string: string, beginLength: number = 4, endLength: number = 4) {
    return string.slice(0, beginLength) + "…" + string.slice(endLength * -1);
}

export function toCurrencyDisplay(amount: number) {
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}
