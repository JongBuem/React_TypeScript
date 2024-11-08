import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../auth/authConfig';
import logo from 'assets/images/logo_login.png';

export default function Login() {
  const { instance } = useMsal();
  const SignUp = () => {
    // instance.loginRedirect(loginRequest);
    const promiseResult = Promise.resolve(instance.loginPopup(loginRequest));
    promiseResult.catch((err) => console.log(err));
  };

  return (
    <div id="login-wrapper" style={{ height: '100vh' }}>
      <div className="login-bg">
        <div className="waves-wrap">
          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="0"
                fill="rgba(255, 255, 255 ,0.03)"
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="3"
                fill="rgba(0, 70, 156, 0.3)"
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="5"
                fill="rgba(0, 70, 156, 0.3)"
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="7"
                fill="rgba(0, 70, 156, 0.3)"
              />
            </g>
          </svg>
        </div>
      </div>
      <div id="login-container">
        <div className="login-content">
          <div className="wrap-form">
            <div className="login-title-wrap">
              <div className="login-logo">
                <img src={logo} alt="로고" />
                <p>Configure Maintenance Window</p>
              </div>
              <p>Welcome to ClooOps CMW.</p>
              <p>Experience the best tools for cloud management.</p>
            </div>
            <div className="login-btn-wrap">
              <a className="login-btn" onClick={SignUp}>
                Microsoft 계정으로 로그인
              </a>
            </div>
            <div className="login-footer">
              <p className="ft-100">Copyright ⓒ 2023</p>
              <p className="ft-100">Cloocus Co. Ltd. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
