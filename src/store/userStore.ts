'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { fetchClient } from '@/api/clients/fetchClient';

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
    user: User | null;
    status: Status;
    hasHydrated: boolean;

    setUser: (u: User | null) => void;
    updateUser: (patch: Partial<User>) => void;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
    setHasHydrated: (v: boolean) => void;
};

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            status: 'idle',
            hasHydrated: false,

            setUser: (u) => set({ user: u, status: u ? 'authenticated' : 'unauthenticated' }),

            updateUser: (patch) => {
                const prev = get().user;
                if (!prev) return; // 로그인 안 된 상태면 무시
                const next = { ...prev, ...patch };
                set({ user: next, status: 'authenticated' });
            },

            fetchMe: async() => {
                 // 중복 호출 방지
                if (get().status === 'loading') return;
                set({ status: 'loading' });

                try{
                    const response = await fetchClient('/users');
                    const data = response.data

                    set({user: data, status: 'authenticated' });

                }catch{
                    set({ user: null, status: 'unauthenticated' });
                }
            },

            logout: async () => {
                set({ user: null, status: 'unauthenticated' });
                useAuth.persist.clearStorage?.()
            },

            setHasHydrated: (v) => set({ hasHydrated : v }),
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
            onRehydrateStorage: () => (state, error) =>{
                state?.setHasHydrated(true);
                if (error){
                    state?.setUser(null);
                }
            },
        }
    )
);