import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type ReactNode = React.ReactNode;

export type User = SupabaseUser;

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: Error | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Convenience hooks for common use cases
export const useAuthUser = () => useAuth().user;
export const useAuthLoading = () => useAuth().loading;
export const useAuthIsAuthenticated = () => useAuth().isAuthenticated;
export const useAuthError = () => useAuth().error;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<{
        user: User | null;
        session: Session | null;
        loading: boolean;
        error: Error | null;
    }>({
        user: null,
        session: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let mounted = true;
        let sequenceId = 0;

        const initializeAuth = async () => {
            const currentSequence = ++sequenceId;
            try {
                const {
                    data: { session },
                    error: authError,
                } = await supabase.auth.getSession();

                if (authError) throw authError;

                if (mounted && currentSequence === sequenceId) {
                    setAuthState({
                        user: session?.user ?? null,
                        session: session ?? null,
                        loading: false,
                        error: null,
                    });
                }
            } catch (err) {
                if (mounted && currentSequence === sequenceId) {
                    setAuthState({
                        user: null,
                        session: null,
                        loading: false,
                        error: err instanceof Error ? err : new Error('Auth initialization failed'),
                    });
                }
            }
        };

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentSequence = ++sequenceId;
            if (mounted && currentSequence === sequenceId) {
                setAuthState(prev => ({
                    ...prev,
                    user: session?.user ?? null,
                    session: session ?? null,
                    loading: false,
                }));
            }
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                if (error.message === 'Invalid login credentials') {
                    throw new Error('Invalid email or password. Please try again.');
                } else if (error.message.includes('Email not confirmed')) {
                    throw new Error('Please confirm your email address before signing in.');
                } else {
                    throw new Error('Login failed. Please check your credentials and try again.');
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred during login.');
        }
    }, []);

    const signUp = useCallback(async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                if (error.message.includes('User already registered')) {
                    throw new Error('An account with this email already exists. Try signing in instead.');
                } else if (error.message.includes('Password should be at least')) {
                    throw new Error('Password must be at least 6 characters long.');
                } else if (error.message.includes('Invalid email')) {
                    throw new Error('Please enter a valid email address.');
                } else {
                    throw new Error('Sign up failed. Please try again.');
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred during sign up.');
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
            setAuthState(prev => ({ ...prev, user: null, session: null }));
        } catch (error) {
            throw error;
        }
    }, []);

    const value = useMemo(
        () => ({
            user: authState.user,
            session: authState.session,
            loading: authState.loading,
            isAuthenticated: !!authState.user,
            error: authState.error,
            signIn,
            signUp,
            signOut,
        }),
        [authState, signIn, signUp, signOut]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
