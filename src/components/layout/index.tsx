import React from "react";
import Footer from "components/layout/Footer";
import Children from "components/layout/Children";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div id="container">
      <div id="contents">
        <div className="contents-bg">
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
                  fill="rgba(244, 245, 247 ,0.1)"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="3"
                  fill="rgba(244, 245, 247 ,0.15)"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="5"
                  fill="rgba(244, 245, 247 ,0.05)"
                />
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="7"
                  fill="rgba(0, 212, 255, 0.4)"
                />
              </g>
            </svg>
          </div>
        </div>
        <Children>{children}</Children>
        <Footer />
      </div>
    </div>
  );
};

export default React.memo(Layout);
