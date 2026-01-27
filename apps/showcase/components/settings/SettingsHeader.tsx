import * as React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

export function SettingsHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-background/80 border-b border-border z-50 backdrop-blur-xl"
    >
      <View className="max-w-2xl mx-auto w-full h-14 flex-row items-center justify-between px-6">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.replace('/')}
            className="active:opacity-60 transition-opacity"
          >
            <View className="w-8 h-8 rounded-lg items-center justify-center">
              <Icon as={MaterialIcons} name="arrow-back" size={20} className="text-foreground" />
            </View>
          </Pressable>
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-lg bg-primary items-center justify-center">
              <Icon as={MaterialIcons} name="settings" size={18} className="text-primary-foreground" />
            </View>
            <Text className="text-xl font-black tracking-tighter text-foreground">SETTINGS</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
