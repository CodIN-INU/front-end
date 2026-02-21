// store/useDeptStore.ts
import { Tag } from '@/types/partners';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DeptState {
  dept: Tag;
  setDept: (dept: Tag) => void;
}

export const useDeptStore = create<DeptState>()(
  persist(
    set => ({
      dept: 'COMPUTER_SCI', // 기본값
      setDept: dept => set({ dept }),
    }),
    { name: 'dept-storage' } // localStorage key
  )
);
