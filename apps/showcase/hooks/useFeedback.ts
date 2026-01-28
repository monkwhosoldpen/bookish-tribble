import { useHaptics } from '@/contexts/HapticsContext';
import { useToast } from '@/components/ui/toast';
import { useCallback } from 'react';

/**
 * useFeedback - Centralized service for user interactions
 * Unifies haptics and toast notifications with consistent styles.
 */
export function useFeedback() {
    const { success: hapticSuccess, error: hapticError, impact } = useHaptics();
    const { showSuccess, showError } = useToast();

    const success = useCallback((message?: string) => {
        hapticSuccess();
        if (message) showSuccess(message);
    }, [hapticSuccess, showSuccess]);

    const error = useCallback((message?: string) => {
        hapticError();
        if (message) showError(message);
    }, [hapticError, showError]);

    return {
        success,
        error,
        impact,
        toast: { showSuccess, showError }
    };
}
