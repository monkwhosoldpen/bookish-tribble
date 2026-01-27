import * as React from 'react';
import { fetchExploreFeed, type ExploreFeedResponse, type ExploreScenario } from './mockExploreData';

interface UseExploreFeedOptions {
    scenario?: ExploreScenario;
}

export function useExploreFeed({ scenario = 'default' }: UseExploreFeedOptions = {}) {
    const [data, setData] = React.useState<ExploreFeedResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const load = React.useCallback(async (nextScenario: ExploreScenario = scenario) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchExploreFeed(nextScenario);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        load(scenario);
    }, [scenario, load]);

    return {
        data,
        loading,
        error,
        refresh: load
    };
}
