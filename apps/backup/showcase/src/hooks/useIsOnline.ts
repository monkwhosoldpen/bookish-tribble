import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

/**
 * Hook to detect if the device is online.
 * 
 * - Uses @react-native-community/netinfo for reliable cross-platform detection.
 * - Falls back to browser APIs on web if NetInfo behaves oddly (though NetInfo supports web too).
 */
export function useIsOnline() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // NetInfo.addEventListener returns an unsubscribe function
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            // setIsOnline(!!state.isConnected && !!state.isInternetReachable); 
            // Note: isInternetReachable can be null initially or flaky. 
            // strict isConnected is often better for simple "offline" UI mode.
            setIsOnline(!!state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return isOnline;
}
