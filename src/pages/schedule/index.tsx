import React from "react";
import { Outlet } from "react-router-dom";
import HeadContents from "./components/HeadContents";
import LeftContents from "./components/LeftContents";
import { useAxiosSwr, getAPI, postAPI, patchAPI } from "common/api/CmwApi";
import {
  ScheduleData,
  GetScheduleInfoData,
  GetScheduleLogParameter,
  GetScheduleLogType,
} from "./types";

export async function GetScheduleInfo(
  scheduleId: string
): Promise<GetScheduleInfoData> {
  return await getAPI(`/schedule/${scheduleId}`)
    .then(({ data }) => {
      return {
        ...data?.schedule,
        host: data?.host,
      };
    })
    .catch(() => undefined);
}

export async function GetSchedule(tenantId: string): Promise<ScheduleData[]> {
  return await getAPI(`/schedule/tenantId/${tenantId}`)
    .then(({ data }) => {
      if (data?.length > 0) return data;
      else return [];
    })
    .catch(() => []);
}

export async function PostSchedule(
  body: ScheduleData
): Promise<string | boolean> {
  return await postAPI(`/schedule/tenantId/${body.tenantId}`, body)
    .then(({ data }) => {
      if (data?._id) return data._id;
      else return false;
    })
    .catch(() => false);
}

export async function PatchSchedule(
  scheduleId: string,
  body: ScheduleData
): Promise<string | boolean> {
  return await patchAPI(`/schedule/${scheduleId}`, body)
    .then(({ data }) => {
      if (data?._id) return data._id;
      else return false;
    })
    .catch(() => false);
}

export const GetScheduleLog = ({
  customerId,
  scheduleID,
  refreshInterval,
}: GetScheduleLogParameter): GetScheduleLogType => {
  const { data, error, mutate, isLoading } = useAxiosSwr(
    `/logs/${customerId}/schedules/${scheduleID}`,
    null,
    refreshInterval
  );
  return {
    mutate,
    data,
    isLoading,
    isError: error,
  };
};

function Schedule() {
  return (
    <React.Fragment>
      <HeadContents />
      <div className="contents-body" style={{ paddingBottom: 30 }}>
        <div className="inner">
          <div className="space-30"></div>
          <div className="area-wrap">
            <LeftContents />
            <Outlet />
          </div>
          <div className="space-80"></div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default React.memo(Schedule);
