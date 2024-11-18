import React from "react";
import moment from "moment";
import { Tabs, Tab, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ScheduleHostLog,
  TabHostLogSelects,
  // ScheduleLog,
  // TabLogSelects,
} from "./Item";

import { ScheduleConstant } from "common/constants/inex";

import { TabPanelProps, CustomTabProps } from "../types/tap";

export const StyledTab = styled(Tab)(() => ({
  width: 100,
  fontSize: 15,
  fontWeight: 600,
  lineHeight: 1.5,
  fontFamily:
    "'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif",
  color: "#172b4d",
  letterSpacing: "-0.2px",
  textTransform: "none",
  "&.MuiButtonBase-root": {
    display: "flex",
    flexDirection: "row",
    justifyItems: "center",
    justifyContent: "flex-start",
    minWidth: "80px",
    padding: "10px 10px",
  },
  "&.Mui-selected": {
    color: "#0165CC",
  },
  "&.MuiTab-textColorPrimary": {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
}));

export const TabPanel = ({ children, value, index }: TabPanelProps) => {
  // const { children, value, index, other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ borderTop: "1px solid #000" }}
      // {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const CustomTab = ({ id, scheduleData }: CustomTabProps) => {
  const [value, setValue] = React.useState<number>(0); //tab 위치
  const tabhandleChange = (e: React.SyntheticEvent, index: number) => {
    setValue(index); //tab 위치 변경
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={tabhandleChange}
        aria-label="basic tabs example"
        TabIndicatorProps={{
          style: {
            display: "none",
          },
        }}
      >
        {["예약정보", "호스트정보", "예약로그"].map((item, index) => (
          <StyledTab
            key={index}
            disableRipple
            label={item}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>

      <TabPanel value={value} index={0}>
        <div className="tabcontent">
          <table className="tbl tbl-basic" style={{ width: "100%" }}>
            <colgroup>
              <col width="10%" />
              <col width="35%" />
              <col width="15%" />
              <col width="15%" />
              <col width="" />
            </colgroup>
            <thead>
              <tr>
                <th>상태</th>
                <th>구독</th>
                <th>시작날짜</th>
                <th>시작시간</th>
                <th>반복설정</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="align-center">
                  {scheduleData[ScheduleConstant.SCHEDULE_KEY_STATE]}
                </td>
                <td className="align-center">
                  {scheduleData[ScheduleConstant.SCHEDULE_KEY_SUBSID]}
                </td>
                <td className="align-center">
                  {scheduleData[ScheduleConstant.SCHEDULE_KEY_STARTDATETIME]
                    .length > 0 &&
                    moment(
                      scheduleData[ScheduleConstant.SCHEDULE_KEY_STARTDATETIME]
                    ).format("YYYY-MM-DD")}
                </td>
                <td className="align-center">
                  {scheduleData[ScheduleConstant.SCHEDULE_KEY_STARTDATETIME]
                    .length > 0 &&
                    moment(
                      scheduleData[ScheduleConstant.SCHEDULE_KEY_STARTDATETIME]
                    ).format("hh:mm a")}
                </td>
                <td className="align-center">
                  {scheduleData[ScheduleConstant.SCHEDULE_KEY_SCHEDULETYPE] +
                    scheduleData[
                      ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEMONTH
                    ] +
                    scheduleData[
                      ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEWEEK
                    ] +
                    scheduleData[ScheduleConstant.SCHEDULE_KEY_REPEATCYCLEDAY]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="tabcontent">
          <TabHostLogSelects index={1} />
          <ScheduleHostLog id={id} />
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="tabcontent">
          {/* <TabLogSelects index={2} />
          <ScheduleLog id={id} /> */}
        </div>
      </TabPanel>
    </>
  );
};
