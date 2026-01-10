"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type UseFetchOptions = {
    enabled?: boolean;
};

export function useFetchData<T>(
    fetchFn: (...args: any[]) => Promise<T | { content: T[] }>,
    deps: any[] = [],
    args: any[] = [], 
    page = 0,
    size = 1000,
    options?: UseFetchOptions
) {
    const { enabled = true } = options ?? {};

    const [items, setItems] = useState<T | T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;
        if (!fetchFn) return;

        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const result = await fetchFn(...(args ?? []), page, size);

                if (cancelled) return;

                if (result && typeof result === "object" && "content" in result) {
                    setItems((result as { content: T[] }).content);
                } else {
                    setItems(Array.isArray(result) ? result : [result as T]);
                }
            } catch (err: any) {
                if (cancelled) return;

                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to fetch data";

                setError(message);
                toast.error(message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [enabled, page, size, fetchFn, ...deps]);

    return {
        data: items ?? [],
        loading,
        error,
    };
}
