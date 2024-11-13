import React from "react";
import { HostData } from "./index";

export type TabPanelProps = {
  children: React.ReactNode;
  value: number;
  index: number;
  //   other: React.ReactNode | any | undefined | null;
};

export type CustomTabProps = {
  id: string;
  scheduleData: {
    subscriptionId: string;
    startDateTime: string;
    useYn: string;
    scheduleType: string;
    repeatCycleMonth: string;
    repeatCycleWeek: string;
    repeatCycleDay: string;
  };
  hostData: HostData;
};
