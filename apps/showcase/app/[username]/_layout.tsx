import React from 'react';
import { useLocalSearchParams, Slot } from 'expo-router';
import { ProfileProvider } from '@/features/profile/ProfileContext';
import { ProfileLayout } from '@/features/profile/ProfileLayout';
import { Entity } from '@/features/profile/types';

export default function UsernameLayout() {
    const { username } = useLocalSearchParams();

    // Mock data for the entity
    const profileData = React.useMemo<Entity>(() => ({
        username: typeof username === 'string' ? username : 'unknown',
        displayname: typeof username === 'string' ? username.charAt(0).toUpperCase() + username.slice(1) : 'Username',
        description: 'Digital creator and tech enthusiast. Building the future of social media through decentralized transmission nodes.',
        avatarurl: 'https://via.placeholder.com/160',
        bannerurl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000',
        client_type: 'managed',
    }), [username]);

    return (
        <ProfileProvider
            username={typeof username === 'string' ? username : 'unknown'}
            profileData={profileData}
        >
            <ProfileLayout>
                <Slot />
            </ProfileLayout>
        </ProfileProvider>
    );
}
