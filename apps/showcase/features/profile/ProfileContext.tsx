import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Entity, SidebarChannel } from './types';

interface ProfileContextValue {
    username: string;
    profileData: Entity | null;
    sidebarChannels: SidebarChannel[];
    selectedIndex: number;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    handleChannelSelect: (index: number) => void;
    handleBackToMain: () => void;
    toggleSidebar: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfileContext() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfileContext must be used within a ProfileProvider');
    }
    return context;
}

interface ProfileProviderProps {
    username: string;
    profileData: Entity | null;
    children: React.ReactNode;
}

export function ProfileProvider({ username, profileData, children }: ProfileProviderProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarChannels = useMemo<SidebarChannel[]>(() => {
        const base: SidebarChannel[] = [
            { id: 'main', name: 'Main Channel', type: 'main' }
        ];

        // Add mock channels based on entity data or defaults
        const sources: SidebarChannel[] = [
            { id: 'broadcast', name: 'Broadcast', type: 'broadcast', unread_count: 5 },
            { id: 'public', name: 'Public Room', type: 'public' },
            { id: 'twitter', name: 'Twitter', type: 'social' },
        ];

        return [...base, ...sources];
    }, []);

    const handleChannelSelect = useCallback((index: number) => {
        setSelectedIndex(index);
    }, []);

    const handleBackToMain = useCallback(() => {
        setSelectedIndex(0);
    }, []);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const value = useMemo(() => ({
        username,
        profileData,
        sidebarChannels,
        selectedIndex,
        sidebarOpen,
        setSidebarOpen,
        handleChannelSelect,
        handleBackToMain,
        toggleSidebar
    }), [username, profileData, sidebarChannels, selectedIndex, sidebarOpen, handleChannelSelect, handleBackToMain, toggleSidebar]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}
