import * as Haptics from 'expo-haptics';

export class HapticsService {
    static async selection() {
        try {
            await Haptics.selectionAsync();
        } catch (error) {
            // Silently fail if haptics not available
        }
    }

    static async impact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
        try {
            await Haptics.impactAsync(style);
        } catch (error) {
            // Silently fail if haptics not available
        }
    }

    static async notification(type: Haptics.NotificationFeedbackType) {
        try {
            await Haptics.notificationAsync(type);
        } catch (error) {
            // Silently fail if haptics not available
        }
    }

    static async success() {
        return this.notification(Haptics.NotificationFeedbackType.Success);
    }

    static async error() {
        return this.notification(Haptics.NotificationFeedbackType.Error);
    }

    static async warning() {
        return this.notification(Haptics.NotificationFeedbackType.Warning);
    }
}

// Export convenience functions
export const haptics = {
    selection: HapticsService.selection,
    impact: HapticsService.impact,
    success: HapticsService.success,
    error: HapticsService.error,
    warning: HapticsService.warning,
};
