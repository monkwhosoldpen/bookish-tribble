import * as React from 'react';
import { View, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { useColorScheme } from 'nativewind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon } from '@/components/ui/Icon';
import { useNotifications } from '@/hooks/useNotifications';
import { PREFERENCE_KEYS } from '@/features/settings/constants';

interface SettingsContentProps {
  isMobile: boolean;
  onSignOut: () => Promise<void>;
  isSigningOut: boolean;
}

export function SettingsContent({ isMobile, onSignOut, isSigningOut }: SettingsContentProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { preferences, updatePreference, enabled, isRegistering } = useNotifications();
  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState(true);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = React.useState(true);

  const handleNotificationToggle = (value: boolean) => {
    updatePreference(PREFERENCE_KEYS.GLOBAL, value);
  };

  const handleAutoSyncToggle = (value: boolean) => {
    setAutoSyncEnabled(value);
  };

  const handleHapticToggle = (value: boolean) => {
    setHapticFeedbackEnabled(value);
  };

  const handleThemeToggle = (value: boolean) => {
    setColorScheme(value ? 'dark' : 'light');
  };

  const handleSignOut = async () => {
    await onSignOut();
  };

  const containerClasses = cn(
    "flex-1 bg-background",
    isMobile ? "px-4" : "px-8"
  );

  const contentClasses = cn(
    "flex-1",
    isMobile ? "py-6" : "py-8"
  );

  const gridClasses = isMobile 
    ? "gap-4" 
    : "flex-row flex-wrap gap-4";

  const itemWidthClasses = isMobile 
    ? "w-full" 
    : "w-full lg:w-[48%]";

  return (
    <View className={containerClasses}>
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerClassName={contentClasses}
      >
        <View className={cn("max-w-4xl mx-auto w-full", gridClasses)}>
          
          {/* Notifications Setting */}
          <View className={itemWidthClasses}>
            <SettingsCard>
              <SettingsSwitchRow
                icon="notifications"
                label="Notifications"
                description={preferences?.[PREFERENCE_KEYS.GLOBAL] ? "Push notifications enabled" : "Push notifications disabled"}
                value={preferences?.[PREFERENCE_KEYS.GLOBAL] ?? false}
                onValueChange={handleNotificationToggle}
              />
            </SettingsCard>
          </View>

          {/* Auto Sync Setting */}
          <View className={itemWidthClasses}>
            <SettingsCard>
              <SettingsSwitchRow
                icon="sync"
                label="Auto Sync"
                description={autoSyncEnabled ? "Automatic data sync enabled" : "Manual sync only"}
                value={autoSyncEnabled}
                onValueChange={handleAutoSyncToggle}
              />
            </SettingsCard>
          </View>

          {/* Theme Setting */}
          <View className={itemWidthClasses}>
            <SettingsCard>
              <SettingsSwitchRow
                icon="dark-mode"
                label="Dark Mode"
                description={colorScheme === 'dark' ? 'Dark theme active' : 'Light theme active'}
                value={colorScheme === 'dark'}
                onValueChange={handleThemeToggle}
              />
            </SettingsCard>
          </View>

          {/* Haptic Feedback Setting */}
          <View className={itemWidthClasses}>
            <SettingsCard>
              <SettingsSwitchRow
                icon="vibration"
                label="Haptic Feedback"
                description={hapticFeedbackEnabled ? "Touch feedback enabled" : "Touch feedback disabled"}
                value={hapticFeedbackEnabled}
                onValueChange={handleHapticToggle}
              />
            </SettingsCard>
          </View>

          {/* Account Actions */}
          <View className={cn(itemWidthClasses, isMobile ? "mt-6" : "mt-8")}>
            <SettingsCard>
              <View className="space-y-2">
                <SettingsActionRow
                  icon="account-circle"
                  label="Account"
                  description="Manage your account settings"
                  onPress={() => {}}
                />
                <View className="h-px bg-border/50 mx-4" />
                <SettingsActionRow
                  icon="help"
                  label="Help & Support"
                  description="Get help and contact support"
                  onPress={() => {}}
                />
                <View className="h-px bg-border/50 mx-4" />
                <SettingsActionRow
                  icon="info"
                  label="About"
                  description="App version and information"
                  onPress={() => {}}
                />
              </View>
            </SettingsCard>
          </View>

          {/* Sign Out */}
          <View className={cn(itemWidthClasses, isMobile ? "mt-4" : "mt-8")}>
            <SettingsCard variant="destructive">
              <SettingsActionRow
                icon="logout"
                label="Sign Out"
                description="Sign out of your account"
                onPress={handleSignOut}
                isLoading={isSigningOut}
                isDestructive
              />
            </SettingsCard>
          </View>

        </View>

        {/* Extra spacing for scroll */}
        <View className="h-32" />
      </ScrollView>
    </View>
  );
}

function SettingsCard({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "destructive" 
}) {
  const cardClasses = cn(
    "rounded-2xl border overflow-hidden",
    variant === "destructive" 
      ? "border-red-200/70 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/15"
      : "border-border/60 bg-background/80 dark:bg-zinc-900/70"
  );

  return <View className={cardClasses}>{children}</View>;
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
  return (
    <View className="flex-row items-center gap-4 p-4">
      <View className="w-10 h-10 rounded-xl items-center justify-center bg-primary/10">
        <Icon as={MaterialIcons} name={icon as any} size={20} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{label}</Text>
        <Text className="text-sm text-muted-foreground mt-0.5">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'hsl(214.3 31.8% 91.4%)', true: 'hsl(221.2 83.2% 53.3%)' }}
        thumbColor={'hsl(0 0% 100%)'}
        ios_backgroundColor="hsl(214.3 31.8% 91.4%)"
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
    <View className="flex-row items-center gap-4 p-4">
      <View className={cn(
        "w-10 h-10 rounded-xl items-center justify-center",
        isDestructive ? "bg-red-500/10" : "bg-primary/10"
      )}>
        {isLoading ? (
          <ActivityIndicator size="small" color={isDestructive ? "#ef4444" : undefined} />
        ) : (
          <Icon 
            as={MaterialIcons} 
            name={icon as any} 
            size={20} 
            className={cn(isDestructive ? "text-red-500" : "text-primary")} 
          />
        )}
      </View>
      <View className="flex-1">
        <Text className={cn(
          "text-base font-semibold",
          isDestructive && "text-red-500"
        )}>{label}</Text>
        <Text className="text-sm text-muted-foreground mt-0.5">{description}</Text>
      </View>
      <Icon 
        as={MaterialIcons} 
        name="chevron-right" 
        size={18} 
        className={cn(
          "text-muted-foreground/60",
          isDestructive && "text-red-300"
        )} 
      />
    </View>
  );
}
