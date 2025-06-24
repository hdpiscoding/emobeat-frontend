import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RegisterState {
    email: string | null;
    password: string | null;
    username: string | null;
    fullName: string | null;
    gender: 'male' | 'female' | 'other' | null;
    nationality: string | null;
    birthday: string | null;
    setStep1: (email: string, password: string) => void;
    setStep2: (
        username: string,
        fullName: string,
        gender: 'male' | 'female' | 'other',
        nationality: string,
        birthday: string
    ) => void;
    clearRegister: () => void;
}

export const useRegisterStore = create<RegisterState>()(
    persist(
        (set) => ({
            email: null,
            password: null,
            username: null,
            fullName: null,
            gender: null,
            nationality: null,
            birthday: null,
            setStep1: (email: string, password: string) =>
                set({ email, password }),
            setStep2: (
                username: string,
                fullName: string,
                gender: 'male' | 'female' | 'other',
                nationality: string,
                birthday: string
            ) => set({ username, fullName, gender, nationality, birthday }),
            clearRegister: () =>
                set({
                    email: null,
                    password: null,
                    username: null,
                    fullName: null,
                    gender: null,
                    nationality: null,
                    birthday: null,
                }),
        }),
        {
            name: 'register-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);