export interface DataDisks {
  lun: number;
  name: string;
  createOption: string;
  caching: string;
  writeAcceleratorEnabled: boolean;
  managedDisk: {
    storageAccountType: string;
    id: string;
  };
  diskSizeGB: number;
  toBeDetached: boolean;
}

export interface NetworkInterfaces {
  id: string;
}

export interface InstanceViewStatuses {
  code: string;
  level: string;
  displayStatus: string;
  message: string;
  time: string;
}

export interface ExtensionHandlers {
  type: string;
  typeHandlerVersion: string;
  status: {
    code: string;
    level: string;
    displayStatus: string;
  };
}

export interface DisksStatuses {
  code: string;
  level: string;
  displayStatus: string;
  time: string;
}
export interface Disks {
  name: string;
  statuses: DisksStatuses[];
}

export interface ExtensionsSubstatuses {
  code: string;
  level: string;
  displayStatus: string;
  message: string;
}
export interface ExtensionsStatuses {
  code: string;
  level: string;
  displayStatus: string;
  message: string;
}

export interface Extensions {
  name: string;
  type: string;
  typeHandlerVersion: string;
  substatuses: ExtensionsSubstatuses[];
  statuses: ExtensionsStatuses[];
}

export interface instanceViewStatuses {
  code: string;
  level: string;
  displayStatus: string;
  time: string;
}

export interface Resources {
  name: string;
  id: string;
  type: string;
  location: string;
  properties: { [key: string]: any };
}

export interface Monitoring {
  _id: string;
  name: string;
  id: string;
  type: string;
  location: string;
  tags: {
    servicetag: string;
    role: string;
    class: string;
    dedihost: string;
  };
  properties: {
    hardwareProfile: {
      vmSize: string;
    };
    provisioningState: string;
    vmId: string;
    host: {
      id: string;
    };
    storageProfile: {
      imageReference: {
        id: string;
      };
      osDisk: {
        osType: string;
        name: string;
        createOption: string;
        caching: string;
        writeAcceleratorEnabled: boolean;
        managedDisk: {
          storageAccountType: string;
          id: string;
        };
        diskSizeGB: number;
      };
      dataDisks: DataDisks[];
    };
    osProfile: {
      computerName: string;
      adminUsername: string;
      windowsConfiguration: {
        provisionVMAgent: boolean;
        enableAutomaticUpdates: boolean;
        patchSettings: {
          patchMode: string;
          assessmentMode: string;
        };
      };
      secrets: any[];
      allowExtensionOperations: boolean;
      requireGuestProvisionSignal: boolean;
    };
    networkProfile: {
      networkInterfaces: NetworkInterfaces[];
    };
    diagnosticsProfile: {
      bootDiagnostics: {
        enabled: boolean;
        storageUri: string;
      };
    };
    licenseType: string;
    instanceView: {
      platformFaultDomain: number;
      computerName: string;
      osName: string;
      osVersion: string;
      vmAgent: {
        vmAgentVersion: string;
        statuses: InstanceViewStatuses[];
        extensionHandlers: ExtensionHandlers[];
      };
      disks: Disks[];
      bootDiagnostics: {
        consoleScreenshotBlobUri: string;
        serialConsoleLogBlobUri: string;
      };
      extensions: Extensions[];
      hyperVGeneration: string;
      statuses: instanceViewStatuses[];
    };
    timeCreated: string;
  };
  zones: string[];
  resources: Resources[];
  createdAt: string;
  updatedAt: string;
}

export type GetHostParameter = {
  refreshInterval: number;
  subscriptionId: string;
  query: boolean;
};

export type GetVmParameter = {
  refreshInterval: number;
  subscriptionId: string;
};

export type GetHostReturnType = {
  mutate: any;
  data: any;
  isLoading: boolean;
  isError: any;
  isValidating: boolean;
};

export type GetVmReturnType = {
  mutate: any;
  data: any;
  isLoading: boolean;
  isError: any;
  isValidating: boolean;
};
