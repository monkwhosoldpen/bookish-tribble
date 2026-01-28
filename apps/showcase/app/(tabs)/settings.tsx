import * as React from 'react';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomNav } from '@/components/layout/BottomNav';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { useAuth } from '@/contexts/AuthContext';
import { SettingsContent } from '@showcase/components/settings/SettingsContent';

export default function SettingsPage() {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    console.log('SettingsPage: handleSignOut called');
    setIsSigningOut(true);
    try {
      console.log('SettingsPage: calling signOut()');
      await signOut();
      console.log('SettingsPage: signOut() completed, redirecting');
      // Redirect to login after successful logout
      router.replace('/');
    } catch (error) {
      console.error('SettingsPage: Sign out failed:', error);
    } finally {
      console.log('SettingsPage: setting isSigningOut to false');
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
