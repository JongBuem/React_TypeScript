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
  // errorMessage: string; //현재 등록된 두개의 스케줄의 로그가 다름
  // hostInfo: MonitoringData; //이건뭐지?
}

export interface ViewLogData {
  sku: string;
  location: string;
  oldHostName: string;
  newHostName: string;
}
