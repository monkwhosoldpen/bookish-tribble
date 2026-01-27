import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Entity, SidebarChannel } from './types';

interface ChannelContextValue {
    username: string;
    channelData: Entity | null;
    sidebarChannels: SidebarChannel[];
    selectedIndex: number;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    handleChannelSelect: (index: number) => void;
    handleBackToMain: () => void;
    toggleSidebar: () => void;
}

const ChannelContext = createContext<ChannelContextValue | null>(null);

export function useChannelContext() {
    const context = useContext(ChannelContext);
    if (!context) {
        throw new Error('useChannelContext must be used within a ChannelProvider');
    }
    return context;
}

interface ChannelProviderProps {
    username: string;
    channelData: Entity | null;
    children: React.ReactNode;
}

export function ChannelProvider({ username, channelData, children }: ChannelProviderProps) {
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
        channelData,
        sidebarChannels,
        selectedIndex,
        sidebarOpen,
        setSidebarOpen,
        handleChannelSelect,
        handleBackToMain,
        toggleSidebar
    }), [username, channelData, sidebarChannels, selectedIndex, sidebarOpen, handleChannelSelect, handleBackToMain, toggleSidebar]);

    return (
        <ChannelContext.Provider value={value}>
            {children}
        </ChannelContext.Provider>
    );
}
