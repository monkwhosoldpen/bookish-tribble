import type { ImageSourcePropType } from 'react-native';

// Configurable delay for API simulation (in milliseconds)
const MOCK_API_DELAY = 3000;

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
        title: 'React Native Reusables',
        subtitle: 'New component library gains traction',
        tweetVolume: '34.7K Tweets'
    },
    {
        id: '2',
        category: 'Development · Hot',
        title: 'Expo Router v6',
        subtitle: 'Major update with improved navigation',
        tweetVolume: '28.3K Tweets'
    },
    {
        id: '3',
        category: 'Design · Rising',
        title: 'NativeWind 4.0',
        subtitle: 'Tailwind CSS for React Native evolves',
        tweetVolume: '15.2K Tweets'
    }
];

const stories: ExploreStory[] = [
    {
        id: '1',
        headline: 'Building Cross-Platform Apps with React Native',
        summary: 'Learn how to create beautiful, performant mobile applications using React Native and Expo.',
        timestamp: '2 hours ago',
        image: { uri: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80' }
    },
    {
        id: '2',
        headline: 'The Future of Mobile Development',
        summary: 'Exploring emerging trends in mobile app development and what they mean for developers.',
        timestamp: '5 hours ago',
        image: { uri: 'https://images.unsplash.com/photo-1551650975-87deedd944cb?auto=format&fit=crop&w=800&q=80' }
    },
    {
        id: '3',
        headline: 'Component Libraries That Actually Work',
        summary: 'A deep dive into component libraries that deliver on their promises for React Native development.',
        timestamp: '1 day ago',
        image: { uri: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' }
    }
];

const topics: ExploreTopic[] = [
    { id: '1', label: 'React Native' },
    { id: '2', label: 'Expo' },
    { id: '3', label: 'Mobile Dev' },
    { id: '4', label: 'TypeScript' },
    { id: '5', label: 'UI/UX' }
];

const creators: ExploreCreator[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        handle: '@sarahchen',
        avatar: { uri: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?auto=format&fit=crop&w=150&q=80' },
        reason: 'React Native expert sharing tips and tricks'
    },
    {
        id: '2',
        name: 'Marcus Johnson',
        handle: '@marcusj',
        avatar: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
        reason: 'Mobile developer advocate and educator'
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        handle: '@emilyr',
        avatar: { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
        reason: 'UI/UX designer specializing in mobile apps'
    }
];

export async function fetchExploreFeed(scenario: string = 'default'): Promise<ExploreFeedResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    // Simulate different scenarios
    switch (scenario) {
        case 'trending':
            return {
                trends: trends.slice(0, 2),
                stories: [],
                topics: topics.slice(0, 3),
                creators: []
            };
        case 'creators':
            return {
                trends: [],
                stories: [],
                topics: [],
                creators: creators
            };
        case 'stories':
            return {
                trends: [],
                stories: stories,
                topics: topics.slice(2, 5),
                creators: []
            };
        default:
            return {
                trends,
                stories,
                topics,
                creators
            };
    }
}

export type ExploreScenario = 'default' | 'trending' | 'creators' | 'stories';
