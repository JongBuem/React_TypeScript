//get accessToken
import { msalInstance } from "index";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { protectedResources } from "./authConfig";
import { setCookie } from "common/utils/cookie";

export const RefreshAccessToken = async () => {
  const redirectResponse = await msalInstance.handleRedirectPromise();

  if (redirectResponse !== null) {
    // Acquire token silent success
    let accessToken = redirectResponse.accessToken;
    // Call your API with token
    return accessToken;
  } else {
    // MSAL.js v2 exposes several account APIs, logic to determine which account to use is the responsibility of the developer
    const account = msalInstance.getAllAccounts()[0];

    const token = await msalInstance
      .acquireTokenSilent({
        scopes: protectedResources.apiHello.scopes,
        account: account,
      })
      .then((response) => {
        setCookie("CMVERIFY", "verification", response.expiresOn);
        return response.accessToken;
      })
      .catch(async (error) => {
        // in case if silent token acquisition fails, fallback to an interactive method
        if (error instanceof InteractionRequiredAuthError) {
          if (account) {
            return msalInstance
              .acquireTokenPopup({
                scopes: protectedResources.apiHello.scopes,
              })
              .then((response) => {
                setCookie("CMVERIFY", "verification", response.expiresOn);
                return response.accessToken;
              })
              .catch(() => Window.location.reload(true));
          }
        }
      });
    return token;
  }
};
