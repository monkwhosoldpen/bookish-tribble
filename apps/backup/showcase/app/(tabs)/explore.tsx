import { ExploreMobile, ExploreDesktop } from '@/features/explore';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomNav } from '@/components/layout/BottomNav';
import type { TabType } from '@/components/layout/BottomNav';

export default function ExploreTab() {
  return (
    <ScreenWrapper
      showHeader={false}
      bottomNav={<BottomNav activeTab={"explore" as TabType} />}
      mobileContent={<ExploreMobile />}
      desktopContent={<ExploreDesktop />}
      fullWidth
    />
  );
}
