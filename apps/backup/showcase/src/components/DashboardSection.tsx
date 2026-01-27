import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { cn } from '@/registry/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon } from '@/registry/components/ui/icon';
import { Text } from '@/registry/components/ui/text';
import { CircuitBoardPattern } from './ui/TechBackground';

interface User {
  id: string;
  email: string | undefined;
  [key: string]: any;
}

interface DashboardSectionProps {
  user: User | null;
  loading: boolean;
  onSignOut?: () => Promise<void>;
}

export const DashboardSection = React.memo(function DashboardSection({ user, loading }: DashboardSectionProps) {
  React.useEffect(() => {
    if (user) {
      }
  }, [user]);

  if (loading) {
    return (
      <View className="px-6 py-12 items-center justify-center">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }

  if (!user) return null;

  const handle = user.email?.split('@')[0]?.toLowerCase() || 'user';

  return (
    <View className="bg-background">
      {/* Engineering Banner */}
      <View className="h-44 bg-zinc-950 dark:bg-zinc-950 overflow-hidden relative border-b border-border/5">
        <CircuitBoardPattern />
      </View>

      <View className="bg-background px-4 pb-4">
        <View className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] px-6 pb-10 shadow-sm shadow-black/5 overflow-hidden">
          {/* Subtle Watermark */}
          <View className="absolute inset-0 opacity-[0.12] pointer-events-none">
            <CircuitBoardPattern />
          </View>

          <View className="-mt-16 flex-row items-end justify-between">
            <View className="w-32 h-32 rounded-full bg-background p-1.5 shadow-xl shadow-black/10">
              <View className="w-full h-full rounded-full bg-zinc-900 items-center justify-center overflow-hidden border border-border/10">
                <Icon as={MaterialIcons} name="person" size={64} className="text-zinc-600" />
              </View>
            </View>
            <View className="pb-3">
              <Pressable className="border border-border/40 bg-background/50 dark:bg-zinc-900/50 rounded-full px-6 py-2.5 active:bg-zinc-100 dark:active:bg-zinc-800 backdrop-blur-md">
                <Text className="text-[14px] font-bold tracking-tight text-foreground">Edit Profile</Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-5">
            <View className="flex-row items-center gap-2">
              <Text className="text-3xl font-extrabold tracking-tight leading-none text-foreground">{user.email?.split('@')[0] || 'User'}</Text>
              <Icon as={MaterialIcons} name="verified" size={22} className="text-primary fill-primary" />
            </View>
            <Text className="text-[16px] text-muted-foreground font-mono mt-1">@{handle}</Text>

            <Text className="text-[16px] text-foreground/90 font-mono leading-relaxed mt-4 max-w-[90%]">
              Full-stack developer building beautiful native apps.
              <Text className="text-foreground/40"> • </Text>
              <Text className="text-primary font-black">@showcase/registry</Text>
            </Text>

            <View className="flex-row flex-wrap items-center gap-2.5 mt-5">
              <ChipItem icon={MaterialIcons} text="Distributed Network" />
              <ChipItem icon={MaterialIcons} text="showcase.dev" className="bg-primary/10 border-primary/20" textClassName="text-primary font-semibold" />
              <ChipItem icon={MaterialIcons} text="Jan 2026" />
            </View>

            <View className="flex-row gap-8 mt-6 pb-2">
              <StatItem label="Registries" value="1.2k" />
              <StatItem label="Active Pulses" value="842" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

function ChipItem({ icon: IconComp, text, className, textClassName }: { icon: any, text: string, className?: string, textClassName?: string }) {
  return (
    <View className={cn("flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/40 bg-zinc-100/50 dark:bg-zinc-800/50", className)}>
      <IconComp size={13} className={cn("text-zinc-500", textClassName?.includes("text-primary") && "text-primary")} />
      <Text className={cn("text-[13px] font-medium text-zinc-600 dark:text-zinc-400", textClassName)}>{text}</Text>
    </View>
  )
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-2xl font-bold tracking-tighter text-foreground font-mono">{value}</Text>
      <Text className="text-[12px] text-zinc-500 font-bold tracking-widest uppercase">{label}</Text>
    </View>
  )
}

