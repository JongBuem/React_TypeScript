export interface MonitoringData {
  id: string;
  name: string;
  sku: Array<any>;
  location: string;
  statuses: string;
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
