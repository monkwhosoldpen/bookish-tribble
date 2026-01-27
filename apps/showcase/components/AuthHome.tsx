import * as React from 'react';
import { ScreenWrapper } from './layout/ScreenWrapper';
import { ShowcaseHeader } from './layout/ShowcaseHeader';
import { BottomNav } from './layout/BottomNav';
import { AuthHomeMobile } from '../features/home/AuthHomeMobile';
import { AuthHomeDesktop } from '../features/home/AuthHomeDesktop';

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
