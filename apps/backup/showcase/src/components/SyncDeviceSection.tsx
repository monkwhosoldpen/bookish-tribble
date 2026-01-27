import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { cn } from '@/registry/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDevices } from '@/hooks/useDevices';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@/registry/components/ui/icon';
import { Text } from '@/registry/components/ui/text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/components/ui/accordion';

export const SyncDeviceSection = React.memo(function SyncDeviceSection() {
  const { devices, loading, currentToken, refetch, removeDevice } = useDevices();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  if (loading && devices.length === 0) {
    return (
      <View className="p-12 items-center justify-center">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }

  return (
    <View className="bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-[2.5rem] px-6 py-8 mx-4 my-4">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 items-center justify-center">
            <Icon as={MaterialIcons} name="layers" size={20} className="text-zinc-500" />
          </View>
          <View>
            <Text className="text-xl font-black tracking-tighter">Pulse: Network</Text>
            <Text className="text-[12px] text-zinc-400 font-bold uppercase tracking-[0.15em]">Connected Hub</Text>
          </View>
        </View>
        <Pressable
          onPress={handleRefresh}
          disabled={isRefreshing}
          className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 items-center justify-center"
        >
          <Icon as={MaterialIcons} name="refresh" size={16} className={cn("text-zinc-500", isRefreshing && "animate-spin")} />
        </Pressable>
      </View>

      <Accordion type="multiple" collapsible className="w-full gap-3">
        {devices.slice(0, 5).map((device) => (
          <AccordionItem
            key={device.id}
            value={device.id}
            className={cn(
              "border rounded-3xl px-4",
              currentToken === device.fcm_token
                ? "bg-primary/5 border-primary/20"
                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
            )}
          >
            <AccordionTrigger className="py-4">
              <View className="flex-row items-center gap-4 flex-1">
                <View className={cn(
                  "w-10 h-10 rounded-2xl items-center justify-center",
                  currentToken === device.fcm_token ? "bg-primary" : "bg-white dark:bg-zinc-800"
                )}>
                  <Icon as={MaterialIcons} name={device.device_type === 'web' ? 'desktop-mac' : 'smartphone'} size={18} className={currentToken === device.fcm_token ? "text-white" : "text-zinc-500"} />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-black tracking-tight" numberOfLines={1}>
                    {device.device_name || `Anonymous Pulse`}
                  </Text>
                  {currentToken === device.fcm_token && (
                    <Text className="text-[12px] text-primary font-black uppercase tracking-widest">Local Link</Text>
                  )}
                </View>
              </View>
            </AccordionTrigger>
            <AccordionContent className="pb-4 ml-14">
              <View className="gap-2">
                <View className="flex-row items-center gap-2 mb-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <Text className="text-foreground text-[12px] font-bold uppercase tracking-widest">PULSE: ACTIVE // PUSH: ENABLED</Text>
                </View>
                <Text className="text-zinc-500 text-[13px] font-mono tracking-tighter">
                  LATENCY: STABLE // UPDATED: {formatDistanceToNow(new Date(device.last_used_at), { addSuffix: true }).toUpperCase()}
                </Text>
                <View className="flex-row justify-between items-center mt-3">
                  <View className="flex-row gap-2">
                    <View className="px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                      <Text className="text-[12px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tighter">{device.device_type === 'web' ? 'Browser' : device.device_type}</Text>
                    </View>
                  </View>
                  {currentToken !== device.fcm_token && (
                    <Pressable
                      onPress={() => removeDevice(device.fcm_token)}
                      className="px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20 active:bg-destructive/20"
                    >
                      <Text className="text-destructive text-[12px] font-black">Disconnect</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Pressable className="mt-8 py-5 rounded-none bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex-row items-center justify-center gap-3 active:scale-[0.94] transition-transform">
        <Text className="text-[14px] text-foreground font-mono font-bold tracking-widest uppercase">PULSE // MANAGE ALL LINKS ({devices.length})</Text>
        <Icon as={MaterialIcons} name="arrow-forward" size={16} className="text-foreground" />
      </Pressable>
    </View>
  );
});
