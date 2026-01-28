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
        async function fetchEntities() {
            try {
                const response = await fetch(`${CENTRAL_API_URL}/api/global/entities?limit=10`);

                if (!response.ok) {
                    throw new Error('Failed to fetch entities');
                }

                const json = await response.json();
                if (json.success && Array.isArray(json.data)) {
                    setData(json.data);
                } else {
                    // Fallback if data structure differs
                    setData([]);
                }
            } catch (err) {
                console.error('Failed to load who to follow:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        }

        fetchEntities();
    }, []);

    return { data, loading, error };
}
