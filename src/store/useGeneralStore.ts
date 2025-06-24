import { create } from "zustand";

interface GeneralState {
    mode: "personal" | "driving" | "study";
    allowRecommend: boolean;
    detectInterval: number;
    recommendInterval: number;
    emotion: number;
    setMode: (mode: "personal" | "driving" | "study") => void;
    setAllowRecommend: (allow: boolean) => void;
    setDetectInterval: (interval: number) => void;
    setRecommendInterval: (interval: number) => void;
    setEmotion: (emotion: number) => void;
}

export const useGeneralStore = create<GeneralState>((set) => ({
    mode: "personal",
    allowRecommend: true,
    detectInterval: 500,
    recommendInterval: 10,
    emotion: 1,
    setMode: (mode) => set({ mode }),
    setAllowRecommend: (allow) => set({ allowRecommend: allow }),
    setDetectInterval: (interval) => set({ detectInterval: interval }),
    setRecommendInterval: (interval) => set({ recommendInterval: interval }),
    setEmotion: (emotion) => set({ emotion })
}));