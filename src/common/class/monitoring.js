import {
  MONITORING_HOST_KEY_ID,
  MONITORING_HOST_KEY_NAME,
  MONITORING_HOST_KEY_SKU,
  MONITORING_HOST_KEY_SKU_NAME,
  MONITORING_HOST_KEY_PROPERTIES,
  MONITORING_HOST_KEY_VIRTUALMACHINES,
  MONITORING_HOST_KEY_INSTANCEVIEW,
  MONITORING_HOST_KEY_STATUSES,
  MONITORING_HOST_KEY_STATUSES_DISPLAYSTATUS,
  MONITORING_HOST_STATUSES_KEY,
  MONITORING_HOST_STATUSES_AVAILABLE,
  MONITORING_VM_KEY_ID,
  MONITORING_VM_KEY_NAME,
  MONITORING_VM_KEY_LOCATION,
  MONITORING_VM_KEY_PROPERTIES,
  MONITORING_VM_KEY_INSTANCEVIEW,
  MONITORING_VM_KEY_STATUSES,
  MONITORING_VM_KEY_STATUSES_DISPLAYSTATUS,
  MONITORING_vm_STATUSES_KEY,
  MONITORING_VM_STATUSES_RUNNING,
} from 'common/constants/monitoring.constant';

export class MonitoringHostDATA {
  constructor(result) {
    this.data = Array.isArray(result?.data) ? result?.data : [];
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
    return this.nameSort(this._old.filter((v) => v));
  }

  get host() {
    return this.old.concat(this.new);
  }

  nameSort(array) {
    const result = array.sort((a, b) => a?.name.localeCompare(b?.name));
    return result;
  }

  getValue(keys = [], value = {}, defaultValue = '') {
    try {
      let tempObj = {};
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

  getObj(objValue) {
    const id = this.getValue([MONITORING_HOST_KEY_ID], objValue);
    const name = this.getValue([MONITORING_HOST_KEY_NAME], objValue);
    const skuName = this.getValue(
      [MONITORING_HOST_KEY_SKU, MONITORING_HOST_KEY_SKU_NAME],
      objValue,
    );
    const statuses = this.getValue(
      [
        MONITORING_HOST_KEY_PROPERTIES,
        MONITORING_HOST_KEY_INSTANCEVIEW,
        MONITORING_HOST_KEY_STATUSES,
      ],
      objValue,
      [{}],
    );
    const virtualMachines = this.getValue(
      [MONITORING_HOST_KEY_PROPERTIES, MONITORING_HOST_KEY_VIRTUALMACHINES],
      objValue,
      [],
    );

    return {
      [MONITORING_HOST_KEY_ID]: id,
      [MONITORING_HOST_KEY_NAME]: name,
      [MONITORING_HOST_KEY_SKU]: skuName,
      [MONITORING_HOST_KEY_STATUSES]:
        statuses[statuses.length - 1][
          MONITORING_HOST_KEY_STATUSES_DISPLAYSTATUS
        ],
      [MONITORING_HOST_KEY_VIRTUALMACHINES]: virtualMachines,
    };
  }

  changeData(array) {
    const result = array.map((v) => {
      const obj = this.getObj(v);
      return obj;
    });
    return result;
  }

  init(array) {
    return this.changeData(array);
  }
}

export class MonitoringVmDATA extends MonitoringHostDATA {
  constructor(result) {
    super(result);
  }

  getObj(objValue) {
    const id = super.getValue([MONITORING_VM_KEY_ID], objValue);
    const name = super.getValue([MONITORING_VM_KEY_NAME], objValue);
    const location = super.getValue([MONITORING_VM_KEY_LOCATION], objValue);
    const statuses = super.getValue(
      [
        MONITORING_VM_KEY_PROPERTIES,
        MONITORING_VM_KEY_INSTANCEVIEW,
        MONITORING_VM_KEY_STATUSES,
      ],
      objValue,
      [{}],
    );
    return {
      [MONITORING_VM_KEY_ID]: id,
      [MONITORING_HOST_KEY_NAME]: name,
      [MONITORING_VM_KEY_LOCATION]: location,
      [MONITORING_VM_KEY_STATUSES]:
        statuses[statuses.length - 1][MONITORING_VM_KEY_STATUSES_DISPLAYSTATUS],
    };
  }
}

export class MonitoringData {
  constructor(host, vm) {
    this.host = Array.isArray(host) ? host : [];
    this.vm = Array.isArray(vm) ? vm : [];
  }

  findID(id1, id2) {
    if (id1.toUpperCase() === id2.toUpperCase()) return true;
    else return false;
  }

  gethostVm(hostVm = [], vm = []) {
    const result = hostVm.map((o) => {
      if (vm.find((p) => this.findID(p.id, o.id)))
        return vm.find((p) => this.findID(p.id, o.id));
      else return o;
    });
    return result;
  }

  changeData(parentArray, childArray) {
    const result = parentArray.map((v) => {
      const virtualMachines = this.gethostVm(
        v[MONITORING_HOST_KEY_VIRTUALMACHINES],
        childArray,
      );
      return {
        ...v,
        virtualMachines,
      };
    });
    return result;
  }

  arrayDivision(array, n) {
    let arr = [...array];
    let len = arr.length;
    let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
    let temp = [];
    for (let i = 0; i < cnt; i++) {
      temp.push(arr.splice(0, n));
    }
    return temp;
  }

  init(parentArray, childArray, division) {
    const result = this.changeData(parentArray, childArray);
    if (division)
      return this.arrayDivision(
        result,
        Math.abs(Math.round(result?.length / 2)),
      );
    return result;
  }
}

export class MonitoringStatus {
  constructor(list, type) {
    this.list = Array.isArray(list) ? list : [];
    this.type = type;
  }

  gethostAvailable(array) {
    const result = array.filter(
      (v) =>
        v[MONITORING_HOST_KEY_STATUSES] === MONITORING_HOST_STATUSES_AVAILABLE,
    ).length;
    return result;
  }

  getVmRunning(array) {
    const result = array.filter(
      (v) => v[MONITORING_VM_KEY_STATUSES] === MONITORING_VM_STATUSES_RUNNING,
    ).length;
    return result;
  }

  getHostStatus(array) {
    return {
      [MONITORING_HOST_STATUSES_AVAILABLE]: this.gethostAvailable(array),
    };
  }

  getVmStatus(array) {
    return {
      [MONITORING_VM_STATUSES_RUNNING]: this.getVmRunning(array),
    };
  }

  init(array, type) {
    if (type === MONITORING_HOST_STATUSES_KEY) return this.getHostStatus(array);
    else if (type === MONITORING_vm_STATUSES_KEY)
      return this.getVmStatus(array);
    else
      return {
        [MONITORING_HOST_STATUSES_AVAILABLE]: 0,
        [MONITORING_VM_STATUSES_RUNNING]: 0,
      };
  }
}
