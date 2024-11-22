export interface HostVirtualMachines {
  id: string;
  name: string;
  sku: string;
  statuses: string;
  virtualMachines: any[];
}

export interface HostList {
  id: string;
  name: string;
  sku: string;
  statuses: string;
  virtualMachines: HostVirtualMachines[];
}
