import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { CustomTab } from "./Tab";
import { useParams } from "react-router";
import calendar from "assets/images/calendar.png";
import error from "assets/images/error.png";
import { ScheduleRefreshButton } from "./Item";
import { scheduleListStore } from "global/schedule";
import { GetScheduleInfo } from "pages/schedule";
import { ScheduleInfo } from "common/class/schedule";
import {
  SCHEDULE_KEY_NAME,
  SCHEDULE_KEY_STATE,
} from "common/constants/schedule.constant";

import { ScheduleData } from "../types";

export default function InfoContents() {
  console.log("info");
  const { id } = useParams<{ id: string }>();
  const { scheduleList } = scheduleListStore();
  const [scheduleInfo, setScheduleInfo] = React.useState<ScheduleData | null>(
    null
  );

  const init = React.useCallback(async (scheduleID: string) => {
    const result = await GetScheduleInfo(scheduleID);
    setScheduleInfo(result);
  }, []);

  React.useEffect(() => {
    if (id) {
      init(id);
    }
  }, [id, init]);

  if (scheduleList?.length === 0) {
    return (
      <div className="area-sub">
        <div className="inner">
          <div className="not-found">
            <img src={calendar} alt="calendar" />
            <div className="space-30"></div>
            <h3>등록된 예약이 없습니다.</h3>
            <div className="space-10"></div>
            <p className="align-center">
              업데이트 일정만 예약하면 자동으로 업데이트 할 수 있습니다.
              <br />
              자동화 기능을 사용해보세요!
            </p>
            <div className="space-40"></div>
            <Link className="btn btn-solid" to={`/schedule/new`}>
              예약 등록하기
            </Link>
          </div>
        </div>
      </div>
    );
  } else if (scheduleInfo || scheduleInfo === null) {
    const data = scheduleInfo !== null ? scheduleInfo : {};
    const classObj = new ScheduleInfo(data);
    const scheduleData = classObj.scheduleData;
    const hostData = classObj.hostData;

    return (
      <div className="area-sub">
        <div className="inner">
          <div className="dp-flex">
            <div className="mr-auto">
              <div className="dp-flex">
                <div className="st-wrap">
                  <span
                    className={clsx("st", {
                      available:
                        scheduleInfo && scheduleInfo[SCHEDULE_KEY_STATE],
                    })}
                  ></span>
                </div>
                <h5>
                  {(scheduleInfo && scheduleInfo[SCHEDULE_KEY_NAME]) ?? ""}
                </h5>
              </div>
            </div>
            <div className="ml-auto">
              <div className="btn-wrap">
                <Link
                  className="btn btn-outline"
                  to={`/schedule/info/${id}/edit`}
                >
                  수정
                </Link>
              </div>
            </div>
          </div>
          <div className="space-20"></div>
          {id && (
            <CustomTab
              id={id}
              scheduleData={scheduleData}
              hostData={hostData}
            />
          )}
          <div className="space-20"></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="area-sub">
        <div className="inner">
          <div className="not-found">
            <img src={error} alt="error" />
            <div className="space-30"></div>
            <h3>예약정보를 찾을 수 없습니다.</h3>
            <div className="space-10"></div>
            <p className="align-center">
              좌측 메뉴에서 확인하고자 하는 예약정보를 확인할 수 있습니다.
              <br />
              새로운 예약정보가 있는지 확인해 주세요!
            </p>
            <div className="space-40"></div>
            <ScheduleRefreshButton />
          </div>
        </div>
      </div>
    );
  }
}
