import {
  MonitoringHostConstant,
  MonitoringHostStatusesConstant,
  MonitoringVMConstant,
  MonitoringVMStatusesConstant,
} from "common/constants";
// import { HostData } from "pages/schedule/types";
// import { MonitoringData as MonitoringDataIF } from "pages/monitoring/types";

// interface MonitoringHostDATAInterface {
//   data: {
//     newHosts: HostData[] | null[];
//     oldHosts: HostData[] | null[];
//   };
// }
// interface MonitoringDataInterface {
//   data: MonitoringDataIF[];
// }

// export class MonitoringHostDATA {
//   public data:
//     | []
//     | { newHosts: HostData[] | null[]; oldHosts: HostData[] | null[] };
//   private _new: HostData[] | null[];
//   private _old: HostData[] | null[];

//   constructor(result: MonitoringHostDATAInterface) {
//     this.data = Array.isArray(result?.data)
//       ? result?.data
//       : { newHosts: [], oldHosts: [] };
//     this._new = Array.isArray(result?.data?.newHosts)
//       ? result?.data?.newHosts
//       : [];
//     this._old = Array.isArray(result?.data?.oldHosts)
//       ? result?.data?.oldHosts
//       : [];
//   }

//   get new() {
//     return this.nameSort(this._new.filter((v) => v !== null));
//   }
//   get old() {
//     return this.nameSort(this._old.filter((v) => v !== null));
//   }

//   get host() {
//     return this.old.concat(this.new);
//   }

//   nameSort(array: HostData[]) {
//     const result = array.sort((a, b) => a?.name.localeCompare(b?.name));
//     return result;
//   }

//   getValue(keys: string[], value: Record<string, any>, defaultValue: any = "") {
//     try {
//       let tempObj: any = {};
//       for (const i of keys) {
//         if (tempObj[i]) tempObj = tempObj[i];
//         else if (value[i]) tempObj = value[i];
//         else tempObj = defaultValue;
//       }
//       return tempObj;
//     } catch {
//       return defaultValue;
//     }
//   }

//   getObj(objValue: Record<string, any>): Record<string, any> {
//     const id = this.getValue(
//       [MonitoringHostConstant.MONITORING_HOST_KEY_ID],
//       objValue
//     );
//     const name = this.getValue(
//       [MonitoringHostConstant.MONITORING_HOST_KEY_NAME],
//       objValue
//     );
//     const skuName = this.getValue(
//       [
//         MonitoringHostConstant.MONITORING_HOST_KEY_SKU,
//         MonitoringHostConstant.MONITORING_HOST_KEY_SKU_NAME,
//       ],
//       objValue
//     );
//     const statuses = this.getValue(
//       [
//         MonitoringHostConstant.MONITORING_HOST_KEY_PROPERTIES,
//         MonitoringHostConstant.MONITORING_HOST_KEY_INSTANCEVIEW,
//         MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES,
//       ],
//       objValue,
//       [{}]
//     );
//     const virtualMachines = this.getValue(
//       [
//         MonitoringHostConstant.MONITORING_HOST_KEY_PROPERTIES,
//         MonitoringHostConstant.MONITORING_HOST_KEY_VIRTUALMACHINES,
//       ],
//       objValue,
//       []
//     );

//     return {
//       [MonitoringHostConstant.MONITORING_HOST_KEY_ID]: id,
//       [MonitoringHostConstant.MONITORING_HOST_KEY_NAME]: name,
//       [MonitoringHostConstant.MONITORING_HOST_KEY_SKU]: skuName,
//       [MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES]:
//         statuses[statuses.length - 1][
//           MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES_DISPLAYSTATUS
//         ],
//       [MonitoringHostConstant.MONITORING_HOST_KEY_VIRTUALMACHINES]:
//         virtualMachines,
//     };
//   }

//   changeData(array: HostData[] | MonitoringDataIF[]) {
//     const result = array.map((v) => {
//       const obj = this.getObj(v);
//       return obj;
//     });
//     return result;
//   }

//   init(array: HostData[] | MonitoringDataIF[]) {
//     return this.changeData(array);
//   }
// }

// export class MonitoringVmDATA extends MonitoringHostDATA {
//   constructor(result) {
//     super(result);
//   }

//   getObj(objValue: Record<string, any>): Record<string, any> {
//     const id = super.getValue(
//       [MonitoringVMConstant.MONITORING_VM_KEY_ID],
//       objValue
//     );
//     const name = super.getValue(
//       [MonitoringVMConstant.MONITORING_VM_KEY_NAME],
//       objValue
//     );
//     const location = super.getValue(
//       [MonitoringVMConstant.MONITORING_VM_KEY_LOCATION],
//       objValue
//     );
//     const statuses = super.getValue(
//       [
//         MonitoringVMConstant.MONITORING_VM_KEY_PROPERTIES,
//         MonitoringVMConstant.MONITORING_VM_KEY_INSTANCEVIEW,
//         MonitoringVMConstant.MONITORING_VM_KEY_STATUSES,
//       ],
//       objValue,
//       [{}]
//     );
//     return {
//       [MonitoringVMConstant.MONITORING_VM_KEY_ID]: id,
//       [MonitoringHostConstant.MONITORING_HOST_KEY_NAME]: name,
//       [MonitoringVMConstant.MONITORING_VM_KEY_LOCATION]: location,
//       [MonitoringVMConstant.MONITORING_VM_KEY_STATUSES]:
//         statuses[statuses.length - 1][
//           MonitoringVMConstant.MONITORING_VM_KEY_STATUSES_DISPLAYSTATUS
//         ],
//     };
//   }
// }

// export class MonitoringData {
//   constructor(host, vm) {
//     this.host = Array.isArray(host) ? host : [];
//     this.vm = Array.isArray(vm) ? vm : [];
//   }

//   findID(id1, id2) {
//     if (id1.toUpperCase() === id2.toUpperCase()) return true;
//     else return false;
//   }

//   gethostVm(hostVm = [], vm = []) {
//     const result = hostVm.map((o) => {
//       if (vm.find((p) => this.findID(p.id, o.id)))
//         return vm.find((p) => this.findID(p.id, o.id));
//       else return o;
//     });
//     return result;
//   }

//   changeData(parentArray, childArray) {
//     const result = parentArray.map((v) => {
//       const virtualMachines = this.gethostVm(
//         v[MonitoringHostConstant.MONITORING_HOST_KEY_VIRTUALMACHINES],
//         childArray
//       );
//       return {
//         ...v,
//         virtualMachines,
//       };
//     });
//     return result;
//   }

//   arrayDivision(array, n) {
//     let arr = [...array];
//     let len = arr.length;
//     let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
//     let temp = [];
//     for (let i = 0; i < cnt; i++) {
//       temp.push(arr.splice(0, n));
//     }
//     return temp;
//   }

//   init(parentArray, childArray, division) {
//     const result = this.changeData(parentArray, childArray);
//     if (division)
//       return this.arrayDivision(
//         result,
//         Math.abs(Math.round(result?.length / 2))
//       );
//     return result;
//   }
// }

// export class MonitoringStatus {
//   constructor(list, type) {
//     this.list = Array.isArray(list) ? list : [];
//     this.type = type;
//   }

//   gethostAvailable(array) {
//     const result = array.filter(
//       (v) =>
//         v[MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES] ===
//         MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE
//     ).length;
//     return result;
//   }

//   getVmRunning(array) {
//     const result = array.filter(
//       (v) =>
//         v[MonitoringVMConstant.MONITORING_VM_KEY_STATUSES] ===
//         MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING
//     ).length;
//     return result;
//   }

//   getHostStatus(array) {
//     return {
//       [MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE]:
//         this.gethostAvailable(array),
//     };
//   }

//   getVmStatus(array) {
//     return {
//       [MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING]:
//         this.getVmRunning(array),
//     };
//   }

//   init(array, type) {
//     if (type === MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_KEY)
//       return this.getHostStatus(array);
//     else if (type === MonitoringVMStatusesConstant.MONITORING_vm_STATUSES_KEY)
//       return this.getVmStatus(array);
//     else
//       return {
//         [MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE]: 0,
//         [MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING]: 0,
//       };
//   }
// }
