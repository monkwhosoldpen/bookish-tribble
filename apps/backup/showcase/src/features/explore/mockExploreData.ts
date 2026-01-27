import type { ImageSourcePropType } from 'react-native';

// Configurable delay for API simulation (in milliseconds)
// Can be overridden via environment variable: MOCK_API_DELAY=5000
const MOCK_API_DELAY = Number(process.env.MOCK_API_DELAY) || 3000;

export type ExploreTrend = {
    id: string;
    category: string;
    title: string;
    subtitle?: string;
    tweetVolume?: string;
};

export type ExploreStory = {
    id: string;
    headline: string;
    summary: string;
    timestamp: string;
    image: ImageSourcePropType;
};

export type ExploreTopic = {
    id: string;
    label: string;
};

export type ExploreCreator = {
    id: string;
    name: string;
    handle: string;
    avatar: ImageSourcePropType;
    reason: string;
};

export interface ExploreFeedResponse {
    trends: ExploreTrend[];
    stories: ExploreStory[];
    topics: ExploreTopic[];
    creators: ExploreCreator[];
}

const trends: ExploreTrend[] = [
    {
        id: '1',
        category: 'Technology · Trending',
        title: 'Threads API',
        subtitle: 'Developers react to public API rollout',
        tweetVolume: '34.7K Tweets'
    },
    {
        id: '2',
        category: 'Music · Trending',
        title: 'Coachella 2026',
        subtitle: 'Day 1 lineup rumors drop',
        tweetVolume: '92K Tweets'
    },
    {
        id: '3',
        category: 'Sports · Live',
        title: 'Wolves vs. Heat',
        subtitle: 'Fourth quarter underway',
        tweetVolume: '58.2K Tweets'
    },
    {
        id: '4',
        category: 'Pop culture · Trending',
        title: 'Avatar Studios',
        subtitle: 'First look at the new series',
        tweetVolume: '120K Tweets'
    },
    {
        id: '5',
        category: 'Gaming · Trending',
        title: 'Elden Ring DLC',
        subtitle: 'Shadow of the Erdtree review drops',
        tweetVolume: '76.5K Tweets'
    }
];

const stories: ExploreStory[] = [
    {
        id: 'story-1',
        headline: 'SpaceX Starship completes third atmospheric test',
        summary: 'The rocket returned successfully after a record 18-minute flight profile.',
        timestamp: '2 hours ago',
        image: { uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' }
    },
    {
        id: 'story-2',
        headline: 'OpenAI teases new multimodal voice features for ChatGPT',
        summary: 'Developers get early access to streaming voice conversations with GPT-5 preview.',
        timestamp: '4 hours ago',
        image: { uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' }
    },
    {
        id: 'story-3',
        headline: 'Japan launches world\'s fastest maglev line',
        summary: 'The new Tokyo-Kyoto line reaches 500 km/h with carbon-neutral energy.',
        timestamp: 'Earlier today',
        image: { uri: 'https://images.unsplash.com/photo-1465446751832-9f11e125aaa7?auto=format&fit=crop&w=800&q=80' }
    }
];

const topics: ExploreTopic[] = [
    { id: 'topic-1', label: 'For you' },
    { id: 'topic-2', label: 'Trending' },
    { id: 'topic-3', label: 'News' },
    { id: 'topic-4', label: 'Sports' },
    { id: 'topic-5', label: 'Tech' },
    { id: 'topic-6', label: 'Entertainment' },
    { id: 'topic-7', label: 'Science' },
    { id: 'topic-8', label: 'Finance' }
];

const creators: ExploreCreator[] = [
    {
        id: 'creator-1',
        name: 'Jessie Hart',
        handle: '@jesshart',
        reason: 'Follows React Native Showcase',
        avatar: { uri: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80' }
    },
    {
        id: 'creator-2',
        name: 'Akira Nakamura',
        handle: '@akira.codes',
        reason: 'Talking about Expo Go',
        avatar: { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    },
    {
        id: 'creator-3',
        name: 'Miles Carter',
        handle: '@milescarter',
        reason: 'Popular in Technology',
        avatar: { uri: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=200&q=80' }
    }
];

export type ExploreScenario = 'default' | 'empty' | 'error';

export async function fetchExploreFeed(scenario: ExploreScenario = 'default'): Promise<ExploreFeedResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));

    if (scenario === 'error') {
        throw new Error('Something went wrong loading Explore. Please try again.');
    }

    if (scenario === 'empty') {
        return {
            trends: [],
            stories: [],
            topics,
            creators: []
        };
    }

    return {
        trends,
        stories,
        topics,
        creators
    };
}
