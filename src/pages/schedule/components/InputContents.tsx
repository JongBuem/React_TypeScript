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
import {
  ScheduleConstant,
  MonitoringHostConstant,
  LogConstant,
} from "common/constants";
import {
  LogData,
  ViewLogData,
  HostDataMonitoringData,
  ScheduleInfoProps,
  TapProps,
  ScheduleInformationStatusInputInputProps,
  ScheduleInformationSubscriptionInputInputProps,
  ScheduleInformationDateInputInputProps,
  ScheduleInformationRepeatedInputProps,
  EditHostInformationProps,
  ScheduleHostLogProps,
  TabHostLogSelectsProps,
  ScheduleHostData,
} from "../types";
import { GetScheduleLog, GetSchedule } from "pages/schedule";

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
      },
      [setSelect, setStatus],
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
  },
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
            `/monitoring/ms-host-info/tenant/${customer.tenantId}/subscription/${id}`,
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
      [],
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
  },
);

export const ScheduleInformationDateInput = React.memo(
  function ScheduleInformationDateInput({
    value,
  }: ScheduleInformationDateInputInputProps) {
    const { setNewStartDate, setNewStartTime } = dateStore();
    const [startDate, setStartDate] = React.useState(
      moment().format("YYYY-MM-DD"),
    );
    const [startTime, setStartTime] = React.useState(moment().format("HH:mm"));
    const StartDateHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        setNewStartDate(e.target.value);
      },
      [],
    );
    const StartTimeHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(e.target.value);
        setNewStartTime(e.target.value);
      },
      [],
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
  },
);

export const ScheduleInformationRepeatedInput = React.memo(
  function ScheduleInformationRepeatedInput({
    value,
  }: ScheduleInformationRepeatedInputProps) {
    const { setNewRepeatedInput, setNewRepeated, setNewWeek, setNewDayofweek } =
      repeatedStore();
    const [repeatedInput, setRepeatedInput] = React.useState<string | number>(
      "",
    );
    const [repeated, setRepeated] = React.useState("00");
    const [week, setWeek] = React.useState<string | number>("1"); //주
    const [dayofweek, setDayofweek] = React.useState<string | number>("0"); //요일

    const RepeatedInputHandleChange = React.useCallback(
      (v: string | number) => {
        setRepeatedInput(v);
        setNewRepeatedInput(v);
      },
      [setNewRepeatedInput],
    );

    const RepeatedHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "00") RepeatedInputHandleChange("");
        setRepeated(e.target.value);
        setNewRepeated(e.target.value);
      },
      [setNewRepeated, RepeatedInputHandleChange],
    );
    const WeekHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWeek(e.target.value);
        setNewWeek(e.target.value);
      },
      [setNewWeek],
    );
    const DayofweekHandleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDayofweek(e.target.value);
        setNewDayofweek(e.target.value);
      },
      [setNewDayofweek],
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
      [],
    );
    const RepeatedWeekOptionInputOpen = React.useCallback(
      (arg: string): boolean => {
        if (arg === "02") return true;
        else return false;
      },
      [],
    );
    const RepeatedDayofweekOptionInputOpen = React.useCallback(
      (arg: string): boolean => {
        if (arg === "01" || arg === "02") return true;
        else return false;
      },
      [],
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
  },
);
