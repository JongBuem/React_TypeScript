import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useMsal } from "@azure/msal-react";
import { Outlet, Link } from "react-router-dom";
import { loginDirectURL } from "router";
import Layout from "components/layout";
import logo from "assets/images/logo.png";
import logout from "assets/images/logout.png";
import company from "assets/images/company.jpg";
import { adProfileStore } from "global/profile";
import { ScheduleTopLink } from "./Items";

function Topmenu() {
  console.log("Top");
  const monitoringURL = `/${loginDirectURL}`;
  const { instance } = useMsal();
  const { adProfile } = adProfileStore();
  const [path, setPath] = React.useState(window.location.pathname);
  // const [lang, setLan] = React.useState(
  //   localStorage.getItem("cmwLng") ? localStorage.getItem("cmwLng") : "ko"
  // );

  // const handleChange = (event) => {
  //   // setLan(event.target.value);
  //   setLan("en");
  // };

  const SelectedStyle = React.useCallback((url: string) => {
    if (path === url) return true;
    else if ("/" + path.split("/")[1] === "/" + url.split("/")[1]) return true;
    else return false;
  }, []);

  const Logout = React.useCallback(() => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
      // mainWindowRedirectUri: "/",
    });
    sessionStorage.clear();
  }, []);

  return (
    <div id="wrapper" data-simplebar style={{ display: "block" }}>
      <div id="gnb">
        <div className="inner">
          <div className="left-gnb">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link
                to={monitoringURL}
                className="logo"
                onClick={() => setPath(monitoringURL)}
              >
                <img src={logo} alt="logo" />
              </Link>
            </div>
            <ul className="menu-wrap">
              <li>
                <Link
                  to={monitoringURL}
                  className={clsx({
                    selected: SelectedStyle(monitoringURL),
                  })}
                  onClick={() => setPath(monitoringURL)}
                >
                  Monitoring
                </Link>
              </li>
              <li>
                <ScheduleTopLink
                  setPath={setPath}
                  SelectedStyle={SelectedStyle}
                />
                {/* <Link
                  to={scheduleURL}
                  className={clsx({
                    selected: SelectedStyle(scheduleURL),
                  })}
                  onClick={() => setPath(scheduleURL)}
                >
                  Schedule
                </Link> */}
              </li>
            </ul>
          </div>
          <div className="right-gnb">
            <div className="item">
              <p>{adProfile?.mail ?? ""}</p>
            </div>
            <div className="item">
              <div className="company-symbol">
                <img src={company} />
              </div>
            </div>
            <div className="item">
              <a className="logout" onClick={Logout}>
                <img src={logout} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Layout>
        <Outlet />
      </Layout>
    </div>
  );
}

Topmenu.propTypes = {
  profile: PropTypes.object,
  path: PropTypes.object,
};
export default React.memo(Topmenu);
