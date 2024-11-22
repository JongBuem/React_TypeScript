import { LogConstant } from "common/constants";
import { MonitoringHostConstant } from "common/constants";
import { LogData } from "pages/schedule/types";

export class ScheduleHostLogDATA {
  public data: LogData[];

  constructor(result: LogData[]) {
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
    const newHostName = this.getValue(
      [LogConstant.LOG_KEY_RESOURCEID],
      objValue
    );
    const oldHostName = this.getValue(
      [
        LogConstant.LOG_KEY_HOSTINFO,
        MonitoringHostConstant.MONITORING_HOST_KEY_NAME,
      ],
      objValue
    );
    const sku = this.getValue(
      [
        LogConstant.LOG_KEY_HOSTINFO,
        MonitoringHostConstant.MONITORING_HOST_KEY_SKU,
        MonitoringHostConstant.MONITORING_HOST_KEY_SKU_NAME,
      ],
      objValue
    );
    const location = this.getValue(
      [
        LogConstant.LOG_KEY_HOSTINFO,
        MonitoringHostConstant.MONITORING_HOST_KEY_SKU_LOCATION,
      ],
      objValue
    );

    return {
      [LogConstant.LOG_HOST_KEY_SKU]: sku,
      [LogConstant.LOG_HOST_KEY_LOCATION]: location,
      [LogConstant.LOG_HOST_KEY_OLDNAME]: oldHostName,
      [LogConstant.LOG_HOST_KEY_NEWNAME]: newHostName,
    };
  }

  changeData(array: LogData[]) {
    const result = array.map((v) => {
      const obj = this.getObj(v);
      return obj;
    });
    return result;
  }

  init(array: LogData[]) {
    return this.changeData(array);
  }
}
