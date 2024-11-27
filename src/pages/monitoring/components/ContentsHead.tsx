import React from "react";
import { MonitoringStatus } from "common/class/monitoring";
import {
  MonitoringHostStatusesConstant,
  MonitoringVMStatusesConstant,
} from "common/constants";
import {
  MonitoringStatusHost,
  MonitoringStatusVm,
  MonitoringStatusHostVm,
  ContentsHeadIF,
  MonitoringSubscriptionInputIF,
} from "../types";

function isHost(
  result: MonitoringStatusHost | MonitoringStatusVm | MonitoringStatusHostVm
): result is MonitoringStatusHost {
  return (
    (result as MonitoringStatusHost)[
      MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE
    ] !== undefined
  );
}

function isVm(
  result: MonitoringStatusHost | MonitoringStatusVm | MonitoringStatusHostVm
): result is MonitoringStatusVm {
  return (
    (result as MonitoringStatusVm)[
      MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING
    ] !== undefined
  );
}

export default function ContentsHead({
  hostList,
  vmList,
  subscriptionId,
  subscriptionIds,
  onChange,
}: ContentsHeadIF) {
  const [hostCount, setHostCount] = React.useState(0);
  const [vmCount, setVmCount] = React.useState(0);

  React.useEffect(() => {
    const hostStatusInstance = new MonitoringStatus(
      hostList,
      MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_KEY
    );
    const result = hostStatusInstance.init(hostList, hostStatusInstance.type);
    if (isHost(result))
      setHostCount(
        result[
          MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE
        ]
      );
  }, [hostList]);

  React.useEffect(() => {
    const VmStatusInstance = new MonitoringStatus(
      vmList,
      MonitoringVMStatusesConstant.MONITORING_vm_STATUSES_KEY
    );
    const result = VmStatusInstance.init(vmList, VmStatusInstance.type);
    if (isVm(result))
      setVmCount(
        result[MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING]
      );
  }, [vmList]);

  return (
    <div className="contents-head">
      <div className="inner">
        <h2 className="page-title">Monitoring</h2>
        <div className="head-info-wrap">
          <div className="head-st-wrap">
            <div className="head-st-item">
              <p className="head-st-label">Host Available</p>
              <div className="head-st-count">
                <span className="running">{hostCount}</span>
                <span className="diagonal">/</span>
                <span className="total">{hostList.length}</span>
              </div>
            </div>
            <div className="head-st-item">
              <p className="head-st-label">VM Running</p>
              <div className="head-st-count">
                <span className="running">{vmCount}</span>
                <span className="diagonal">/</span>
                <span className="total">{vmList.length}</span>
              </div>
            </div>
            <div className="head-st-item">
              <p className="head-st-label">Subscription</p>
              <div className="head-st-count">
                <MonitoringSubscriptionInput
                  subscriptionId={subscriptionId}
                  subscriptionIds={subscriptionIds}
                  onChange={(value) => onChange(value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-30"></div>
    </div>
  );
}

export const MonitoringSubscriptionInput = React.memo(
  function MonitoringSubscriptionInput({
    subscriptionId,
    subscriptionIds,
    onChange,
  }: MonitoringSubscriptionInputIF) {
    const [select, setSelect] = React.useState(subscriptionId);

    const SelectHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelect(e.target.value);
        onChange(e.target.value);
      },
      []
    );

    //초기화
    React.useEffect(() => {
      SelectHandleChange({
        target: { value: subscriptionId },
      } as React.ChangeEvent<HTMLSelectElement>);
    }, [subscriptionId]);

    return (
      <select
        value={select}
        className="fm-control"
        style={{
          width: "270px",
          height: "30px",
          padding: "5px",
          background: "#0065CC",
          color: "#FFFF",
        }}
        onChange={SelectHandleChange}
      >
        <option value="" disabled style={{ color: "#92A6D0" }}>
          선택
        </option>
        {subscriptionIds.map((v, i) => (
          <option key={i} value={v?.id ?? ""}>
            {v?.id ?? ""}
          </option>
        ))}
      </select>
    );
  }
);
