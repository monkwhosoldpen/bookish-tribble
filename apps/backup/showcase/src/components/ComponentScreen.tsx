import { Button } from '@/registry/components/ui/button';
import { Input } from '@/registry/components/ui/input';
import { useScrollToTop } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { COMPONENTS } from '@showcase/lib/constants';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/components/ui/text';

cssInterop(FlashList, { className: 'style', contentContainerClassName: 'contentContainerStyle' });

const StyledFlashList = FlashList as any;

type ComponentItem = (typeof COMPONENTS)[number];

interface ComponentScreenProps {
  dashboardSection: React.ReactNode;
  notificationSection: React.ReactNode;
  syncDeviceSection?: React.ReactNode;
}

import Animated, { FadeInDown } from 'react-native-reanimated';

const ComponentListItem = React.memo(({ item, index }: { item: ComponentItem, index: number }) => (
  <Animated.View entering={FadeInDown.delay(index * 12).duration(300).springify().damping(15)}>
    <Button
      variant="outline"
      size="lg"
      unstable_pressDelay={30}
      className="dark:bg-background border-border flex-row justify-between rounded-none border-b-0 pl-4 pr-3.5 h-16 active:scale-[0.94] active:bg-zinc-100 dark:active:bg-zinc-900 transition-all border-l-0 border-r-0">
      <Text className="text-[15px] font-mono font-bold tracking-tighter uppercase">{item.name}</Text>
      <View className="w-2 h-2 rounded-full bg-primary/40 border border-primary/60 shadow-lg shadow-primary/30" />
    </Button>
  </Animated.View>
));

export const ComponentScreen = React.memo(function ComponentScreen({ dashboardSection, notificationSection, syncDeviceSection }: ComponentScreenProps) {
  const [search, setSearch] = React.useState('');
  const flashListRef = React.useRef<any>(null);
  useScrollToTop(flashListRef);

  const data = React.useMemo(() => {
    if (!search) return COMPONENTS;
    return COMPONENTS.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const renderItem: ListRenderItem<ComponentItem> = React.useCallback(
    ({ item, index }: { item: ComponentItem; index: number }) => (
      <ComponentListItem
        item={item}
        index={index}
      />
    ),
    [data.length]
  );

  return (
    <View
      className="mx-auto w-full max-w-screen-2xl flex-1 flex-col lg:flex-row">

      {/* Left/Top Content: Dashboard & Monitoring */}
      <View className="flex-1 lg:max-w-md xl:max-w-lg lg:border-r border-border h-full bg-zinc-50/50 dark:bg-zinc-900/30">
        <StyledFlashList
          data={[1]}
          renderItem={() => (
            <View className="px-4 py-8 gap-10">
              {dashboardSection}
              {notificationSection}
              {syncDeviceSection}
              <View className="android:pb-safe lg:pb-8 pb-32" />
            </View>
          )}
          estimatedItemSize={600}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Right/Bottom Content: Component Directory */}
      <View className="flex-1 xl:flex-[1.5] h-full">
        <StyledFlashList
          ref={flashListRef}
          data={data}
          onScroll={undefined}
          estimatedItemSize={56}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="px-4 pb-48 lg:pb-24 pt-4 lg:pt-8"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={(
            <View className="pb-8">
              <Text className="text-2xl font-mono font-bold tracking-tighter mb-4 hidden lg:flex uppercase">Component // Registry</Text>
              <View className="relative">
                <Input
                  placeholder="PULSE SEARCH // EXECUTE"
                  clearButtonMode="always"
                  value={search}
                  onChangeText={setSearch}
                  autoCorrect={false}
                  className="h-16 rounded-none bg-zinc-100/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 px-6 text-base font-mono font-bold tracking-tighter"
                />
              </View>
            </View>
          )}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
});
