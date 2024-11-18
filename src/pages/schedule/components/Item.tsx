import React from "react";
import moment from "moment";
import { SWRResponse } from "swr";
import { GetHost } from "pages/monitoring";
import { ScheduleHostLogDATA } from "common/class/log";
import { ScheduleHostDATA } from "common/class/schedule";
import { NumericFormat } from "react-number-format";
import { systemcodeStore } from "global/systemcode";
import {
  loadingStore,
  titleStore,
  statusStore,
  subscriptionStore,
  dateStore,
  repeatedStore,
  hostStore,
} from "global/newSchedule";
import { getAPI } from "common/api/CmwApi";
import Paging, { usePagination } from "components/item/Paging";
import {
  scheduleListStore,
  scheduleHostLogStore,
  scheduleLogStore,
} from "global/schedule";
import { customerStore } from "global/customer";
import { ScheduleConstant } from "common/constants/inex";
import {
  MONITORING_HOST_KEY_NAME,
  MONITORING_HOST_KEY_SKU,
  MONITORING_HOST_KEY_SKU_LOCATION,
  MONITORING_HOST_KEY_STATUSES,
} from "common/constants/monitoring.constant";
import {
  LogData,
  ViewLogData,
  LOG_KEY_ACTION,
  LOG_KEY_STATUS,
  LOG_KEY_JOBCOUNT,
  LOG_KEY_HOSTINFO,
  LOG_KEY_CREATEDAT,
  LOG_KEY_DESCRIPTION,
  LOG_HOST_KEY_SKU,
  LOG_HOST_KEY_LOCATION,
  LOG_HOST_KEY_OLDNAME,
  LOG_HOST_KEY_NEWNAME,
} from "common/constants/log.constant";
import {
  ScheduleInfoProps,
  TapProps,
  ScheduleInformationStatusInputInputProps,
  ScheduleInformationSubscriptionInputInputProps,
  ScheduleInformationDateInputInputProps,
  ScheduleInformationRepeatedInputValue,
  ScheduleInformationRepeatedInputProps,
  EditHostInformationProps,
  ScheduleHostLogProps,
  TabHostLogSelectsProps,
} from "../types/items";
import { GetScheduleLog, GetSchedule } from "pages/schedule";
import { MonitoringData } from "pages/monitoring/types/index";

export const Tab = React.memo(function Tab({ title }: TapProps) {
  return (
    <div className="tabs">
      <div className="tab-menu-wrap dp-flex p-b-10">
        <p className="tablinks">{title}</p>
      </div>
    </div>
  );
});

export const TitleInput = React.memo(function TitleInput({
  scheduleInfo,
}: ScheduleInfoProps) {
  const { setNewTitle } = titleStore();
  const [title, setTitle] = React.useState("");

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      setNewTitle(e.target.value);
    },
    [setNewTitle]
  );

  // 초기화
  React.useEffect(() => {
    if (scheduleInfo?.scheduleName === undefined) setNewTitle("");
    else
      handleChange({
        target: { value: scheduleInfo.scheduleName },
      } as React.ChangeEvent<HTMLInputElement>);
  }, [scheduleInfo, setNewTitle, handleChange]);

  return (
    <input
      type="text"
      className="fm-control"
      style={{ width: "100%" }}
      value={title}
      placeholder="예약명을 입력해 주세요."
      onChange={handleChange}
    />
  );
});

export const ScheduleInformationStatusInput = React.memo(
  function ScheduleInformationStatusInput({
    value,
  }: ScheduleInformationStatusInputInputProps) {
    const { setStatus } = statusStore();
    const [select, setSelect] = React.useState<string>("1");

    const SelectHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const elValue = e.target.value;
        setSelect(elValue);
        setStatus(elValue);
      },
      [setSelect, setStatus]
    );

    //초기화
    React.useEffect(() => {
      if (value === null) {
        setSelect("1");
        setStatus(true);
      } else if (value === true) {
        setSelect("1");
        setStatus(true);
      } else {
        setSelect("2");
        setStatus(false);
      }
    }, [value]);

    return (
      <td className="align-center">
        <select
          value={select}
          className="fm-control"
          style={{ width: "100%" }}
          onChange={SelectHandleChange}
        >
          {[
            { label: "활성화", value: "1" },
            { label: "비활성화", value: "2" },
          ].map((v, i) => (
            <option key={i} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </td>
    );
  }
);

export const ScheduleInformationSubscriptionInput = React.memo(
  function ScheduleInformationSubscriptionInput({
    value,
  }: ScheduleInformationSubscriptionInputInputProps) {
    const { setLoading } = loadingStore();
    const { customer } = customerStore();
    const { subscriptions, setSelectSubscription } = subscriptionStore();
    const [select, setSelect] = React.useState<string>("");

    const updateHost = async (id: string) => {
      if (id && id?.length > 0) {
        try {
          setLoading(true);
          await getAPI(
            `/monitoring/ms-host-info/tenant/${customer.tenantId}/subscription/${id}`
          );
          setTimeout(() => setLoading(false), 1500);
        } catch {
          setLoading(false);
          return 0;
        }
      }
    };

    const SelectHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelect(e.target.value);
        updateHost(e.target.value);
        setSelectSubscription(e.target.value);
      },
      []
    );

    //초기화
    React.useEffect(() => {
      if (value === undefined) setSelectSubscription("");
      else {
        setSelect(value);
        updateHost(value);
        setSelectSubscription(value);
      }
    }, [value]);

    interface TestItem {
      id: string;
    }
    const subscriptionsArray: TestItem[] = subscriptions;
    return (
      <td className="align-center">
        <select
          value={select}
          className="fm-control"
          style={{ width: "100%" }}
          onChange={SelectHandleChange}
        >
          <option value="">선택</option>
          {subscriptionsArray.map((v, i) => (
            <option key={i} value={v?.id ?? ""}>
              {v?.id ?? ""}
            </option>
          ))}
        </select>
      </td>
    );
  }
);

export const ScheduleInformationDateInput = React.memo(
  function ScheduleInformationDateInput({
    value,
  }: ScheduleInformationDateInputInputProps) {
    const { setNewStartDate, setNewStartTime } = dateStore();
    const [startDate, setStartDate] = React.useState(
      moment().format("YYYY-MM-DD")
    );
    const [startTime, setStartTime] = React.useState(moment().format("HH:mm"));
    const StartDateHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        setNewStartDate(e.target.value);
      },
      []
    );
    const StartTimeHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(e.target.value);
        setNewStartTime(e.target.value);
      },
      []
    );

    //초기화
    React.useEffect(() => {
      if (value === undefined) {
        setNewStartDate(moment().format("YYYY-MM-DD"));
        setNewStartTime(moment().format("HH:mm"));
      } else {
        setStartDate(moment(value).format("YYYY-MM-DD"));
        setNewStartDate(moment(value).format("YYYY-MM-DD"));
        setStartTime(moment(value).format("HH:mm"));
        setNewStartTime(moment(value).format("HH:mm"));
      }
    }, [value]);

    return (
      <td className="align-center">
        <input
          type="date"
          className="fm-control"
          style={{ width: "100%" }}
          value={startDate}
          onChange={StartDateHandleChange}
        />
        <div className="space-10"></div>
        <input
          type="time"
          className="fm-control"
          style={{ width: "100%" }}
          value={startTime}
          onChange={StartTimeHandleChange}
        />
      </td>
    );
  }
);

export const ScheduleInformationRepeatedInput = React.memo(
  function ScheduleInformationRepeatedInput({
    value,
  }: ScheduleInformationRepeatedInputProps) {
    const { setNewRepeatedInput, setNewRepeated, setNewWeek, setNewDayofweek } =
      repeatedStore();
    const [repeatedInput, setRepeatedInput] = React.useState<string | number>(
      ""
    );
    const [repeated, setRepeated] = React.useState("00");
    const [week, setWeek] = React.useState<string | number>("1"); //주
    const [dayofweek, setDayofweek] = React.useState<string | number>("0"); //요일

    const RepeatedInputHandleChange = React.useCallback(
      (v: string | number) => {
        setRepeatedInput(v);
        setNewRepeatedInput(v);
      },
      [setNewRepeatedInput]
    );

    const RepeatedHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "00") RepeatedInputHandleChange("");
        setRepeated(e.target.value);
        setNewRepeated(e.target.value);
      },
      [setNewRepeated, RepeatedInputHandleChange]
    );
    const WeekHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWeek(e.target.value);
        setNewWeek(e.target.value);
      },
      [setNewWeek]
    );
    const DayofweekHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDayofweek(e.target.value);
        setNewDayofweek(e.target.value);
      },
      [setNewDayofweek]
    );

    const RepeatedInputDisabled = React.useCallback((arg: string): boolean => {
      if (arg === "00") return true;
      else return false;
    }, []);
    const RepeatedOptionsInputOpen = React.useCallback(
      (arg: string): boolean => {
        if (arg !== "00") return true;
        else return false;
      },
      []
    );
    const RepeatedWeekOptionInputOpen = React.useCallback(
      (arg: string): boolean => {
        if (arg === "02") return true;
        else return false;
      },
      []
    );
    const RepeatedDayofweekOptionInputOpen = React.useCallback(
      (arg: string): boolean => {
        if (arg === "01" || arg === "02") return true;
        else return false;
      },
      []
    );

    //초기화
    React.useEffect(() => {
      if (value === undefined) {
        setNewRepeatedInput("");
        setNewRepeated("00");
        setNewWeek("1");
        setNewDayofweek("0");
      } else {
        if (value?.repeated !== "00") {
          RepeatedInputHandleChange(value?.repeatedInput);
          setRepeated(value?.repeated);
          setNewRepeated(value?.repeated);
          setWeek(value?.week);
          setNewWeek(value?.week);
          setDayofweek(value?.dayofweek);
          setNewDayofweek(value?.dayofweek);
        } else {
          setNewRepeatedInput("");
          setNewRepeated("00");
          setNewWeek("1");
          setNewDayofweek("0");
        }
      }
    }, [value]);

    return (
      <td className="align-center">
        <div className="dp-flex">
          <NumericFormat
            disabled={RepeatedInputDisabled(repeated)}
            className="fm-control mr-5 align-center"
            style={{ width: "80px" }}
            value={repeatedInput}
            allowLeadingZeros={false} //0부터 시작
            allowNegative={false} //음수
            thousandSeparator={true} //,
            thousandsGroupStyle="thousand"
            displayType="input"
            type="text"
            onValueChange={({ floatValue }) => {
              if (floatValue) RepeatedInputHandleChange(floatValue);
              else RepeatedInputHandleChange("");
            }}
          />
          <select
            className="fm-control"
            style={{ width: "100%" }}
            value={repeated}
            onChange={RepeatedHandleChange}
          >
            <option value={"00"}>반복 안 함</option>
            <option value={"01"}>주</option>
            <option value={"02"}>개월</option>
            {/* <option value={'year'}>년</option> */}
          </select>
        </div>

        {RepeatedOptionsInputOpen(repeated) && (
          <div>
            <div className="space-10"></div>
            <div className="dp-flex">
              {RepeatedWeekOptionInputOpen(repeated) && (
                <select
                  className="fm-control mr-5"
                  style={{ width: "100%" }}
                  value={week}
                  onChange={WeekHandleChange}
                >
                  <option value={"1"}>첫째 주</option>
                  <option value={"2"}>둘째 주</option>
                  <option value={"3"}>셋째 주</option>
                  <option value={"4"}>넷째 주</option>
                  <option value={"5"}>다섯째 주</option>
                </select>
              )}
              {RepeatedDayofweekOptionInputOpen(repeated) && (
                <select
                  className="fm-control"
                  style={{ width: "100%" }}
                  value={dayofweek}
                  onChange={DayofweekHandleChange}
                >
                  <option value={"0"}>일요일</option>
                  <option value={"1"}>월요일</option>
                  <option value={"2"}>화요일</option>
                  <option value={"3"}>수요일</option>
                  <option value={"4"}>목요일</option>
                  <option value={"5"}>금요일</option>
                  <option value={"6"}>토요일</option>
                </select>
              )}
            </div>
          </div>
        )}
      </td>
    );
  }
);

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
  const [check, setCheck] = React.useState<Array<string>>([]);
  const [hostList, setHostList] = React.useState([]);
  const { data, isLoading, isError } = GetHost({
    refreshInterval: 70000,
    subscriptionId: selectSubscription,
    query: false,
  });

  const GetHostList = async (result: SWRResponse) => {
    const dataArray = result.data ? result : { data: result };
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
      setCheck(hostList.map((v) => v[MONITORING_HOST_KEY_NAME]));
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
    value: string
  ) => {
    if (e.target.checked) setCheck((check) => [...check, value]);
    else {
      setCheck(check.filter((o) => o !== value));
      setAllCheck(false);
    }
  };

  const subscriptions: MonitoringData[] = hostList;
  const HostTableList = subscriptions.map((value, index) => (
    <tr key={value?.id ?? index}>
      <td className="align-center">
        <label className="checkbox">
          <input
            type="checkbox"
            name="selectRow"
            onChange={(e) => ChekHandler(e, value[MONITORING_HOST_KEY_NAME])}
            checked={
              check.indexOf(value[MONITORING_HOST_KEY_NAME]) > -1 ? true : false
            }
          />
          <span className="mark"></span>
        </label>
      </td>
      <td className="align-center">{value[MONITORING_HOST_KEY_NAME]}</td>
      <td className="align-center">{value[MONITORING_HOST_KEY_SKU]}</td>
      <td className="align-center">
        {value[MONITORING_HOST_KEY_SKU_LOCATION]}
      </td>
      <td className="align-center">{value[MONITORING_HOST_KEY_STATUSES]}</td>
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
  const [hostList, setHostList] = React.useState([]);
  const { data, isLoading, isError } = GetHost({
    refreshInterval: 70000,
    subscriptionId: selectSubscription,
    query: false,
  });

  const GetHostList = async (result: SWRResponse) => {
    const dataArray = result.data ? result : { data: result };
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
      setCheck(hostList.map((v) => v[MONITORING_HOST_KEY_NAME]));
    else if (!allCheck && hostList?.length > 0) {
      if (hostList?.length === check?.length) setCheck([]);
    } else if (hostList?.length === 0) setCheck([]);
  }, [allCheck, hostList]);

  const ChekHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (e.target.checked) setCheck((check) => [...check, value]);
    else {
      setCheck(check.filter((o) => o !== value));
      setAllCheck(false);
    }
  };

  const subscriptions: MonitoringData[] = hostList;
  const HostTableList = subscriptions.map((value, index) => (
    <tr key={value?.id ?? index}>
      <td className="align-center">
        <label className="checkbox">
          <input
            type="checkbox"
            name="selectRow"
            onChange={(e) => ChekHandler(e, value[MONITORING_HOST_KEY_NAME])}
            checked={
              check.indexOf(value[MONITORING_HOST_KEY_NAME]) > -1 ? true : false
            }
          />
          <span className="mark"></span>
        </label>
      </td>
      <td className="align-center">{value[MONITORING_HOST_KEY_NAME]}</td>
      <td className="align-center">{value[MONITORING_HOST_KEY_SKU]}</td>
      <td className="align-center">
        {value[MONITORING_HOST_KEY_SKU_LOCATION]}
      </td>
      <td className="align-center">{value[MONITORING_HOST_KEY_STATUSES]}</td>
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

export const ScheduleRefreshButton = React.memo(
  function ScheduleRefreshButton() {
    const { customer } = customerStore();
    const { setScheduleList } = scheduleListStore();

    const RefreshButton = async () => {
      const result = await GetSchedule(customer.tenantId);
      setScheduleList(result);
    };

    return (
      <>
        <button className="btn btn-solid" onClick={() => RefreshButton()}>
          새로고침
        </button>
      </>
    );
  }
);

export const ScheduleHostLog = React.memo(function ScheduleHostLog({
  id,
}: ScheduleHostLogProps) {
  const { customer } = customerStore();
  const { setScheduleHostLog, scheduleHostLog, jobCount } =
    scheduleHostLogStore();
  const { data, isLoading, isError } = GetScheduleLog({
    customerId: customer.tenantId,
    scheduleID: id,
    refreshInterval: 5000,
  });
  const [log, setLog] = React.useState<ViewLogData[]>([]);

  const text = (value: string): string => {
    const valueArray = value.split("/");
    const result = valueArray[valueArray.length - 1] ?? "";
    return result;
  };

  React.useEffect(() => {
    if (isError) {
      setLog([]);
      setScheduleHostLog([]);
    } else if (!isLoading && !isError) {
      const arry = data?.data?.items ? data?.data?.items : data?.items;
      console.log(arry);
      setScheduleHostLog(arry);
    }
  }, [data, isLoading, isError]);

  React.useEffect(() => {
    const jobCountCheck = (v: LogData): boolean => {
      if (v[LOG_KEY_JOBCOUNT] === jobCount) return true;
      else return false;
    };

    const findObj = (array: LogData[], value: string) => {
      const result = array.find((v) => v.resourceId === value) ?? {};
      return result;
    };

    if (scheduleHostLog?.length > 0) {
      const scheduleHostLogs: LogData[] = scheduleHostLog;
      const array = scheduleHostLogs.filter((v) => jobCountCheck(v as LogData));
      const resourceIds: string[] = array
        .map((v) => v.resourceId)
        .filter((v) => v);
      const uniqueResourceIds = [...new Set(resourceIds)];
      const result = uniqueResourceIds.map((v) => findObj(array, v));

      const hostLogInstance = new ScheduleHostLogDATA(result);
      const hostLoglist = hostLogInstance.init(hostLogInstance.data);
      const hostLoglists: ViewLogData[] = hostLoglist;
      const sortlist = hostLoglists.sort((a, b) =>
        a[LOG_HOST_KEY_OLDNAME].localeCompare(b[LOG_HOST_KEY_OLDNAME])
      );
      setLog(sortlist);
    }
  }, [scheduleHostLog, jobCount]);

  return (
    <>
      <div className="tabcontent">
        <table className="tbl tbl-basic" style={{ width: "100%" }}>
          <colgroup>
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>
          <thead>
            <tr>
              <th>Old Host Name</th>
              <th>New Host Name</th>
              <th>SKU</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {log.map((v, i) => (
              <tr key={i}>
                <td className="align-center">
                  {v[LOG_HOST_KEY_OLDNAME] ?? ""}
                </td>
                <td className="align-center">
                  {text(v[LOG_HOST_KEY_NEWNAME]) ?? ""}
                </td>
                <td className="align-center">{v[LOG_HOST_KEY_SKU] ?? ""}</td>
                <td className="align-center">
                  {v[LOG_HOST_KEY_LOCATION] ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export const TabHostLogSelects = React.memo(function TabHostLogSelects({
  index,
}: TabHostLogSelectsProps) {
  const { scheduleHostLog, jobCount, setJobCount } = scheduleHostLogStore();

  const Deduplication = (array: LogData[]) => {
    const allJobCounts = array.map((v) => v[LOG_KEY_JOBCOUNT]);
    const jobCounts = [...new Set(allJobCounts)];
    return jobCounts;
  };

  const RoundSelectEventHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobCount(e.target.value);
  };

  React.useEffect(() => {
    const jobCount = Deduplication(scheduleHostLog)[0] ?? 0;
    setJobCount(jobCount);
  }, [index, scheduleHostLog]);

  return (
    <div className="tab-menu-wrap dp-flex p-b-10">
      <div className="ml-auto p-all-10" style={{ paddingRight: 0 }}>
        <ul className="fm-group">
          <li>
            <select
              className="fm-control"
              style={{ width: "100px" }}
              value={jobCount}
              onChange={RoundSelectEventHandle}
            >
              {Deduplication(scheduleHostLog)?.map((v, i) => (
                <option key={i} value={v}>
                  {v}회차
                </option>
              ))}
            </select>
          </li>
        </ul>
      </div>
    </div>
  );
});
