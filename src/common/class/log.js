import { LogConstant } from "common/constants";

import { MonitoringHostConstant } from "common/constants";

import { MonitoringHostDATA } from "./monitoring";

export class ScheduleHostLogDATA extends MonitoringHostDATA {
  constructor(result) {
    super({ data: result });
  }

  getObj(objValue) {
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
}
