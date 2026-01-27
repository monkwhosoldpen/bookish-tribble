import * as React from 'react';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomNav } from '@/components/layout/BottomNav';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { useAuth } from '@/contexts/AuthContext';
import * as Haptics from 'expo-haptics';
import { SettingsContent } from '@showcase/components/settings/SettingsContent';

export default function SettingsPage() {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ScreenWrapper
      header={<SettingsHeader />}
      bottomNav={<BottomNav activeTab="settings" />}
      mobileContent={
        <SettingsContent
          isMobile={true} 
          onSignOut={handleSignOut} 
          isSigningOut={isSigningOut}
        />
      }
      desktopContent={
        <SettingsContent 
          isMobile={false} 
          onSignOut={handleSignOut} 
          isSigningOut={isSigningOut}
        />
      }
      fullWidth={false}
    />
  );
}
