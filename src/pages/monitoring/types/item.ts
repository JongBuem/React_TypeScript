import { HostList, VmList } from "./index";

import {
  MonitoringHostStatusesConstant,
  MonitoringVMStatusesConstant,
} from "common/constants";

export interface ItemsIF {
  hostName: string;
  skuName: string;
  hostStatus: string;
  vm: string;
}
export interface VirtualMachinesIF {
  vmName: string;
  vmLocation: string;
  vmStatuse: string;
}
export type MonitoringStatusHost = {
  [MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE]: number;
};

export type MonitoringStatusVm = {
  [MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING]: number;
};

export type MonitoringStatusHostVm = {
  [MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE]: number;
  [MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING]: number;
};

export type SubscriptionIds = {
  id: string;
};

export interface ContentsHeadIF {
  hostList: HostList[];
  vmList: VmList[];
  subscriptionId: string;
  subscriptionIds: SubscriptionIds[];
  onChange: (value: string) => void;
}

export interface MonitoringSubscriptionInputIF
  extends Omit<ContentsHeadIF, "hostList" | "vmList"> {}
