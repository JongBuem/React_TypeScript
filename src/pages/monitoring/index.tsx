//CMW MAin home
import React from "react";
import ContentsHead from "components/monitoring/ContentsHead";
import ContentsBody from "components/monitoring/ContentsBody";
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

export default function Monitoring() {
  const { customer } = customerStore();
  const [subscriptionId, setSubscriptionId] = React.useState(
    customer?.subscriptions?.items[0]?.id ?? ""
  );
  const [dataList, setDataList] = React.useState([]);
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

  const DataList = React.useCallback(() => {
    const dataInstance = new MonitoringData(host, vm);
    const dataList = dataInstance.init(
      dataInstance.host,
      dataInstance.vm,
      true
    );
    return dataList;
  }, [host, vm]);

  const GetHostList = async (result: SWRResponse) => {
    const hostInstance = new MonitoringHostDATA(result);
    const hostlist = hostInstance.init(hostInstance.host);
    setHost(hostlist);
  };

  const GetVmList = async (result: SWRResponse) => {
    const vmInstance = new MonitoringVmDATA(result);
    const vmlist = vmInstance.init(vmInstance.data);
    setVm(vmlist);
  };

  React.useEffect(() => {
    setDataList(DataList());
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
