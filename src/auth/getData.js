/**
 * The `MsalAuthenticationTemplate` component will render its children if a user is authenticated
 * or attempt to sign a user in. Just provide it with the interaction type you would like to use
 * (redirect or popup) and optionally a [request object](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md)
 * to be passed to the login API, a component to display while authentication is in progress or a component to display if an error occurs. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
import React, { useEffect, useState } from "react";
import { useMsal, useAccount } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionType,
} from "@azure/msal-browser";

import { loginRequest, protectedResources } from "./authConfig";
import { callApiWithToken } from "./fetch";

export const useGetProfile = () => {
  const authRequest = {
    ...loginRequest,
  };

  /**
   * useMsal is hook that returns the PublicClientApplication instance,
   * an array of all accounts currently signed in and an inProgress value
   * that tells you what msal is currently doing. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (account && inProgress === "none" && !graphData) {
      instance
        .acquireTokenSilent({
          scopes: protectedResources.graphMe.scopes,
          account: account,
        })
        .then((response) => {
          callApiWithToken(
            response.accessToken,
            protectedResources.graphMe.endpoint
          ).then((response) => {
            setGraphData(response);
          });
        })
        .catch((error) => {
          // in case if silent token acquisition fails, fallback to an interactive method
          if (error instanceof InteractionRequiredAuthError) {
            if (account && inProgress === "none") {
              instance
                .acquireTokenPopup({
                  scopes: protectedResources.graphMe.scopes,
                })
                .then((response) => {
                  callApiWithToken(
                    response.accessToken,
                    protectedResources.graphMe.endpoint
                  ).then((response) => setGraphData(response));
                })
                .catch((error) => console.log(error));
            }
          }
        });
    }
  }, [account, inProgress, instance]);

  return {
    graphData,
    interactionType: InteractionType.Redirect,
    authenticationRequest: authRequest,
  };
};

export const useGetToken = () => {
  const authRequest = {
    ...loginRequest,
  };

  /**
   * useMsal is hook that returns the PublicClientApplication instance,
   * an array of all accounts currently signed in and an inProgress value
   * that tells you what msal is currently doing. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [helloData, setHelloData] = useState(null);

  useEffect(() => {
    if (account && inProgress === "none" && !helloData) {
      instance
        .acquireTokenSilent({
          forceRefresh: true,
          scopes: protectedResources.apiHello.scopes,
          account: account,
        })
        .then((response) => {
          setHelloData({ token: response.accessToken });
          // callApiWithToken(
          //   response.accessToken,
          //   protectedResources.apiHello.endpoint,
          //   response.expiresOn,
          // ).then((apiResponse) =>
          //   setHelloData({
          //     token: response.accessToken,
          //     apiResponse,
          //     ...response,
          //   }),
          // );
        })
        .catch((error) => {
          // in case if silent token acquisition fails, fallback to an interactive method
          if (error instanceof InteractionRequiredAuthError) {
            if (account && inProgress === "none") {
              instance
                .acquireTokenPopup({
                  scopes: protectedResources.apiHello.scopes,
                })
                .then((response) => {
                  setHelloData({ token: response.accessToken });
                  // callApiWithToken(
                  //   response.accessToken,
                  //   protectedResources.apiHello.endpoint,
                  //   response.expiresOn,
                  // ).then((apiResponse) =>
                  //   setHelloData({ token: response.accessToken, apiResponse }),
                  // );
                })
                .catch((error) => console.log(error));
            }
          }
        });
    }
  }, [account, inProgress, instance]);

  return {
    helloData,
    interactionType: InteractionType.Redirect,
    authenticationRequest: authRequest,
  };
};
