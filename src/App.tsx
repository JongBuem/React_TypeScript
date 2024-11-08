import React from "react";
import "./assets/css/App.css";
import "./assets/css/style.css";
import Routers from "./router";
import ErrorBoundary from "./pages/error/ErrorBoundary";
import { MsalProvider } from "@azure/msal-react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { PublicClientApplication } from "@azure/msal-browser";
interface AppProps {
  instance: PublicClientApplication;
}

//const App = ({ instance }: AppProps) => {}
const App: React.FC<AppProps> = ({ instance }) => {
  return (
    <div className="App">
      <SimpleBar style={{ maxHeight: "100vh" }}>
        <ErrorBoundary>
          <MsalProvider instance={instance}>
            <Routers />
          </MsalProvider>
        </ErrorBoundary>
      </SimpleBar>
    </div>
  );
};
export default App;
