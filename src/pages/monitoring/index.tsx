//CMW MAin home
import React from "react";
import ContentsHead from "pages/monitoring/components/ContentsHead";
import ContentsBody from "pages/monitoring/components/ContentsBody";
import {
  MonitoringHostDATA,
  MonitoringVmDATA,
  MonitoringData,
} from "../../common/class/monitoring";
import { monitoringHostStore, monitoringVmStore } from "global/monitoring";
import { customerStore } from "global/customer";
import { useAxiosSwr } from "common/api/CmwApi";
import { SWRResponse } from "swr";
import {
  GetHostParameter,
  GetHostReturnType,
  GetVmParameter,
  GetVmReturnType,
  HostList,
  VmList,
  DataList,
} from "./types";

export function GetHost({
  refreshInterval,
  subscriptionId,
  query,
}: GetHostParameter): GetHostReturnType {
  const value = query ? "true" : "false";
  const url = `/monitoring/host-info/${subscriptionId}?filter=${value}`;
  const { data, error, isValidating, mutate, isLoading } = useAxiosSwr(
    url,
    null,
    refreshInterval
  );
  return {
    mutate,
    data,
    isLoading: isLoading,
    isError: error,
    isValidating,
  };
}

export function GetVm({
  refreshInterval,
  subscriptionId,
}: GetVmParameter): GetVmReturnType {
  const { data, error, isValidating, mutate, isLoading } = useAxiosSwr(
    `/monitoring/vm-info/${subscriptionId}`,
    null,
    refreshInterval
  );
  return {
    mutate,
    data,
    isLoading,
    isError: error,
    isValidating,
  };
}

const convertHostListToDataList = (hostLists: HostList[][]): DataList[][] => {
  return hostLists.map((hostGroup) =>
    hostGroup.map((host) => ({
      id: host.id,
      name: host.name,
      sku: host.sku,
      statuses: host.statuses,
      virtualMachines: host.virtualMachines.map((vm) => ({
        id: vm.id,
        location: "", // 필요한 경우 데이터를 채워넣습니다.
        name: vm.name,
        statuses: vm.statuses,
      })),
    }))
  );
};

export const getDataList = (host: HostList[], vm: VmList[]) => {
  const parentArray: HostList[] = host;
  const childArray: VmList[] = vm;
  const monitoringData = new MonitoringData(parentArray, childArray);
  const division = true; // 2D 배열로 분리할지 여부

  // MonitoringData 결과 가져오기
  const monitoringResult = monitoringData.init(
    parentArray,
    childArray,
    division
  );

  // 변환: HostList[][] -> DataList[][]
  const formattedData: DataList[][] = Array.isArray(monitoringResult)
    ? convertHostListToDataList(monitoringResult as HostList[][])
    : [];

  // 상태 업데이트
  return formattedData;
};

export default function Monitoring() {
  const { customer } = customerStore();
  const [subscriptionId, setSubscriptionId] = React.useState(
    customer?.subscriptions?.items[0]?.id ?? ""
  );
  const [dataList, setDataList] = React.useState<DataList[][]>([]);
  const { host, setHost } = monitoringHostStore();
  const { vm, setVm } = monitoringVmStore();
  const { data: hostList, isLoading: hostListLoading } = GetHost({
    refreshInterval: 10000,
    subscriptionId: subscriptionId,
    query: true,
  });
  const { data: vmList, isLoading: vmListLoading } = GetVm({
    refreshInterval: 10000,
    subscriptionId: subscriptionId,
  });

  // const DataList = React.useMemo(() => {
  //   const dataInstance = new MonitoringData(host, vm);
  //   return dataInstance.init(dataInstance.host, dataInstance.vm, true);
  // });

  // const DataList = React.useCallback(() => {
  //   const dataInstance = new MonitoringData(host, vm);
  //   const dataList = dataInstance.init(
  //     dataInstance.host,
  //     dataInstance.vm,
  //     true
  //   );
  //   return dataList;
  // }, [host, vm]);

  const GetHostList = async (result: SWRResponse) => {
    const dataArray: any = result.data ? result : { data: result };
    const datas = dataArray.data;
    const newHosts = datas.newHosts.filter((v: any) => null !== v);
    const oldHosts = datas.oldHosts.filter((v: any) => null !== v);
    const hostInstance = new MonitoringHostDATA({
      data: {
        newHosts,
        oldHosts,
      },
    });
    const hostlist = hostInstance.init(hostInstance.host);
    setHost(hostlist);
  };

  const GetVmList = async (result: SWRResponse) => {
    const dataArray: any = result.data ? result : { data: result };
    const vmInstance = new MonitoringVmDATA(dataArray);
    const vmlist = vmInstance.init(vmInstance.data);
    setVm(vmlist);
  };

  React.useEffect(() => {
    setDataList(getDataList(host, vm));
  }, [host, vm]);

  React.useEffect(() => {
    if (!hostListLoading) GetHostList(hostList);
  }, [hostList, hostListLoading, subscriptionId]);

  React.useEffect(() => {
    if (!vmListLoading) GetVmList(vmList);
  }, [vmList, vmListLoading, subscriptionId]);

  return (
    <React.Fragment>
      <ContentsHead
        hostList={host}
        vmList={vm}
        subscriptionId={subscriptionId}
        subscriptionIds={customer?.subscriptions?.items}
        onChange={(value) => setSubscriptionId(value)}
      />
      <ContentsBody
        dataList={JSON.stringify(dataList)}
        hostListLoading={hostListLoading}
        vmListLoading={vmListLoading}
      />
    </React.Fragment>
  );
}
