import React from 'react';
import { View } from 'react-native';
import { useProfileContext } from '@/features/profile/ProfileContext';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { ConstructionView } from '@/features/profile/ConstructionView';

function ProfileIndexContent() {
    const { sidebarChannels, selectedIndex, handleBackToMain } = useProfileContext();
    const selectedChannel = sidebarChannels[selectedIndex];

    if (selectedChannel && selectedChannel.id !== 'main') {
        return (
            <ConstructionView
                name={selectedChannel.name}
                onBack={handleBackToMain}
            />
        );
    }

    return (
        <View className="flex-1">
            <ProfileSection />
        </View>
    );
}

export default function ProfileIndex() {
    return <ProfileIndexContent />;
}
