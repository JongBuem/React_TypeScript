import { MonitoringData } from "pages/monitoring/types";
export const LOG_KEY_ID = "_id";
export const LOG_KEY_ACTION = "action";
export const LOG_KEY_STATUS = "status";
export const LOG_KEY_JOBCOUNT = "jobCount";
export const LOG_KEY_HOSTINFO = "hostInfo";
export const LOG_KEY_CREATEDAT = "createdAt";
export const LOG_KEY_RESOURCEID = "resourceId";
export const LOG_KEY_DESCRIPTION = "description";

export const LOG_HOST_KEY_SKU = "sku";
export const LOG_HOST_KEY_LOCATION = "location";
export const LOG_HOST_KEY_OLDNAME = "oldHostName";
export const LOG_HOST_KEY_NEWNAME = "newHostName";

export interface LogData {
  _id: string;
  action: string;
  subscriptionId: string;
  customerTenantId: string;
  scheduleId: string;
  status: string;
  resourceId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  jobCount: number;
  hostInfo: MonitoringData;
}

export interface ViewLogData {
  sku: string;
  location: string;
  oldHostName: string;
  newHostName: string;
}