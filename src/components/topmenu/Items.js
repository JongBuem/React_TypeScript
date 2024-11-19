import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { scheduleListStore } from "global/schedule";
import { ScheduleConstant } from "common/constants";
import { GetSchedule } from "pages/schedule";
import { customerStore } from "global/customer";

export const ScheduleTopLink = React.memo(function ScheduleTopLink({
  setPath,
  SelectedStyle,
}) {
  const { customer } = customerStore();
  const { scheduleList, setScheduleList } = scheduleListStore();
  const scheduleURL =
    scheduleList?.length > 0
      ? `/schedule/info/${scheduleList[0][ScheduleConstant.SCHEDULE_KEY_ID]}`
      : `/schedule/info/notfound`;

  const ClickEventHandler = async () => {
    const result = await GetSchedule(customer.tenantId);
    setScheduleList(result);
  };

  return (
    <>
      <Link
        to={scheduleURL}
        className={clsx({
          selected: SelectedStyle(scheduleURL),
        })}
        onClick={() => {
          setPath(scheduleURL);
          ClickEventHandler();
        }}
      >
        Schedule
      </Link>
    </>
  );
});

ScheduleTopLink.propTypes = {
  setPath: PropTypes.any,
  SelectedStyle: PropTypes.any,
};
