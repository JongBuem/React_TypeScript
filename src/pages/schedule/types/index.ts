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
  host: any;
}

export interface VirtualMachineIDs {
  id: string;
}

export interface AllocatableVMs {
  vmSize: string;
  count: number;
}

export interface Statuses {
  code: string;
  level: string;
  displayStatus: string;
  time: string;
}

export interface HostData {
  _id: string;
  name: string;
  id: string;
  type: string;
  location: string;
  sku: {
    name: string;
  };
  properties: {
    platformFaultDomain: number;
    autoReplaceOnFailure: boolean;
    hostId: string;
    virtualMachines: VirtualMachineIDs[]; // VirtualMachineIDs[] or Array<VirtualMachineIDs>
    licenseType: string;
    provisioningTime: string;
    provisioningState: string;
    instanceView: {
      assetId: string;
      availableCapacity: {
        allocatableVMs: AllocatableVMs[];
      };
      statuses: Statuses[];
    };
    timeCreated: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleAllData {
  host: HostData;
  schedule: ScheduleData;
}

export interface GetScheduleInfoData extends ScheduleData {
  host: HostData;
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
