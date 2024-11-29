import { create } from "zustand";
import moment from "moment";

// 타입 정의
interface LoadingState {
  loading: boolean;
  setLoading: (v: boolean) => void;
}

interface TitleState {
  newTitle: string;
  setNewTitle: (v: string) => void;
}

interface StatusState {
  status: boolean;
  setStatus: (v: boolean) => void;
}

interface Subscription {
  id: string;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  setSubscriptions: (v: Subscription[]) => void;
  selectSubscription: string;
  setSelectSubscription: (v: string) => void;
}

interface DateState {
  newStartDate: string;
  setNewStartDate: (v: string) => void;
  newStartTime: string;
  setNewStartTime: (v: string) => void;
}

interface RepeatedState {
  newRepeatedInput: string | number;
  setNewRepeatedInput: (v: string | number) => void;
  newRepeated: string;
  setNewRepeated: (v: string) => void;
  newWeek: string | number;
  setNewWeek: (v: string | number) => void;
  newDayofweek: string | number;
  setNewDayofweek: (v: string | number) => void;
}

interface HostState {
  newCheckHostList: any[]; // 데이터 구조에 맞게 타입 지정 필요
  setNewCheckHostList: (v: any[]) => void;
}

// Zustand 스토어
export const loadingStore = create<LoadingState>((set) => ({
  loading: false,
  setLoading: (v) => {
    set(() => ({ loading: v }));
  },
}));

export const titleStore = create<TitleState>((set) => ({
  newTitle: "",
  setNewTitle: (v) => {
    set(() => ({ newTitle: v }));
  },
}));

export const statusStore = create<StatusState>((set) => ({
  status: true,
  setStatus: (v) => {
    set(() => ({ status: v }));
  },
}));

export const subscriptionStore = create<SubscriptionState>((set) => ({
  subscriptions: [{ id: "" }],
  setSubscriptions: (v) => {
    set(() => ({ subscriptions: v }));
  },
  selectSubscription: "",
  setSelectSubscription: (v) => {
    set(() => ({ selectSubscription: v }));
  },
}));

export const dateStore = create<DateState>((set) => ({
  newStartDate: moment().format("YYYY-MM-DD"),
  setNewStartDate: (v) => {
    set(() => ({ newStartDate: v }));
  },
  newStartTime: moment().format("HH:mm"),
  setNewStartTime: (v) => {
    set(() => ({ newStartTime: v }));
  },
}));

export const repeatedStore = create<RepeatedState>((set) => ({
  newRepeatedInput: "",
  setNewRepeatedInput: (v) => {
    set(() => ({ newRepeatedInput: v }));
  },
  newRepeated: "00",
  setNewRepeated: (v) => {
    set(() => ({ newRepeated: v }));
  },
  newWeek: "1",
  setNewWeek: (v) => {
    set(() => ({ newWeek: v }));
  },
  newDayofweek: "0",
  setNewDayofweek: (v) => {
    set(() => ({ newDayofweek: v }));
  },
}));

export const hostStore = create<HostState>((set) => ({
  newCheckHostList: [],
  setNewCheckHostList: (v) => {
    set(() => ({ newCheckHostList: v }));
  },
}));
