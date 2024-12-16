import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { customerStore } from "global/customer";
import { scheduleListStore } from "global/schedule";
import { adProfileStore } from "global/profile";
import { GetSchedule, PatchSchedule } from "pages/schedule";
import { ScheduleInformation, EditHostInformation } from "./TapContents";
import { TitleInput } from "./Item";
import {
  loadingStore,
  titleStore,
  statusStore,
  subscriptionStore,
  dateStore,
  repeatedStore,
  hostStore,
} from "global/newSchedule";
import moment from "moment";
import clsx from "clsx";
import { Loading } from "components/item/Loading";
import { GetScheduleInfo } from "pages/schedule";
import { ScheduleData } from "../types";

interface RegistrationButtonProps {
  id: string | null;
}

export const RegistrationButton: React.FC<RegistrationButtonProps> = ({
  id,
}) => {
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

  const EditSchedule = async (scheduleId: string, body: ScheduleData) => {
    const create = await PatchSchedule(scheduleId, body); //스케줄 수정
    const list = await GetSchedule(customer.tenantId); //스케줄 리스트
    setScheduleList(list); //스케줄 리스트 업데이트
    if (create) navigate(`/schedule/info/${create}`); //생성된 스케줄로 이동
  };

  const RegistrationEvent = () => {
    if (id) {
      const body = {
        subscriptionId: selectSubscription,
        scheduleName: newTitle,
        startDateTime: moment(newStartDate + " " + newStartTime).format(),
        scheduleType: newRepeated, //반복타입 (반복안함 00, 주 01, 월 02)
        useYn: status,
        updateUser: adProfile.mail ?? "",
        targetHostList: newCheckHostList,
        repeatCycleMonth: newRepeated === "02" ? newRepeatedInput : 0, //월 반복 타입
        repeatCycleWeek:
          newRepeated === "00"
            ? 0
            : newRepeated === "01"
            ? newRepeatedInput
            : Number(newWeek), //주 반복 타입 = 첫 번째주(1), 둘 번째주(2), 셋 번째주(3), 넷 번째주(4)
        repeatCycleDay: newRepeated === "00" ? 0 : Number(newDayofweek), //요일 반복 타입  = 월(0), 화(1), 수(2), 목(3), 금(4), 토(5), 일(6)
      };
      // console.log(body);
      EditSchedule(id, body as ScheduleData);
    }
  };

  const DisabledCheck = () => {
    return (
      !newTitle ||
      !selectSubscription ||
      newCheckHostList.length === 0 ||
      isNaN(Date.parse(moment(`${newStartDate} ${newStartTime}`).format()))
    );
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
      수정완료
    </button>
  );
};

function EditContents() {
  console.log("Edit");
  const { loading } = loadingStore();
  const { id } = useParams();
  const [scheduleInfoID, setScheduleInfoID] = React.useState<string | null>(
    null,
  );
  const [scheduleInfo, setScheduleInfo] = React.useState<ScheduleData | null>(
    null,
  );

  const init = React.useCallback(async (scheduleID: string) => {
    const result = await GetScheduleInfo(scheduleID);
    setScheduleInfo(result);
    setScheduleInfoID(result._id);
  }, []);

  React.useEffect(() => {
    if (id) {
      init(id);
    }
  }, [id, init]);

  return (
    <div className="area-sub">
      <div className="inner">
        <div className="dp-flex">
          <div className="ml-auto">
            <div className="btn-wrap">
              <Link className="btn btn-outline" to={`/schedule/info/${id}`}>
                취소
              </Link>
              <RegistrationButton id={scheduleInfoID} />
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
                  <TitleInput scheduleInfo={scheduleInfo} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="space-20"></div>
        <ScheduleInformation scheduleInfo={scheduleInfo} />
        <div className="space-20"></div>
        {loading ? (
          <Loading />
        ) : (
          <EditHostInformation scheduleInfo={scheduleInfo} />
        )}
      </div>
    </div>
  );
}

export default React.memo(EditContents);
