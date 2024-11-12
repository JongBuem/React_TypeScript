import { ScheduleData } from "./index";

export interface ScheduleInfoProps {
  scheduleInfo: ScheduleData | null;
}
export interface TapProps {
  title: string;
}
export interface ScheduleInformationStatusInputInputProps {
  value: boolean;
}
export interface ScheduleInformationSubscriptionInputInputProps {
  value: string;
}
export interface ScheduleInformationDateInputInputProps {
  value: string | object | Date;
}
export interface ScheduleInformationRepeatedInputValue {
  repeatedInput: string | number;
  repeated: string;
  week: number | string;
  dayofweek: number | string;
}
export interface ScheduleInformationRepeatedInputProps {
  value: ScheduleInformationRepeatedInputValue;
}
export interface EditHostInformationProps {
  scheduleInfo: ScheduleData | null;
}
