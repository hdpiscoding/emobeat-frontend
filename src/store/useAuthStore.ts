import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    userId: number | null;
    setAuth: (token: string, userId: number) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            userId: null,
            setAuth: (token: string, userId: number) => set({ accessToken: token, userId }),
            clearAuth: () => set({ accessToken: null, userId: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage), // Sử dụng localStorage
        }
    )
);