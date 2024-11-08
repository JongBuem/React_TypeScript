import { create } from 'zustand';
import moment from 'moment';

export const loadingStore = create((set) => ({
  loading: false,
  setLoading(v) {
    set((state) => ({ loading: (state.loading = v) }));
  },
}));

export const titleStore = create((set) => ({
  newTitle: '',
  setNewTitle(v) {
    set((state) => ({ newTitle: (state.newTitle = v) }));
  },
}));

export const statusStore = create((set) => ({
  status: true,
  setStatus(v) {
    set((state) => ({ status: (state.status = v) }));
  },
}));

export const subscriptionStore = create((set) => ({
  subscriptions: [{ id: '' }],
  setSubscriptions(v) {
    set((state) => ({ subscriptions: (state.subscriptions = v) }));
  },
  selectSubscription: '',
  setSelectSubscription(v) {
    set((state) => ({ selectSubscription: (state.selectSubscription = v) }));
  },
}));

export const dateStore = create((set) => ({
  newStartDate: moment().format('YYYY-MM-DD'),
  setNewStartDate(v) {
    set((state) => ({ newStartDate: (state.newStartDate = v) }));
  },
  newStartTime: moment().format('HH:mm'),
  setNewStartTime(v) {
    set((state) => ({ newStartTime: (state.newStartTime = v) }));
  },
}));

export const repeatedStore = create((set) => ({
  newRepeatedInput: '',
  setNewRepeatedInput(v) {
    set((state) => ({ newRepeatedInput: (state.newRepeatedInput = v) }));
  },
  newRepeated: '00',
  setNewRepeated(v) {
    set((state) => ({ newRepeated: (state.newRepeated = v) }));
  },
  newWeek: '1',
  setNewWeek(v) {
    set((state) => ({ newWeek: (state.newWeek = v) }));
  },
  newDayofweek: '0',
  setNewDayofweek(v) {
    set((state) => ({ newDayofweek: (state.newDayofweek = v) }));
  },
}));

export const hostStore = create((set) => ({
  newCheckHostList: [],
  setNewCheckHostList(v) {
    set((state) => ({ newCheckHostList: (state.newCheckHostList = v) }));
  },
}));
