import { create } from "zustand";
import { HostList, VmList } from "pages/monitoring/types";

interface HostState {
  host: HostList[]; // 호스트 배열
  setHost: (v: HostList[]) => void; // 호스트 설정 함수
}

interface VMState {
  vm: VmList[]; // VM 배열
  setVm: (v: VmList[]) => void; // VM 설정 함수
}

export const monitoringHostStore = create<HostState>((set) => ({
  host: [],
  setHost: (v) => {
    set(() => ({ host: v }));
  },
}));

export const monitoringVmStore = create<VMState>((set) => ({
  vm: [],
  setVm: (v) => {
    set(() => ({ vm: v }));
  },
}));
