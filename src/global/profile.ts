import { create } from "zustand";

interface AdProfile {
  // 객체의 타입을 정의하세요. 예: 이름, 이메일 등
  [key: string]: any;
}

interface AdProfileState {
  adProfile: AdProfile;
  setAdProfile: (v: AdProfile) => void;
}

export const adProfileStore = create<AdProfileState>((set) => ({
  adProfile: {},
  setAdProfile(v) {
    set((state) => ({ adProfile: (state.adProfile = v) }));
  },
}));
