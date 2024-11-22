import {
  MonitoringHostConstant,
  MonitoringHostStatusesConstant,
  MonitoringVMConstant,
  MonitoringVMStatusesConstant,
} from "common/constants";
import { HostData } from "pages/schedule/types";
import { Monitoring, HostList, VmList } from "pages/monitoring/types";

export interface MonitoringHostDATAInterface {
  data: {
    newHosts: HostData[];
    oldHosts: HostData[];
  };
}

export interface MonitoringVmDATAInterface {
  data: Monitoring[];
}

export class MonitoringHostDATA {
  public data: [] | { newHosts: HostData[]; oldHosts: HostData[] };
  private _new: HostData[];
  private _old: HostData[];

  constructor(result: MonitoringHostDATAInterface) {
    this.data = Array.isArray(result?.data)
      ? result?.data
      : { newHosts: [], oldHosts: [] };
    this._new = Array.isArray(result?.data?.newHosts)
      ? result?.data?.newHosts
      : [];
    this._old = Array.isArray(result?.data?.oldHosts)
      ? result?.data?.oldHosts
      : [];
  }

  get new() {
    return this.nameSort(this._new);
  }
  get old() {
    return this.nameSort(this._old);
  }

  get host() {
    return this.old.concat(this.new);
  }

  nameSort(array: HostData[]) {
    const result = array.sort((a, b) => a?.name.localeCompare(b?.name));
    return result;
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

  getObj(objValue: Record<string, any>): Record<string, any> {
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
    const statuses = this.getValue(
      [
        MonitoringHostConstant.MONITORING_HOST_KEY_PROPERTIES,
        MonitoringHostConstant.MONITORING_HOST_KEY_INSTANCEVIEW,
        MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES,
      ],
      objValue,
      [{}]
    );
    const virtualMachines = this.getValue(
      [
        MonitoringHostConstant.MONITORING_HOST_KEY_PROPERTIES,
        MonitoringHostConstant.MONITORING_HOST_KEY_VIRTUALMACHINES,
      ],
      objValue,
      []
    );

    return {
      [MonitoringHostConstant.MONITORING_HOST_KEY_ID]: id,
      [MonitoringHostConstant.MONITORING_HOST_KEY_NAME]: name,
      [MonitoringHostConstant.MONITORING_HOST_KEY_SKU]: skuName,
      [MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES]:
        statuses[statuses.length - 1][
          MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES_DISPLAYSTATUS
        ],
      [MonitoringHostConstant.MONITORING_HOST_KEY_VIRTUALMACHINES]:
        virtualMachines,
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

export class MonitoringVmDATA {
  public data: Monitoring[];

  constructor(result: MonitoringVmDATAInterface) {
    this.data = Array.isArray(result?.data) ? result?.data : [];
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

  getObj(objValue: Record<string, any>): Record<string, any> {
    const id = this.getValue(
      [MonitoringVMConstant.MONITORING_VM_KEY_ID],
      objValue
    );
    const name = this.getValue(
      [MonitoringVMConstant.MONITORING_VM_KEY_NAME],
      objValue
    );
    const location = this.getValue(
      [MonitoringVMConstant.MONITORING_VM_KEY_LOCATION],
      objValue
    );
    const statuses = this.getValue(
      [
        MonitoringVMConstant.MONITORING_VM_KEY_PROPERTIES,
        MonitoringVMConstant.MONITORING_VM_KEY_INSTANCEVIEW,
        MonitoringVMConstant.MONITORING_VM_KEY_STATUSES,
      ],
      objValue,
      [{}]
    );
    return {
      [MonitoringVMConstant.MONITORING_VM_KEY_ID]: id,
      [MonitoringHostConstant.MONITORING_HOST_KEY_NAME]: name,
      [MonitoringVMConstant.MONITORING_VM_KEY_LOCATION]: location,
      [MonitoringVMConstant.MONITORING_VM_KEY_STATUSES]:
        statuses[statuses.length - 1][
          MonitoringVMConstant.MONITORING_VM_KEY_STATUSES_DISPLAYSTATUS
        ],
    };
  }

  changeData(array: Monitoring[]) {
    const result = array.map((v) => {
      const obj = this.getObj(v);
      return obj;
    });
    return result;
  }

  init(array: Monitoring[]) {
    return this.changeData(array);
  }
}

export class MonitoringData {
  public host: HostList[];
  public vm: VmList[];

  constructor(host: HostList[], vm: VmList[]) {
    this.host = Array.isArray(host) ? host : [];
    this.vm = Array.isArray(vm) ? vm : [];
  }

  findID(id1: string, id2: string) {
    if (id1.toUpperCase() === id2.toUpperCase()) return true;
    else return false;
  }

  gethostVm(hostVm: HostList[] = [], vm: VmList[] = []) {
    const result = hostVm.map((o) => {
      if (vm.find((p) => this.findID(p.id, o.id)))
        return vm.find((p) => this.findID(p.id, o.id));
      else return o;
    });
    return result;
  }

  changeData(parentArray: HostList[], childArray: VmList[]) {
    const result = parentArray.map((v) => {
      const virtualMachines = this.gethostVm(
        v[MonitoringHostConstant.MONITORING_HOST_KEY_VIRTUALMACHINES],
        childArray
      );
      return {
        ...v,
        virtualMachines,
      };
    });
    return result;
  }

  arrayDivision(array: any[], n: number) {
    let arr = [...array];
    let len = arr.length;
    let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
    let temp = [];
    for (let i = 0; i < cnt; i++) {
      temp.push(arr.splice(0, n));
    }
    return temp;
  }

  init(parentArray: HostList[], childArray: VmList[], division: boolean) {
    const result = this.changeData(parentArray, childArray);
    if (division)
      return this.arrayDivision(
        result,
        Math.abs(Math.round(result?.length / 2))
      );

    return result;
  }
}

export class MonitoringStatus {
  public list: HostData[] | Monitoring[];
  public type: string;

  constructor(list: HostData[] | Monitoring[], type: string) {
    this.list = Array.isArray(list) ? list : [];
    this.type = type;
  }

  gethostAvailable(array: HostList[]) {
    const result = array.filter(
      (v) =>
        v[MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES] ===
        MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE
    ).length;
    return result;
  }

  getVmRunning(array: VmList[]) {
    const result = array.filter(
      (v) =>
        v[MonitoringVMConstant.MONITORING_VM_KEY_STATUSES] ===
        MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING
    ).length;
    return result;
  }

  getHostStatus(array: HostList[]) {
    return {
      [MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE]:
        this.gethostAvailable(array),
    };
  }

  getVmStatus(array: VmList[]) {
    return {
      [MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING]:
        this.getVmRunning(array),
    };
  }

  init(array: HostList[] | VmList[], type: string) {
    if (type === MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_KEY)
      return this.getHostStatus(array as HostList[]);
    else if (type === MonitoringVMStatusesConstant.MONITORING_vm_STATUSES_KEY)
      return this.getVmStatus(array as VmList[]);
    else
      return {
        [MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE]: 0,
        [MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING]: 0,
      };
  }
}
