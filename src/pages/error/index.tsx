//Error
import React from "react";
import errorImage from "assets/images/error.png";
import { ErrorProps } from "./types";

export default function Error(message: ErrorProps) {
  const errorMessage = message.props?.error?.message ?? "";

  return (
    <div className="container">
      <div id="error-wrapper">
        <div id="error-container">
          <div className="error-content">
            <img src={errorImage} alt="Error" />
            <h1>PAGE NOT FOUND</h1>
            <div className="space-20"></div>
            <h4>{errorMessage}</h4>
            <div className="space-30"></div>
            <div onClick={() => window.location.reload()}>
              <a className="btn btn-solid">Go to reload</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
