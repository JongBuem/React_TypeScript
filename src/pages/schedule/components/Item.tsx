import React from "react";
import { ScheduleHostLogDATA } from "common/class/log";
import { titleStore } from "global/newSchedule";
import { scheduleListStore, scheduleHostLogStore } from "global/schedule";
import { customerStore } from "global/customer";
import { LogConstant } from "common/constants";
import {
  LogData,
  ViewLogData,
  ScheduleInfoProps,
  ScheduleHostLogProps,
  TabHostLogSelectsProps,
} from "../types";
import { GetScheduleLog, GetSchedule } from "pages/schedule";

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
    [setNewTitle],
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
  },
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
      setScheduleHostLog(arry);
    }
  }, [data, isLoading, isError]);

  React.useEffect(() => {
    const jobCountCheck = (v: LogData): boolean => {
      if (v[LogConstant.LOG_KEY_JOBCOUNT] === jobCount) return true;
      else return false;
    };

    //resourceId값이여야 하는데 중복되지 않는 필수 값의 정의가되어있지 않음
    const requireFild = (v: LogData) => v._id;

    const findObj = (array: LogData[], value: string) => {
      const result = array.find((v) => requireFild(v) === value) ?? undefined;
      return result;
    };

    if (scheduleHostLog?.length > 0) {
      const scheduleHostLogs: LogData[] = scheduleHostLog;
      const array = scheduleHostLogs.filter((v) => jobCountCheck(v as LogData));
      const resourceIds: string[] = array
        .map((v) => requireFild(v))
        .filter((v) => v !== undefined);

      const uniqueResourceIds = [...new Set(resourceIds)];
      const result = uniqueResourceIds
        ?.map((v) => findObj(array, v))
        .filter((v): v is LogData => v !== undefined);

      const hostLogInstance = new ScheduleHostLogDATA(result);
      const hostLoglist = hostLogInstance.init(hostLogInstance.data);
      const hostLoglists: ViewLogData[] = hostLoglist;
      const sortlist = hostLoglists.sort((a, b) =>
        a[LogConstant.LOG_HOST_KEY_OLDNAME].localeCompare(
          b[LogConstant.LOG_HOST_KEY_OLDNAME],
        ),
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
                  {v[LogConstant.LOG_HOST_KEY_OLDNAME] ?? ""}
                </td>
                <td className="align-center">
                  {text(v[LogConstant.LOG_HOST_KEY_NEWNAME]) ?? ""}
                </td>
                <td className="align-center">
                  {v[LogConstant.LOG_HOST_KEY_SKU] ?? ""}
                </td>
                <td className="align-center">
                  {v[LogConstant.LOG_HOST_KEY_LOCATION] ?? ""}
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
    const allJobCounts = array.map((v) => v[LogConstant.LOG_KEY_JOBCOUNT]);
    const jobCounts = [...new Set(allJobCounts)];
    return jobCounts;
  };

  const RoundSelectEventHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
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
