import React from "react";
import { SWRResponse } from "swr";
import { GetHost } from "pages/monitoring";
import { ScheduleHostDATA } from "common/class/schedule";
import { subscriptionStore, hostStore } from "global/newSchedule";
import { ScheduleConstant, MonitoringHostConstant } from "common/constants";
import {
  ScheduleInfoProps,
  TapProps,
  EditHostInformationProps,
  ScheduleHostData,
} from "../types";
import {
  ScheduleInformationStatusInput,
  ScheduleInformationSubscriptionInput,
  ScheduleInformationDateInput,
  ScheduleInformationRepeatedInput,
} from "./InputContents";

export const Tab = React.memo(function Tab({ title }: TapProps) {
  return (
    <div className="tabs">
      <div className="tab-menu-wrap dp-flex p-b-10">
        <p className="tablinks">{title}</p>
      </div>
    </div>
  );
});

export const ScheduleInformation = React.memo(function ScheduleInformation({
  scheduleInfo,
}: ScheduleInfoProps) {
  return (
    <>
      <Tab title={"예약정보"} />
      <div id="schedule-thum-default" className="tabcontent">
        <table className="tbl tbl-basic" style={{ width: "100%" }}>
          <colgroup>
            <col width="13%" />
            <col width="37%" />
            <col width="23%" />
            <col width="27%" />
          </colgroup>
          <thead>
            <tr>
              <th>상태</th>
              <th>구독</th>
              <th>시작시각</th>
              <th>반복설정</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <ScheduleInformationStatusInput
                value={
                  scheduleInfo
                    ? scheduleInfo[ScheduleConstant.SCHEDULE_KEY_STATE]
                    : false
                }
              />
              <ScheduleInformationSubscriptionInput
                value={
                  scheduleInfo
                    ? scheduleInfo[ScheduleConstant.SCHEDULE_KEY_SUBSID]
                    : ""
                }
              />
              <ScheduleInformationDateInput
                value={
                  scheduleInfo
                    ? scheduleInfo[ScheduleConstant.SCHEDULE_KEY_STARTDATETIME]
                    : ""
                }
              />
              <ScheduleInformationRepeatedInput
                value={
                  scheduleInfo && Object.keys(scheduleInfo)?.length > 0
                    ? {
                        repeatedInput:
                          scheduleInfo[
                            ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE
                          ] === "01"
                            ? scheduleInfo[
                                ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEWEEK
                              ]
                            : scheduleInfo[
                                ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE
                              ] === "02"
                            ? scheduleInfo[
                                ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEMONTH
                              ]
                            : "",
                        repeated:
                          scheduleInfo[
                            ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE
                          ],
                        week: scheduleInfo[
                          ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEWEEK
                        ],
                        dayofweek:
                          scheduleInfo[
                            ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEDAY
                          ],
                      }
                    : {
                        repeatedInput: "",
                        repeated: "00",
                        week: "1",
                        dayofweek: "0",
                      }
                }
              />
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
});

export const EditHostInformation = React.memo(function EditHostInformation({
  scheduleInfo,
}: EditHostInformationProps) {
  const { selectSubscription } = subscriptionStore();
  const { setNewCheckHostList } = hostStore();
  const [scheduleInfoCheck, setScheduleInfoCheck] = React.useState(false); //scheduleInfo의 host데이터 상태
  const [allCheck, setAllCheck] = React.useState(false);
  const [check, setCheck] = React.useState<string[]>([]);
  const [hostList, setHostList] = React.useState<ScheduleHostData[]>([]);
  const { data, isLoading, isError } = GetHost({
    refreshInterval: 70000,
    subscriptionId: selectSubscription,
    query: false,
  });

  const GetHostList = async (result: SWRResponse) => {
    const dataArray = result.data ? result.data : result;
    const hostInstance = new ScheduleHostDATA(dataArray);
    const hostlist = hostInstance.init(hostInstance.data);
    setHostList(hostlist);
  };

  //초기화
  React.useEffect(() => {
    setNewCheckHostList([]);
  }, []);

  React.useEffect(() => {
    setNewCheckHostList(check);
  }, [check]);

  React.useEffect(() => {
    if (isError) setHostList([]);
    else if (!isLoading && !isError && data) GetHostList(data);
  }, [isLoading, data, isError]);

  React.useEffect(() => {
    if (scheduleInfoCheck) {
      if (check?.length === hostList?.length) setAllCheck(true);
    }
  }, [check, hostList, scheduleInfoCheck]);

  React.useEffect(() => {
    if (allCheck && hostList?.length > 0)
      setCheck(
        hostList.map((v) => v[MonitoringHostConstant.MONITORING_HOST_KEY_NAME]),
      );
    else if (!allCheck && hostList?.length > 0) {
      if (hostList?.length === check?.length) setCheck([]);
    } else if (hostList?.length === 0) setCheck([]);
  }, [allCheck, hostList]);

  React.useEffect(() => {
    if (
      scheduleInfo &&
      scheduleInfo[ScheduleConstant.SCHEDULE_KEY_TARGETHOSTLIST] !== undefined
    ) {
      setCheck(scheduleInfo[ScheduleConstant.SCHEDULE_KEY_TARGETHOSTLIST]);
      setScheduleInfoCheck(true);
    }
  }, [scheduleInfo?.targetHostList]);

  const ChekHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (e.target.checked) setCheck((check) => [...check, value]);
    else {
      setCheck(check.filter((o) => o !== value));
      setAllCheck(false);
    }
  };

  const subscriptions: ScheduleHostData[] = hostList;
  const HostTableList = subscriptions.map((value, index) => (
    <tr key={value?.id ?? index}>
      <td className="align-center">
        <label className="checkbox">
          <input
            type="checkbox"
            name="selectRow"
            onChange={(e) =>
              ChekHandler(
                e,
                value[MonitoringHostConstant.MONITORING_HOST_KEY_NAME],
              )
            }
            checked={
              check.indexOf(
                value[MonitoringHostConstant.MONITORING_HOST_KEY_NAME],
              ) > -1
                ? true
                : false
            }
          />
          <span className="mark"></span>
        </label>
      </td>
      <td className="align-center">
        {value[MonitoringHostConstant.MONITORING_HOST_KEY_NAME]}
      </td>
      <td className="align-center">
        {value[MonitoringHostConstant.MONITORING_HOST_KEY_SKU]}
      </td>
      <td className="align-center">
        {value[MonitoringHostConstant.MONITORING_HOST_KEY_SKU_LOCATION]}
      </td>
      <td className="align-center">
        {value[MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES]}
      </td>
    </tr>
  ));

  return (
    <>
      <Tab title={"호스트정보"} />
      <div id="schedule-thum-host" className="tabcontent">
        <table className="tbl tbl-basic tbl-tiny" style={{ width: "100%" }}>
          <colgroup>
            <col width="8%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="" />
          </colgroup>
          <thead>
            <tr>
              <th>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="selectRow"
                    onChange={(e) => setAllCheck(e.target.checked)}
                    checked={allCheck}
                  />
                  <span className="mark"></span>
                </label>
              </th>
              <th>Host Name</th>
              <th>SKU</th>
              <th>Location</th>
              <th>Statuses</th>
            </tr>
          </thead>
          <tbody>{HostTableList}</tbody>
        </table>
      </div>
    </>
  );
});

export const HostInformation = React.memo(function HostInformation() {
  const { selectSubscription } = subscriptionStore();
  const { setNewCheckHostList } = hostStore();
  const [allCheck, setAllCheck] = React.useState(true);
  const [check, setCheck] = React.useState<any[]>([]);
  const [hostList, setHostList] = React.useState<ScheduleHostData[]>([]);
  const { data, isLoading, isError } = GetHost({
    refreshInterval: 70000,
    subscriptionId: selectSubscription,
    query: false,
  });

  const GetHostList = async (result: SWRResponse) => {
    const dataArray = result.data ? result.data : result;
    const hostInstance = new ScheduleHostDATA(dataArray);
    const hostlist = hostInstance.init(hostInstance.data);
    setHostList(hostlist);
  };

  //초기화
  React.useEffect(() => {
    setNewCheckHostList([]);
  }, []);

  React.useEffect(() => {
    setNewCheckHostList(check);
  }, [check]);

  React.useEffect(() => {
    if (isError) setHostList([]);
    else if (!isLoading && !isError && data) GetHostList(data);
  }, [isLoading, data, isError]);

  React.useEffect(() => {
    if (check?.length === hostList?.length) setAllCheck(true);
  }, [check, hostList]);

  React.useEffect(() => {
    if (allCheck && hostList?.length > 0)
      setCheck(
        hostList.map((v) => v[MonitoringHostConstant.MONITORING_HOST_KEY_NAME]),
      );
    else if (!allCheck && hostList?.length > 0) {
      if (hostList?.length === check?.length) setCheck([]);
    } else if (hostList?.length === 0) setCheck([]);
  }, [allCheck, hostList]);

  const ChekHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (e.target.checked) setCheck((check) => [...check, value]);
    else {
      setCheck(check.filter((o) => o !== value));
      setAllCheck(false);
    }
  };

  const subscriptions: ScheduleHostData[] = hostList;
  const HostTableList = subscriptions.map((value, index) => (
    <tr key={value?.id ?? index}>
      <td className="align-center">
        <label className="checkbox">
          <input
            type="checkbox"
            name="selectRow"
            onChange={(e) =>
              ChekHandler(
                e,
                value[MonitoringHostConstant.MONITORING_HOST_KEY_NAME],
              )
            }
            checked={
              check.indexOf(
                value[MonitoringHostConstant.MONITORING_HOST_KEY_NAME],
              ) > -1
                ? true
                : false
            }
          />
          <span className="mark"></span>
        </label>
      </td>
      <td className="align-center">
        {value[MonitoringHostConstant.MONITORING_HOST_KEY_NAME]}
      </td>
      <td className="align-center">
        {value[MonitoringHostConstant.MONITORING_HOST_KEY_SKU]}
      </td>
      <td className="align-center">
        {value[MonitoringHostConstant.MONITORING_HOST_KEY_SKU_LOCATION]}
      </td>
      <td className="align-center">
        {value[MonitoringHostConstant.MONITORING_HOST_KEY_STATUSES]}
      </td>
    </tr>
  ));

  return (
    <>
      <Tab title={"호스트정보"} />
      <div id="schedule-thum-host" className="tabcontent">
        <table className="tbl tbl-basic tbl-tiny" style={{ width: "100%" }}>
          <colgroup>
            <col width="8%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="" />
          </colgroup>
          <thead>
            <tr>
              <th>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="selectRow"
                    onChange={(e) => setAllCheck(e.target.checked)}
                    checked={allCheck}
                  />
                  <span className="mark"></span>
                </label>
              </th>
              <th>Host Name</th>
              <th>SKU</th>
              <th>Location</th>
              <th>Statuses</th>
            </tr>
          </thead>
          <tbody>{HostTableList}</tbody>
        </table>
      </div>
    </>
  );
});
