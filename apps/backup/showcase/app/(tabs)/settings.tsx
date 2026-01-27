import { SettingsMobile } from '@/features/settings/SettingsMobile';
import { SettingsDesktop } from '@/features/settings/SettingsDesktop';
import { SettingsHeader } from '@/features/settings/SettingsHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsTab() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <ScreenWrapper
      header={<SettingsHeader />}
      bottomNav={<BottomNav activeTab="settings" />}
      mobileContent={<SettingsMobile onSignOut={handleSignOut} />}
      desktopContent={<SettingsDesktop onSignOut={handleSignOut} />}
      fullWidth
    />
  );
}
