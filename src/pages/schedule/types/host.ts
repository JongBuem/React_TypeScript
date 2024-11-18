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
