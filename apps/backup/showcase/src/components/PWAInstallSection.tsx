import * as React from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon } from '@/registry/components/ui/icon';

export function PWAInstallSection() {
    const [installPrompt, setInstallPrompt] = React.useState<any>(null);
    const [isAppInstalled, setIsAppInstalled] = React.useState(false);

    React.useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handleBeforeInstallPrompt = (e: any) => {
            // Don't prevent default to allow browser's automatic banner
            // Still store the event for the custom install button in settings
            setInstallPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsAppInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Check if already in standalone mode
        if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
            setIsAppInstalled(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;

        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    // Don't show anything on native platforms or if already installed/not supported
    if (Platform.OS !== 'web' || isAppInstalled || !installPrompt) {
        return null;
    }

    return (
        <View className="mb-4">
            <Pressable
                onPress={handleInstall}
                className="flex-row items-center gap-4 py-4 px-1 active:bg-zinc-100 dark:active:bg-zinc-900 transition-colors border-t border-zinc-100 dark:border-zinc-800"
            >
                <View className="w-5 h-5 items-center justify-center">
                    <Icon as={MaterialIcons} name="download" size={20} className="text-primary" />
                </View>
                <View className="flex-1">
                    <Text className="text-[15px] font-black">Install Showcase</Text>
                    <Text className="text-[13px] text-zinc-500 font-normal mt-0.5">Add to home screen for a native experience</Text>
                </View>
                <MaterialIcons name="chevron-right" size={16} className="text-zinc-300 dark:text-zinc-700" />
            </Pressable>
        </View>
    );
}
