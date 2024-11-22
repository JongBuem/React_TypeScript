import { ScheduleConstant, MonitoringHostConstant } from "common/constants";
import { ScheduleData } from "pages/schedule/types";
import { HostData } from "pages/schedule/types";

export class ScheduleHostDATA {
  public data: HostData[];

  constructor(result: HostData[]) {
    this.data = Array.isArray(result) ? result : [];
  }

  getValue(keys: string[], value: Record<string, any>, defaultValue: any = "") {
    try {
      let tempObj: any = {};
      for (const i of keys) {
        if (tempObj[i]) tempObj = tempObj[i];
        else if (value[i]) tempObj = value[i];
        else tempObj = defaultValue;
      }
      return tempObj;
    } catch {
      return defaultValue;
    }
  }

  getObj(objValue: Record<string, any>) {
    const id = this.getValue(
      [MonitoringHostConstant.MONITORING_HOST_KEY_ID],
      objValue
    );
    const name = this.getValue(
      [MonitoringHostConstant.MONITORING_HOST_KEY_NAME],
      objValue
    );
    const skuName = this.getValue(
      [
        MonitoringHostConstant.MONITORING_HOST_KEY_SKU,
        MonitoringHostConstant.MONITORING_HOST_KEY_SKU_NAME,
      ],
      objValue
    );
    const location = this.getValue(
      [MonitoringHostConstant.MONITORING_HOST_KEY_SKU_LOCATION],
      objValue
    );
    const statuses = this.getValue(
      [
        MonitoringHostConstant.MONITORING_HOST_KEY_PROPERTIES,
        MonitoringHostConstant.MONITORING_HOST_KEY_INSTANCEVIEW,
        MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES,
      ],
      objValue,
      [{}]
    );

    return {
      [MonitoringHostConstant.MONITORING_HOST_KEY_ID]: id,
      [MonitoringHostConstant.MONITORING_HOST_KEY_NAME]: name,
      [MonitoringHostConstant.MONITORING_HOST_KEY_SKU]: skuName,
      [MonitoringHostConstant.MONITORING_HOST_KEY_SKU_LOCATION]: location,
      [MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES]:
        statuses[statuses.length - 1][
          MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES_DISPLAYSTATUS
        ],
    };
  }

  changeData(array: HostData[]) {
    const result = array.map((v) => {
      const obj = this.getObj(v);
      return obj;
    });
    return result;
  }

  init(array: HostData[]) {
    return this.changeData(array);
  }
}
export class ScheduleInfo {
  private _scheduleInfo: ScheduleData;

  constructor(scheduleInfo: ScheduleData) {
    this._scheduleInfo = scheduleInfo;
  }

  get scheduleInfo() {
    return this._scheduleInfo;
  }

  Week(value: number | string) {
    if (value === 1) return "첫째 주";
    else if (value === 2) return "둘째 주";
    else if (value === 3) return "셋째 주";
    else if (value === 4) return "넷째 주";
    else if (value === 5) return "다섯째 주";
    else return "";
  }

  Day(value: number | string) {
    if (value === 0) return "일요일";
    else if (value === 1) return "월요일";
    else if (value === 2) return "화요일";
    else if (value === 3) return "수요일";
    else if (value === 4) return "목요일";
    else if (value === 5) return "금요일";
    else if (value === 6) return "토요일";
    else return "";
  }

  useYn(value: ScheduleData) {
    if (value[ScheduleConstant.SCHEDULE_KEY_STATE]) return "활성화";
    else return "비활성화";
  }

  scheduleType(value: ScheduleData) {
    if (value[ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE] === "00")
      return "반복 안 함";
    else return "";
  }

  repeatCycleMonth(value: ScheduleData) {
    if (value[ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE] === "02")
      return `${
        value[ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEMONTH]
      }개월마다 `;
    else return "";
  }

  repeatCycleWeek(value: ScheduleData) {
    if (value[ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE] === "01")
      return `${value[ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEWEEK]}주마다 `;
    else if (value[ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE] === "02")
      return `${this.Week(
        value[ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEWEEK]
      )} `;
    else return "";
  }

  repeatCycleDay(value: ScheduleData) {
    if (value[ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE] !== "00")
      return this.Day(value[ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEDAY]);
    else return "";
  }

  get scheduleData() {
    const scheduleInfo = this.scheduleInfo;
    return {
      [ScheduleConstant.SCHEDULE_KEY_SUBSID]:
        scheduleInfo[ScheduleConstant.SCHEDULE_KEY_SUBSID] ?? "",
      [ScheduleConstant.SCHEDULE_KEY_STARTDATETIME]:
        scheduleInfo[ScheduleConstant.SCHEDULE_KEY_STARTDATETIME] ?? "",
      [ScheduleConstant.SCHEDULE_KEY_STATE]: this.useYn(scheduleInfo),
      [ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE]:
        this.scheduleType(scheduleInfo),
      [ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEMONTH]:
        this.repeatCycleMonth(scheduleInfo),
      [ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEWEEK]:
        this.repeatCycleWeek(scheduleInfo),
      [ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEDAY]:
        this.repeatCycleDay(scheduleInfo),
    };
  }

  get hostData() {
    const result = this.scheduleInfo[ScheduleConstant.SCHEDULE_KEY_HOST] ?? [];
    return result;
  }
}
