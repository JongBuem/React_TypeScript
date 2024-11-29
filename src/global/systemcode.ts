import { create } from "zustand";

// 데이터 타입 정의
interface SystemcodeData {
  // 데이터의 구조를 정의 (예: id, name, value 등)
  [key: string]: any;
}

interface SystemcodeState {
  systemcode: SystemcodeData[]; // 데이터 배열
  setSystemcode: (v: SystemcodeData[]) => void; // 데이터 설정 함수
}

export const systemcodeStore = create<SystemcodeState>((set) => ({
  systemcode: [],
  setSystemcode(v) {
    set((state) => ({ systemcode: (state.systemcode = v) }));
  },
}));
