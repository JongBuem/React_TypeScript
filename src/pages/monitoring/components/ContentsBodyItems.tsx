import React from "react";
import ico_host from "assets/images/ico_host.png";
import Skeleton from "@mui/material/Skeleton";
import { MonitoringStatus } from "common/class/monitoring";
import { ContentAccordion } from "./styled";
import {
  MonitoringHostStatusesConstant,
  MonitoringVMConstant,
  MonitoringVMStatusesConstant,
} from "common/constants";
import {
  VmList,
  ItemsIF,
  VirtualMachinesIF,
  MonitoringStatusHost,
  MonitoringStatusVm,
  MonitoringStatusHostVm,
} from "../types";

function Division(array: VmList[], n: number): VmList[][] {
  let arr = array;
  let len = arr.length;
  let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
  let temp = [];
  for (let i = 0; i < cnt; i++) {
    temp.push(arr.splice(0, n));
  }
  return temp;
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

const Count = (vm: VmList[]) => {
  const VmStatusInstance = new MonitoringStatus(
    vm,
    MonitoringVMStatusesConstant.MONITORING_vm_STATUSES_KEY
  );
  const result = VmStatusInstance.init(vm, VmStatusInstance.type);
  if (isVm(result))
    return result[MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING];
};

function Color(key: string, status: string) {
  if (key === MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_KEY) {
    if (
      status ===
      MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_AVAILABLE
    )
      return {};
    else return { backgroundColor: "#EEEFF2" };
  } else if (key === MonitoringVMStatusesConstant.MONITORING_vm_STATUSES_KEY) {
    if (status === MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_RUNNING)
      return {};
    else if (
      status === MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_STARTING
    )
      return { backgroundColor: "#2DCCFF" };
    else if (
      status === MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_STOPPING ||
      status === MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_STOPPED
    )
      return { backgroundColor: "#FF3838" };
    else if (
      status ===
        MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_DEALLOCATED ||
      status ===
        MonitoringVMStatusesConstant.MONITORING_VM_STATUSES_DEALLOCATING
    )
      return { backgroundColor: "#FCE83A" };
    else return { backgroundColor: "#EEEFF2" };
  } else return { backgroundColor: "#EEEFF2" };
}

function VirtualMachines({ vmName, vmLocation, vmStatuse }: VirtualMachinesIF) {
  return (
    <li>
      <div className="tooltip">
        <span
          className="vm-st running"
          style={Color(
            MonitoringVMStatusesConstant.MONITORING_vm_STATUSES_KEY,
            vmStatuse
          )}
        ></span>
        <div className="tooltiptext" style={{ width: "150px" }}>
          <span>{vmName}</span>
          <div className="st-wrap">
            <span
              className="st available"
              style={Color(
                MonitoringVMStatusesConstant.MONITORING_vm_STATUSES_KEY,
                vmStatuse
              )}
            ></span>
            <label className="st-label">{vmStatuse}</label>
          </div>
        </div>
      </div>
    </li>
  );
}

export const Items = React.memo(function Items({
  hostName = "",
  skuName = "",
  hostStatus = "",
  vm,
}: ItemsIF) {
  const [open, setOPen] = React.useState(false);
  const vmList: VmList[] = JSON.parse(vm);

  return (
    <div className="st-item" style={{ minHeight: "110px" }}>
      <ContentAccordion expanded={open}>
        <div>
          <div className="st-head">
            <div className="left">
              <div className="host-name">
                <img src={ico_host} />
                <h5>{hostName}</h5>
              </div>
              <span className="divider"></span>
              <h5 className="host-type">{skuName}</h5>
            </div>
            <div className="right">
              <div className="st-wrap">
                <span
                  className="st available"
                  style={Color(
                    MonitoringHostStatusesConstant.MONITORING_HOST_STATUSES_KEY,
                    hostStatus
                  )}
                ></span>
                <label className="st-label">{hostStatus}</label>
              </div>
              <button className="accordion" onClick={() => setOPen(!open)}>
                <i className={!open ? "icon-arrow-up" : "icon-arrow-down"}></i>
              </button>
            </div>
          </div>
          <div className="st-body">
            <div className="inner">
              <div className="left">
                <ul className="vm-st-wrap">
                  {vmList.map((v, i) => (
                    <VirtualMachines
                      key={v[MonitoringVMConstant.MONITORING_VM_KEY_ID]}
                      vmName={v[MonitoringVMConstant.MONITORING_VM_KEY_NAME]}
                      vmLocation={
                        v[MonitoringVMConstant.MONITORING_VM_KEY_LOCATION]
                      }
                      vmStatuse={
                        v[MonitoringVMConstant.MONITORING_VM_KEY_STATUSES]
                      }
                    />
                  ))}
                </ul>
              </div>
              <div className="right">
                <div className="vm-st-count">
                  <span className="running">{Count(vmList)}</span>
                  <span className="diagonal">/</span>
                  <span className="total">{vmList.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="vm-list">
          <table
            className="tbl tbl-basic tbl-vm-list"
            style={{ width: "100%" }}
          >
            <colgroup>
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
            </colgroup>
            <thead>
              <tr>
                <th>VM Name</th>
                <th>Status</th>
                <th>VM Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Division([...vmList], 2).map((childArray, i) => (
                <tr key={i}>
                  {childArray.map((v, vi) => (
                    <React.Fragment key={vi}>
                      <td className="align-center">
                        {v[MonitoringVMConstant.MONITORING_VM_KEY_NAME]}
                      </td>
                      <td className="align-center">
                        <div className="st-wrap">
                          <span
                            className="st available"
                            style={Color(
                              MonitoringVMStatusesConstant.MONITORING_vm_STATUSES_KEY,
                              v[MonitoringVMConstant.MONITORING_VM_KEY_STATUSES]
                            )}
                          ></span>
                          <label className="st-label">
                            {v[MonitoringVMConstant.MONITORING_VM_KEY_STATUSES]}
                          </label>
                        </div>
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentAccordion>
    </div>
  );
});

export function ItemsLoading() {
  return (
    <div className="st-item">
      <div className="st-head">
        <div className="left">
          <div className="host-name">
            <img src={ico_host} />
            <Skeleton animation="wave" width={254.922} height={20} />
          </div>
          <span className="divider"></span>
          <Skeleton animation="wave" width={81.484} height={20} />
        </div>
        <div className="right">
          <Skeleton
            animation="wave"
            variant="circular"
            width={50}
            height={30}
            sx={{
              marginRight: "8px",
              borderRadius: "100px",
            }}
          />
          <div className="accordion"></div>
        </div>
      </div>
      <div className="st-body">
        <div className="inner">
          <div className="left">
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={400}
              height={28}
              sx={{
                borderRadius: "2px",
                margin: "0 5px 5px 0",
              }}
            />
          </div>
          <div className="right">
            <div className="vm-st-count">
              <span className="diagonal">/</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
