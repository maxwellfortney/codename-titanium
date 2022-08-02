type Methods = "GET" | "POST" | "PUT" | "DELETE";

export const getFetchPostConfig = (method: Methods, data?: {}, headers?: {}): RequestInit => ({
    // Default options are marked with *
    method, // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
        "Content-Type": "application/json",
        ...headers,
        // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
});

export async function fetchGetJSON(url: string, headers?: {}, timeout?: number) {
    let controller: AbortController | undefined = undefined;
    let timeoutId = undefined;

    if (timeout !== undefined) {
        controller = new AbortController();

        timeoutId = setTimeout(() => controller?.abort(), timeout);
    }

    try {
        const response = await fetch(url, { headers, signal: timeout ? controller?.signal : undefined });
        clearTimeout(timeoutId);

        return await parseJsonFetchResponse(response);
    } catch (err: any) {
        throw new Error(`GET ${url}: ${err.message}`);
    }
}

async function parseJsonFetchResponse(response: Response) {
    if (response.ok) {
        return await response.json();
    } else {
        const errorText = await response.text();
        throw new Error(`[${response.status}] ${errorText}`);
    }
}
