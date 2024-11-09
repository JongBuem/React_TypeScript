import React from "react";
import { useNavigate } from "react-router-dom";
import { customerStore } from "global/customer";
import { scheduleListStore } from "global/schedule";
import { adProfileStore } from "global/profile";
import { GetSchedule, PostSchedule } from "pages/schedule";
import { TitleInput, ScheduleInformation, HostInformation } from "./Items";
import {
  loadingStore,
  titleStore,
  statusStore,
  subscriptionStore,
  dateStore,
  repeatedStore,
  hostStore,
} from "global/newSchedule";
import { Loading } from "components/item/Loading";
import moment from "moment";
import clsx from "clsx";

import { ScheduleData } from "common/constants/schedule.constant";

function RegistrationButton() {
  const navigate = useNavigate();
  const { customer } = customerStore();
  const { adProfile } = adProfileStore();
  const { setScheduleList } = scheduleListStore();
  const { newTitle } = titleStore();
  const { status } = statusStore();
  const { selectSubscription } = subscriptionStore();
  const { newStartDate, newStartTime } = dateStore();
  const { newCheckHostList } = hostStore();
  const { newRepeatedInput, newRepeated, newWeek, newDayofweek } =
    repeatedStore();

  const CreateSchedule = async (body: ScheduleData) => {
    const create = await PostSchedule(body); //스케줄 생성
    const list = await GetSchedule(customer.tenantId); //스케줄 리스트
    setScheduleList(list); //스케줄 리스트 업데이트
    if (create) navigate(`/schedule/info/${create}`); //생성된 스케줄로 이동
  };

  const RegistrationEvent = () => {
    const body = {
      useYn: status,
      tenantId: customer.tenantId,
      subscriptionId: selectSubscription,
      scheduleName: newTitle,
      firstStartDate: moment(newStartDate + " " + newStartTime).format(),
      startDateTime: moment(newStartDate + " " + newStartTime).format(),
      createUser: adProfile.mail ?? "",
      targetHostList: newCheckHostList,
      scheduleType: newRepeated, //반복타입 (반복안함 00, 주 01, 월 02)
      repeatCycleMonth: newRepeated === "02" ? newRepeatedInput : 0, //월 반복 타입
      repeatCycleWeek:
        newRepeated === "00"
          ? 0
          : newRepeated === "01"
          ? newRepeatedInput
          : Number(newWeek), //주 반복 타입 = 첫 번째주(1), 둘 번째주(2), 셋 번째주(3), 넷 번째주(4)
      repeatCycleDay: newRepeated === "00" ? 0 : Number(newDayofweek), //요일 반복 타입  = 월(0), 화(1), 수(2), 목(3), 금(4), 토(5), 일(6)
    };
    CreateSchedule(body as ScheduleData);
  };

  const DisabledCheck = () => {
    if (
      newTitle.length === 0 ||
      selectSubscription.length === 0 ||
      newCheckHostList.length === 0 ||
      !isNaN(Date.parse(moment(newStartDate + " " + newStartTime).format())) ===
        false
    )
      return true;
    else return false;
  };

  return (
    <button
      className={clsx("btn", {
        "btn-solid": !DisabledCheck(),
        "btn-ghost": DisabledCheck(),
      })}
      style={{ cursor: DisabledCheck() ? "context-menu" : "pointer" }}
      onClick={RegistrationEvent}
      disabled={DisabledCheck()}
    >
      등록
    </button>
  );
}

function NewContents() {
  const { loading } = loadingStore();
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // 뒤로가기
  };
  return (
    <div className="area-sub">
      <div className="inner">
        <div className="dp-flex">
          <div className="ml-auto">
            <div className="btn-wrap">
              <button className="btn btn-outline" onClick={handleGoBack}>
                취소
              </button>
              <RegistrationButton />
            </div>
          </div>
        </div>
        <div className="space-20"></div>
        <div className="tabs">
          <div className="tab-menu-wrap">
            <p className="tablinks tiny">예약명</p>
          </div>
        </div>
        <div id="schedule-thum-default" className="tabcontent">
          <table className="tbl tbl-basic" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td className="align-center">
                  <TitleInput />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="space-20"></div>
        <ScheduleInformation />
        <div className="space-20"></div>
        {loading ? <Loading /> : <HostInformation />}
      </div>
    </div>
  );
}

export default React.memo(NewContents);
