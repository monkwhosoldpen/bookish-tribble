import * as React from 'react';
import { useDevices as useDevicesOriginal } from './useDevices';

interface DevicesContextValue {
    devices: ReturnType<typeof useDevicesOriginal>['devices'];
    followedChannels: ReturnType<typeof useDevicesOriginal>['followedChannels'];
    favouriteChannels: ReturnType<typeof useDevicesOriginal>['favouriteChannels'];
    loading: ReturnType<typeof useDevicesOriginal>['loading'];
    error: ReturnType<typeof useDevicesOriginal>['error'];
    refetch: ReturnType<typeof useDevicesOriginal>['refetch'];
    currentToken: ReturnType<typeof useDevicesOriginal>['currentToken'];
    removeDevice: ReturnType<typeof useDevicesOriginal>['removeDevice'];
}

const DevicesContext = React.createContext<DevicesContextValue | null>(null);

export function DevicesProvider({ children }: { children: React.ReactNode }) {
    const devicesData = useDevicesOriginal();

    return (
        <DevicesContext.Provider value={devicesData}>
            {children}
        </DevicesContext.Provider>
    );
}

export function useDevices() {
    const context = React.useContext(DevicesContext);
    if (!context) {
        throw new Error('useDevices must be used within DevicesProvider');
    }
    return context;
}
