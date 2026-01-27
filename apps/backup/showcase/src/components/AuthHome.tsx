import * as React from 'react';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ShowcaseHeader } from '@/components/layout/ShowcaseHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { AuthHomeMobile } from '@/features/home/AuthHomeMobile';
import { AuthHomeDesktop } from '@/features/home/AuthHomeDesktop';

export const AuthHome = React.memo(function AuthHome() {
    return (
        <ScreenWrapper
            header={<ShowcaseHeader />}
            bottomNav={<BottomNav activeTab="home" />}
            fullWidth={true}
            mobileContent={<AuthHomeMobile />}
            desktopContent={<AuthHomeDesktop />}
        />
    );
});
