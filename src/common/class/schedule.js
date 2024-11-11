import {
  MONITORING_HOST_KEY_ID,
  MONITORING_HOST_KEY_NAME,
  MONITORING_HOST_KEY_SKU,
  MONITORING_HOST_KEY_SKU_NAME,
  MONITORING_HOST_KEY_SKU_LOCATION,
  MONITORING_HOST_KEY_PROPERTIES,
  MONITORING_HOST_KEY_INSTANCEVIEW,
  MONITORING_HOST_KEY_STATUSES,
  MONITORING_HOST_KEY_STATUSES_DISPLAYSTATUS,
} from "common/constants/monitoring.constant";
import {
  SCHEDULE_KEY_SUBSID,
  SCHEDULE_KEY_STATE,
  SCHEDULE_KEY_STARTDATETIME,
  SCHEDULE_KEY_SCHEDULETYPE,
  SCHEDULE_KEY_HOST,
  SCHEDULE_KEY_REPEATCYCLEMONTH,
  SCHEDULE_KEY_REPEATCYCLEWEEK,
  SCHEDULE_KEY_REPEATCYCLEDAY,
} from "common/constants/schedule.constant";
import { MonitoringHostDATA } from "./monitoring";

export class ScheduleHostDATA extends MonitoringHostDATA {
  constructor(result) {
    super(result);
  }
  getObj(objValue) {
    const id = this.getValue([MONITORING_HOST_KEY_ID], objValue);
    const name = this.getValue([MONITORING_HOST_KEY_NAME], objValue);
    const skuName = this.getValue(
      [MONITORING_HOST_KEY_SKU, MONITORING_HOST_KEY_SKU_NAME],
      objValue
    );
    const location = this.getValue(
      [MONITORING_HOST_KEY_SKU_LOCATION],
      objValue
    );
    const statuses = this.getValue(
      [
        MONITORING_HOST_KEY_PROPERTIES,
        MONITORING_HOST_KEY_INSTANCEVIEW,
        MONITORING_HOST_KEY_STATUSES,
      ],
      objValue,
      [{}]
    );

    return {
      [MONITORING_HOST_KEY_ID]: id,
      [MONITORING_HOST_KEY_NAME]: name,
      [MONITORING_HOST_KEY_SKU]: skuName,
      [MONITORING_HOST_KEY_SKU_LOCATION]: location,
      [MONITORING_HOST_KEY_STATUSES]:
        statuses[statuses.length - 1][
          MONITORING_HOST_KEY_STATUSES_DISPLAYSTATUS
        ],
    };
  }
}

export class ScheduleInfo {
  constructor(scheduleInfo) {
    this._scheduleInfo = scheduleInfo;
  }

  get scheduleInfo() {
    return this._scheduleInfo;
  }

  Week(value) {
    if (value === 1) return "첫째 주";
    else if (value === 2) return "둘째 주";
    else if (value === 3) return "셋째 주";
    else if (value === 4) return "넷째 주";
    else if (value === 5) return "다섯째 주";
    else return "";
  }

  Day(value) {
    if (value === 0) return "일요일";
    else if (value === 1) return "월요일";
    else if (value === 2) return "화요일";
    else if (value === 3) return "수요일";
    else if (value === 4) return "목요일";
    else if (value === 5) return "금요일";
    else if (value === 6) return "토요일";
    else return "";
  }

  useYn(value) {
    if (value[SCHEDULE_KEY_STATE]) return "활성화";
    else return "비활성화";
  }

  scheduleType(value) {
    if (value[SCHEDULE_KEY_SCHEDULETYPE] === "00") return "반복 안 함";
    else return "";
  }

  repeatCycleMonth(value) {
    if (value[SCHEDULE_KEY_SCHEDULETYPE] === "02")
      return `${value[SCHEDULE_KEY_REPEATCYCLEMONTH]}개월마다 `;
    else return "";
  }

  repeatCycleWeek(value) {
    if (value[SCHEDULE_KEY_SCHEDULETYPE] === "01")
      return `${value[SCHEDULE_KEY_REPEATCYCLEWEEK]}주마다 `;
    else if (value[SCHEDULE_KEY_SCHEDULETYPE] === "02")
      return `${this.Week(value[SCHEDULE_KEY_REPEATCYCLEWEEK])} `;
    else return "";
  }

  repeatCycleDay(value) {
    if (value[SCHEDULE_KEY_SCHEDULETYPE] !== "00")
      return this.Day(value[SCHEDULE_KEY_REPEATCYCLEDAY]);
    else return "";
  }

  get scheduleData() {
    const scheduleInfo = this.scheduleInfo;
    return {
      [SCHEDULE_KEY_SUBSID]: scheduleInfo[SCHEDULE_KEY_SUBSID] ?? "",
      [SCHEDULE_KEY_STARTDATETIME]:
        scheduleInfo[SCHEDULE_KEY_STARTDATETIME] ?? "",
      [SCHEDULE_KEY_STATE]: this.useYn(scheduleInfo),
      [SCHEDULE_KEY_SCHEDULETYPE]: this.scheduleType(scheduleInfo),
      [SCHEDULE_KEY_REPEATCYCLEMONTH]: this.repeatCycleMonth(scheduleInfo),
      [SCHEDULE_KEY_REPEATCYCLEWEEK]: this.repeatCycleWeek(scheduleInfo),
      [SCHEDULE_KEY_REPEATCYCLEDAY]: this.repeatCycleDay(scheduleInfo),
    };
  }

  get hostData() {
    const result = this.scheduleInfo[SCHEDULE_KEY_HOST] ?? [];
    return result;
  }
}
