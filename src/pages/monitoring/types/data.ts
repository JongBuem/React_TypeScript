export interface DataVirtualMachines {
  id: string;
  location: string;
  name: string;
  statuses: string;
}

export interface DataList {
  id: string;
  name: string;
  sku: string;
  statuses: string;
  virtualMachines: DataVirtualMachines[];
}
