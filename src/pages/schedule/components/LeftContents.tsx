import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { scheduleListStore } from "global/schedule";
import SimpleBar from "simplebar-react";
import { ScheduleConstant } from "common/constants";
import { ScheduleData } from "../types";

function LeftContents() {
  console.log("Left");
  const { id } = useParams();
  const { scheduleList } = scheduleListStore();
  const list: ScheduleData[] = scheduleList;

  const Selected = (arg: any) => {
    if (id === arg) return true;
    else return false;
  };

  return (
    <div className="area-main">
      <div
        className="inner"
        data-simplebar
        style={{ paddingRight: 0, maxHeight: "800px" }}
      >
        <div className="dp-flex" style={{ paddingRight: "20px" }}>
          <div className="mr-auto">
            <h5>예약목록</h5>
          </div>
          <div className="ml-auto">
            <div className="btn-wrap">
              <Link className="btn btn-outline" to={"/schedule/new"}>
                생성
              </Link>
            </div>
          </div>
        </div>
        <div className="space-20"></div>
        {scheduleList?.length > 0 ? (
          <SimpleBar style={{ maxHeight: "780px" }}>
            <div className="list-wrap hover" style={{ maxHeight: "780px" }}>
              <ul style={{ paddingRight: "20px" }}>
                {list &&
                  list?.map((value) => {
                    const _id = value[ScheduleConstant.SCHEDULE_KEY_ID];
                    const name = value[ScheduleConstant.SCHEDULE_KEY_NAME];
                    const state = value[ScheduleConstant.SCHEDULE_KEY_STATE];

                    return (
                      <li
                        style={{ padding: 0 }}
                        className={clsx({
                          selected: Selected(_id),
                        })}
                      >
                        <Link to={`/schedule/info/${_id}`}>
                          <div
                            className="dp-flex"
                            style={{ padding: "16px 15px" }}
                          >
                            <div className="mr-auto">
                              <div className="dp-flex">
                                <div className="st-wrap">
                                  <span
                                    className={clsx("st", {
                                      available: state,
                                    })}
                                  ></span>
                                </div>
                                <h5
                                  style={
                                    Selected(_id)
                                      ? { color: "#111" }
                                      : { color: "#707070" }
                                  }
                                >
                                  {name}
                                </h5>
                              </div>
                            </div>
                            <div className="ml-auto">
                              <i className="icon-arrow-right ft-lightgray"></i>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </SimpleBar>
        ) : (
          <div className="not-found">
            <h5>예약이 없습니다.</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(LeftContents);
