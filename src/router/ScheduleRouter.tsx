import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { withCookies } from "react-cookie";
import Schedule from "pages/schedule/index";

import EditContents from "components/schedule/EditContents";
import InfoContents from "components/schedule/InfoContents";
import NewContents from "components/schedule/NewContents";

const ScheduleRouter = () => {
  return (
    <Routes>
      <Route element={<Schedule />}>
        <Route path="/" element={<Navigate to="info" />} />
        <Route path="info/:id" element={<InfoContents />} />
        <Route path="info/:id/edit" element={<EditContents />} />
        <Route path="new" element={<NewContents />} />
      </Route>
    </Routes>
  );
};

export default withCookies(ScheduleRouter);
