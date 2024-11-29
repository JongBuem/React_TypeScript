import { create } from "zustand";

interface Customer {
  // Customer 객체의 타입을 정의하세요. 예: 이름, 이메일 등
  [key: string]: any;
}

interface CustomerState {
  customer: Customer;
  setCustomer: (v: Customer) => void;
}

export const customerStore = create<CustomerState>((set) => ({
  customer: {},
  setCustomer: (v) => {
    set(() => ({ customer: v }));
  },
}));
