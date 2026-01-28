import * as React from 'react';
import { View, ScrollView, Switch, ActivityIndicator, Pressable } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { useColorScheme } from 'nativewind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon } from '@/components/ui/Icon';
import { useNotifications } from '@/hooks/useNotifications';
import { PREFERENCE_KEYS } from '@/features/settings/constants';
import { useHaptics } from '@/contexts/HapticsContext';
import { NotificationSectionWeb } from '@/components/notifications/NotificationSectionWeb';
import { NotificationSectionNative } from '@/components/notifications/NotificationSectionNative';
import { Platform } from 'react-native';
import { COLOR_TOKENS } from '@/lib/design-tokens';

interface SettingsContentProps {
  isMobile: boolean;
  onSignOut: () => Promise<void>;
  isSigningOut: boolean;
}

export function SettingsContent({ isMobile, onSignOut, isSigningOut }: SettingsContentProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { preferences, updatePreference, enabled, isRegistering } = useNotifications();
  const { enabled: hapticsEnabled, setEnabled: setHapticsEnabled, success, error } = useHaptics();
  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState(true);

  const handleNotificationToggle = (value: boolean) => {
    updatePreference(PREFERENCE_KEYS.GLOBAL, value);
  };

  // Render platform-specific notification section
  const NotificationSection = Platform.OS === 'web' ? NotificationSectionWeb : NotificationSectionNative;

  const handleAutoSyncToggle = (value: boolean) => {
    setAutoSyncEnabled(value);
  };

  const handleHapticToggle = (value: boolean) => {
    setHapticsEnabled(value);
  };

  const handleThemeToggle = (value: boolean) => {
    setColorScheme(value ? 'dark' : 'light');
  };

  const handleSignOut = async () => {
    console.log('SettingsContent: handleSignOut called');
    try {
      await onSignOut();
      console.log('SettingsContent: onSignOut completed successfully');
      success();
    } catch (err) {
      console.log('SettingsContent: onSignOut failed', err);
      error();
    }
  };

  if (isMobile) {
    return <SettingsMobile
      NotificationSection={NotificationSection}
      autoSyncEnabled={autoSyncEnabled}
      onAutoSyncToggle={handleAutoSyncToggle}
      colorScheme={colorScheme}
      onThemeToggle={handleThemeToggle}
      hapticsEnabled={hapticsEnabled}
      onHapticToggle={handleHapticToggle}
      onSignOut={handleSignOut}
      isSigningOut={isSigningOut}
    />;
  }

  return <SettingsDesktop
    NotificationSection={NotificationSection}
    autoSyncEnabled={autoSyncEnabled}
    onAutoSyncToggle={handleAutoSyncToggle}
    colorScheme={colorScheme}
    onThemeToggle={handleThemeToggle}
    hapticsEnabled={hapticsEnabled}
    onHapticToggle={handleHapticToggle}
    onSignOut={handleSignOut}
    isSigningOut={isSigningOut}
  />;
}

// Shared props for both layouts
interface SettingsLayoutProps {
  NotificationSection: React.ComponentType;
  autoSyncEnabled: boolean;
  onAutoSyncToggle: (value: boolean) => void;
  colorScheme: string | undefined;
  onThemeToggle: (value: boolean) => void;
  hapticsEnabled: boolean;
  onHapticToggle: (value: boolean) => void;
  onSignOut: () => void;
  isSigningOut: boolean;
}

// ─── MOBILE: Twitter/X-style flat list ───
function SettingsMobile(props: SettingsLayoutProps) {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">

        {/* Notifications */}
        <View className="bg-background rounded-2xl border border-border/20 mx-4 mt-4">
          <SettingsSectionHeader label="Notifications" />
          <props.NotificationSection />
        </View>

        {/* Preferences */}
        <View className="bg-background rounded-2xl border border-border/20 mx-4 mt-4">
          <SettingsSectionHeader label="Preferences" />
          <View>
            <SettingsSwitchRow
              icon="sync"
              label="Auto Sync"
              description="Sync data automatically"
              value={props.autoSyncEnabled}
              onValueChange={props.onAutoSyncToggle}
            />
            <SettingsSwitchRow
              icon="dark-mode"
              label="Dark Mode"
              description={props.colorScheme === 'dark' ? 'On' : 'Off'}
              value={props.colorScheme === 'dark'}
              onValueChange={props.onThemeToggle}
            />
            <SettingsSwitchRow
              icon="vibration"
              label="Haptic Feedback"
              description={props.hapticsEnabled ? 'On' : 'Off'}
              value={props.hapticsEnabled}
              onValueChange={props.onHapticToggle}
            />
          </View>
        </View>

        {/* Account */}
        <View className="bg-background rounded-2xl border border-border/20 mx-4 mt-4">
          <SettingsSectionHeader label="Account" />
          <View>
            <SettingsActionRow
              icon="account-circle"
              label="Your account"
              description="Account information, password"
              onPress={() => {}}
            />
            <SettingsActionRow
              icon="help-outline"
              label="Help Center"
              description="Get help and support"
              onPress={() => {}}
            />
            <SettingsActionRow
              icon="info-outline"
              label="About"
              description="App version and information"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View className="bg-background rounded-2xl border border-border/20 mx-4 mt-4 mb-4">
          <SettingsActionRow
            icon="logout"
            label="Log out"
            description="Sign out of your account"
            onPress={props.onSignOut}
            isLoading={props.isSigningOut}
            isDestructive
          />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── DESKTOP: Twitter/X-style sidebar + content ───
function SettingsDesktop(props: SettingsLayoutProps) {
  const [activeSection, setActiveSection] = React.useState<string>('preferences');

  return (
    <View className="flex-1 flex-row bg-background">
      {/* Left sidebar - settings nav */}
      <View className="w-[280px] border-r border-border/20">
        <ScrollView className="flex-1 py-2" showsVerticalScrollIndicator={false}>
          <SidebarItem
            icon="tune"
            label="Preferences"
            active={activeSection === 'preferences'}
            onPress={() => setActiveSection('preferences')}
          />
          <SidebarItem
            icon="notifications-none"
            label="Notifications"
            active={activeSection === 'notifications'}
            onPress={() => setActiveSection('notifications')}
          />
          <SidebarItem
            icon="account-circle"
            label="Your account"
            active={activeSection === 'account'}
            onPress={() => setActiveSection('account')}
          />
          <SidebarItem
            icon="help-outline"
            label="Help Center"
            active={activeSection === 'help'}
            onPress={() => setActiveSection('help')}
          />
          <SidebarItem
            icon="info-outline"
            label="About"
            active={activeSection === 'about'}
            onPress={() => setActiveSection('about')}
          />

          <View className="h-px bg-border/20 mx-4 my-2" />

          <SidebarItem
            icon="logout"
            label="Log out"
            active={false}
            onPress={props.onSignOut}
            isDestructive
            isLoading={props.isSigningOut}
          />
        </ScrollView>
      </View>

      {/* Right content area */}
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="py-2">
          <View className="max-w-2xl mx-auto">
            {activeSection === 'preferences' && (
              <View className="bg-background rounded-2xl border border-border/20">
                <DesktopSectionHeader label="Preferences" />
                <View>
                  <SettingsSwitchRow
                    icon="sync"
                    label="Auto Sync"
                    description="Sync data automatically"
                    value={props.autoSyncEnabled}
                    onValueChange={props.onAutoSyncToggle}
                  />
                  <SettingsSwitchRow
                    icon="dark-mode"
                    label="Dark Mode"
                    description={props.colorScheme === 'dark' ? 'On' : 'Off'}
                    value={props.colorScheme === 'dark'}
                    onValueChange={props.onThemeToggle}
                  />
                  <SettingsSwitchRow
                    icon="vibration"
                    label="Haptic Feedback"
                    description={props.hapticsEnabled ? 'On' : 'Off'}
                    value={props.hapticsEnabled}
                    onValueChange={props.onHapticToggle}
                  />
                </View>
              </View>
            )}

            {activeSection === 'notifications' && (
              <View className="bg-background rounded-2xl border border-border/20">
                <DesktopSectionHeader label="Notifications" />
                <props.NotificationSection />
              </View>
            )}

            {activeSection === 'account' && (
              <View className="bg-background rounded-2xl border border-border/20">
                <DesktopSectionHeader label="Your account" />
                <View>
                  <SettingsActionRow
                    icon="account-circle"
                    label="Account information"
                    description="See your account information like email and phone number"
                    onPress={() => {}}
                  />
                  <SettingsActionRow
                    icon="lock-outline"
                    label="Change password"
                    description="Change your password at any time"
                    onPress={() => {}}
                  />
                </View>
              </View>
            )}

            {activeSection === 'help' && (
              <View className="bg-background rounded-2xl border border-border/20">
                <DesktopSectionHeader label="Help Center" />
                <View>
                  <SettingsActionRow
                    icon="help-outline"
                    label="Help topics"
                    description="Browse help articles and FAQs"
                    onPress={() => {}}
                  />
                  <SettingsActionRow
                    icon="email"
                    label="Contact us"
                    description="Reach out to our support team"
                    onPress={() => {}}
                  />
                </View>
              </View>
            )}

            {activeSection === 'about' && (
              <View className="bg-background rounded-2xl border border-border/20">
                <DesktopSectionHeader label="About" />
                <View>
                  <SettingsActionRow
                    icon="info-outline"
                    label="Version"
                    description="0.0.3"
                    onPress={() => {}}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// ─── Shared sub-components ───

function SettingsSectionHeader({ label }: { label: string }) {
  return (
    <View className="px-4 pt-4 pb-2">
      <Text className="text-xl font-bold text-foreground">{label}</Text>
    </View>
  );
}

function DesktopSectionHeader({ label }: { label: string }) {
  return (
    <View className="px-4 pt-4 pb-2">
      <Text className="text-xl font-bold text-foreground">{label}</Text>
    </View>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onPress,
  isDestructive,
  isLoading,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={cn(
        "flex-row items-center gap-3 px-4 py-3 active:bg-foreground/5",
        active && "bg-foreground/5 border-l-4 border-black"
      )}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLOR_TOKENS.destructive} />
      ) : (
        <Icon
          as={MaterialIcons}
          name={icon as any}
          size={20}
          className={cn(
            isDestructive ? "text-red-500" : active ? "text-foreground" : "text-muted-foreground"
          )}
        />
      )}
      <Text className={cn(
        "text-base",
        isDestructive ? "text-red-500 font-medium" : active ? "text-foreground font-bold" : "text-muted-foreground font-medium"
      )}>{label}</Text>
    </Pressable>
  );
}

function SettingsSwitchRow({
  icon,
  label,
  description,
  value,
  onValueChange,
}: {
  icon: string;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { colorScheme } = useColorScheme();
  const borderColor = colorScheme === 'dark' ? COLOR_TOKENS.dark.border : COLOR_TOKENS.light.border;

  return (
    <View className="flex-row items-center px-4 py-3 border-b border-border/20">
      <Icon as={MaterialIcons} name={icon as any} size={20} className="text-muted-foreground mr-3" />
      <View className="flex-1">
        <Text className="text-base font-normal text-foreground">{label}</Text>
        <Text className="text-sm text-muted-foreground mt-0.5">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: borderColor, true: COLOR_TOKENS.primary }}
        thumbColor={'#fff'}
        ios_backgroundColor={borderColor}
      />
    </View>
  );
}

function SettingsActionRow({
  icon,
  label,
  description,
  onPress,
  isLoading,
  isDestructive,
}: {
  icon: string;
  label: string;
  description: string;
  onPress: () => void;
  isLoading?: boolean;
  isDestructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className="flex-row items-center px-4 py-3 border-b border-border/20 active:bg-foreground/5"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isDestructive ? "#ef4444" : undefined} className="mr-3" />
      ) : (
        <Icon
          as={MaterialIcons}
          name={icon as any}
          size={20}
          className={cn("mr-3", isDestructive ? "text-red-500" : "text-muted-foreground")}
        />
      )}
      <View className="flex-1">
        <Text className={cn(
          "text-base font-normal",
          isDestructive ? "text-red-500" : "text-foreground"
        )}>{label}</Text>
        <Text className="text-sm text-muted-foreground mt-0.5">{description}</Text>
      </View>
      <Icon
        as={MaterialIcons}
        name="chevron-right"
        size={18}
        className={cn("text-muted-foreground/40", isDestructive && "text-red-300/60")}
      />
    </Pressable>
  );
}
