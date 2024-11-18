import { create } from "zustand";

interface UIState {
    hoveredCategory: string | null;
    setHoveredCategory: (category: string) => void;

    isSidebarOpen: boolean;
    isModalOpen: boolean;
    isMenuOpen: boolean;
    isNavOpen: boolean;
    isAddCommentOpen: boolean;
    isShareOpen: boolean;
    isConfirmOpen: boolean;
    isAddressFormOpen: boolean;

    toggleSidebar: () => void;
    toggleModal: () => void;
    toggleMenu: () => void;
    toggleNav: () => void;
    setNavOpen: (isOpen: boolean) => void;
    toggleAddComment: () => void;
    toggleAddressForm: () => void;
    toggleShare: () => void;
    toggleConfirm: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    hoveredCategory: null,
    setHoveredCategory: (category) => set({ hoveredCategory: category }),

    isSidebarOpen: false,
    isModalOpen: false,
    isMenuOpen: false,
    isNavOpen: true,
    isAddCommentOpen: false,
    isShareOpen: false,
    isConfirmOpen: false,
    isAddressFormOpen: false,
    toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    toggleAddComment: () =>
        set((state) => ({ isAddCommentOpen: !state.isAddCommentOpen })),
    toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
    toggleShare: () => set((state) => ({ isShareOpen: !state.isShareOpen })),
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
    toggleAddressForm: () =>
        set((state) => ({ isAddCommentOpen: !state.isAddCommentOpen })),
    toggleConfirm: () =>
        set((state) => ({ isConfirmOpen: !state.isConfirmOpen })),
    setNavOpen: (isOpen) => set({ isNavOpen: isOpen }),
}));
