//Error
import React from "react";
import error from "assets/images/error.png";
export default function Error(message) {
  const errorMessage = message?.props?.error?.message ?? "";

  return (
    <div className="container">
      <div id="error-wrapper">
        <div id="error-container">
          <div className="error-content">
            <img src={error} />
            <h1>PAGE NOT FOUND</h1>
            <div className="space-20"></div>
            <h4>{errorMessage}</h4>
            <div className="space-30"></div>
            <div onClick={() => Window.location.reload(true)}>
              <a className="btn btn-solid">Go to reload</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
