import { HostData } from "./index";

export interface ScheduleData {
  _id: string;
  targetHostList: Array<string>;
  jobCount: number;
  useYn: boolean;
  tenantId: string;
  subscriptionId: string;
  scheduleName: string;
  firstStartDate: string;
  startDateTime: string;
  createUser: string;
  scheduleType: string;
  repeatCycleMonth: number | string;
  repeatCycleWeek: number | string;
  repeatCycleDay: number | string;
  createdAt: string;
  updatedAt: string;
  updateUser: string;
  host: HostData[];
}

export interface ScheduleAllData {
  host: HostData;
  schedule: ScheduleData;
}

export type GetScheduleLogParameter = {
  customerId: string;
  scheduleID: string;
  refreshInterval: number;
};

export type GetScheduleLogType = {
  mutate: any;
  data: any;
  isLoading: boolean;
  isError: any;
};
