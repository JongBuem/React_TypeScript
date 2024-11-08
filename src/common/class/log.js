import {
  LOG_KEY_HOSTINFO,
  LOG_KEY_RESOURCEID,
  LOG_HOST_KEY_SKU,
  LOG_HOST_KEY_LOCATION,
  LOG_HOST_KEY_OLDNAME,
  LOG_HOST_KEY_NEWNAME,
} from 'common/constants/log.constant';
import {
  MONITORING_HOST_KEY_NAME,
  MONITORING_HOST_KEY_SKU,
  MONITORING_HOST_KEY_SKU_NAME,
  MONITORING_HOST_KEY_SKU_LOCATION,
} from 'common/constants/monitoring.constant';
import { MonitoringHostDATA } from './monitoring';

export class ScheduleHostLogDATA extends MonitoringHostDATA {
  constructor(result) {
    super({ data: result });
  }

  getObj(objValue) {
    const newHostName = this.getValue([LOG_KEY_RESOURCEID], objValue);
    const oldHostName = this.getValue(
      [LOG_KEY_HOSTINFO, MONITORING_HOST_KEY_NAME],
      objValue,
    );
    const sku = this.getValue(
      [LOG_KEY_HOSTINFO, MONITORING_HOST_KEY_SKU, MONITORING_HOST_KEY_SKU_NAME],
      objValue,
    );
    const location = this.getValue(
      [LOG_KEY_HOSTINFO, MONITORING_HOST_KEY_SKU_LOCATION],
      objValue,
    );

    return {
      [LOG_HOST_KEY_SKU]: sku,
      [LOG_HOST_KEY_LOCATION]: location,
      [LOG_HOST_KEY_OLDNAME]: oldHostName,
      [LOG_HOST_KEY_NEWNAME]: newHostName,
    };
  }
}
