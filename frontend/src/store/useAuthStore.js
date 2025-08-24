import { create } from "zustand";

const useAuthStore = create((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: "" }),
}));

export default useAuthStore;
