import React from "react";
import { withCookies } from "react-cookie";
import { Route, Routes, Navigate } from "react-router-dom";
import { BasicLoading } from "components/item/Loading";
import Login from "pages/login";
import Topmenu from "components/topmenu";
import Monitoring from "pages/monitoring";
import ScheduleRouter from "router/ScheduleRouter";
import Error from "pages/error";
import { getAPI } from "common/api/CmwApi";
import { GetSchedule } from "pages/schedule";
import { subscriptionStore } from "global/newSchedule";
import { useGetToken, useGetProfile } from "auth/getData";
import { setToken } from "common/api/CmwApi";
import { adProfileStore } from "global/profile";
import { customerStore } from "global/customer";
import { scheduleListStore } from "global/schedule";
import { systemcodeStore } from "global/systemcode";
import {
  AuthenticatedTemplate, //로그인 성공
  UnauthenticatedTemplate, //로그인 실패
} from "@azure/msal-react";

export const loginURL = "login";
export const loginDirectURL = "monitoring";

const Routers = () => {
  const token = useGetToken();
  const profile = useGetProfile();
  const { setAdProfile } = adProfileStore();
  const { customer, setCustomer } = customerStore();
  const { setScheduleList } = scheduleListStore();
  const { setSubscriptions } = subscriptionStore();
  const { setSystemcode } = systemcodeStore();
  const [toeknCheck, setToeknCheck] = React.useState(false);
  const [profileCheck, setProfileCheck] = React.useState(false);
  const [customerCheck, setCustomerCheck] = React.useState(false);
  const [scheduleCheck, setScheduleCheck] = React.useState(false);
  const [systemcodeCheck, setSystemcodeCheck] = React.useState(false);
  const [check, setCheck] = React.useState(false);

  /**
   * Post-login Behavior
   * Get Microsoft Active Directory user token
   * API headers token setting
   */
  React.useEffect(() => {
    if (token.helloData != null) {
      setToken(token.helloData.token); //axiosInstance.defaults.headers.common['Authorization']
      setToeknCheck(true);
    }
  }, [token.helloData]);

  /**
   * Post-login Behavior
   * Get Microsoft Active Directory user profile
   * Save to zustand adProfileStore
   */
  React.useEffect(() => {
    async function Customers(tenantId: string) {
      const result = await getAPI(`/customers/${tenantId}`);
      if (result.data) {
        setCustomer(result.data);
        setSubscriptions(result?.data?.subscriptions?.items ?? []);
        setCustomerCheck(true);
      }
    }

    async function Profile(mail: string) {
      const result = await getAPI(`/profiles/email/${mail}`);
      Customers(result?.data?.tenantId);
    }

    if (profile.graphData != null) {
      const profileData = profile.graphData;
      Profile(profileData.mail);
      setAdProfile(profileData);
      setProfileCheck(true);
    }
  }, [profile.graphData]);

  /**
   * Post-login Behavior
   * Get schedule list api call
   * Save to zustand scheduleListStore
   */
  React.useEffect(() => {
    async function Schedule(tenantId: string) {
      const result = await GetSchedule(tenantId);
      setScheduleList(result);
      setScheduleCheck(true);
    }

    if (toeknCheck && customer.tenantId) Schedule(customer.tenantId);
  }, [toeknCheck, customer]);

  /**
   * Post-login Behavior
   * Get systemcode list api call
   * Save to zustand systemcodeStore
   */
  React.useEffect(() => {
    async function SystemCodes() {
      const result = await getAPI(`/system-codes`);
      setSystemcode(result.data.items);
      setSystemcodeCheck(true);
    }

    if (toeknCheck) SystemCodes();
  }, [toeknCheck]);

  React.useEffect(() => {
    if (
      toeknCheck &&
      profileCheck &&
      customerCheck &&
      scheduleCheck &&
      systemcodeCheck
    )
      setCheck(true);
  }, [toeknCheck, profileCheck, customerCheck, scheduleCheck, systemcodeCheck]);

  return (
    <Routes>
      <Route
        index
        element={
          <React.Fragment>
            <UnauthenticatedTemplate>
              <Navigate to={"/" + loginURL} />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
              <Navigate to={"/" + loginDirectURL} />
            </AuthenticatedTemplate>
          </React.Fragment>
        }
      />
      <Route
        path={"/" + loginURL}
        element={
          <React.Fragment>
            <UnauthenticatedTemplate>
              <Login />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
              <Navigate to={"/" + loginDirectURL} />
            </AuthenticatedTemplate>
          </React.Fragment>
        }
      />
      <Route
        path="/*"
        element={
          <React.Fragment>
            <AuthenticatedTemplate>
              {check ? <Topmenu /> : <BasicLoading />}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <Navigate to={"/" + loginURL} />
            </UnauthenticatedTemplate>
          </React.Fragment>
        }
      >
        <Route path={loginDirectURL} element={<Monitoring />} />
        <Route path={"schedule/*"} element={<ScheduleRouter />} />
      </Route>
      <Route path="error" element={<Error />} />
    </Routes>
  );
};

export default withCookies(Routers);
