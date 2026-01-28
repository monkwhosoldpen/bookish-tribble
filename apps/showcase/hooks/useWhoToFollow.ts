import { useState, useEffect } from 'react';
import { CENTRAL_API_URL } from '@/lib/env';

export interface Entity {
    id: string;
    username: string;
    displayname?: string;
    avatarurl?: string;
    bio?: string;
    description?: string;
}

export function useWhoToFollow() {
    const [data, setData] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchEntities() {
            try {
                const response = await fetch(`${CENTRAL_API_URL}/api/global/entities?limit=10`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch entities');
                }

                const json = await response.json();
                if (json.success && Array.isArray(json.data)) {
                    setData(json.data);
                } else {
                    setData([]);
                }
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return;
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchEntities();

        return () => controller.abort();
    }, []);

    return { data, loading, error };
}
