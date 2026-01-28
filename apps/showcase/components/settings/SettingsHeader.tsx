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
      className="bg-background/95 border-b border-border/40 z-50 backdrop-blur-xl"
    >
      <View className="max-w-2xl mx-auto w-full h-[53px] flex-row items-center px-4">
        <Pressable
          onPress={() => router.replace('/')}
          className="w-9 h-9 rounded-full items-center justify-center active:bg-foreground/10 mr-6"
        >
          <Icon as={MaterialIcons} name="arrow-back" size={20} className="text-foreground" />
        </Pressable>
        <View>
          <Text className="text-[20px] font-bold tracking-tight text-foreground">Settings</Text>
        </View>
      </View>
    </View>
  );
}
