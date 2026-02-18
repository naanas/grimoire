import { create } from 'zustand';

interface UIState {
    isMobileSummaryExpanded: boolean;
    setMobileSummaryExpanded: (expanded: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isMobileSummaryExpanded: false,
    setMobileSummaryExpanded: (expanded) => set({ isMobileSummaryExpanded: expanded }),
}));
