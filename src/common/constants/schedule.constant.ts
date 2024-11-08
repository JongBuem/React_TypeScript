export const SCHEDULE_KEY_ID = "_id";
export const SCHEDULE_KEY_STATE = "useYn";
export const SCHEDULE_KEY_NAME = "scheduleName";
export const SCHEDULE_KEY_SUBSID = "subscriptionId";
export const SCHEDULE_KEY_HOST = "host";
export const SCHEDULE_KEY_TARGETHOSTLIST = "targetHostList";
export const SCHEDULE_KEY_SCHEDULETYPE = "scheduleType";
export const SCHEDULE_KEY_STARTDATETIME = "startDateTime";
export const SCHEDULE_KEY_REPEATCYCLEMONTH = "repeatCycleMonth";
export const SCHEDULE_KEY_REPEATCYCLEWEEK = "repeatCycleWeek";
export const SCHEDULE_KEY_REPEATCYCLEDAY = "repeatCycleDay";

export interface ScheduleData {
  _id: string;
  targetHostList: Array<string>;
  jobCount: number;
  useYn: boolean;
  tenantId: string;
  subscriptionId: string;
  scheduleName: string;
  firstStartDate: string | object | Date;
  startDateTime: string | object | Date;
  createUser: string;
  scheduleType: string;
  repeatCycleMonth: number | string;
  repeatCycleWeek: number | string;
  repeatCycleDay: number | string;
  createdAt: string;
  updatedAt: string;
  updateUser: string;
  host: any;
}
