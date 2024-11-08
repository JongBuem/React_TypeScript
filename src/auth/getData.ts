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
  AuthenticationResult,
  AccountInfo,
  SilentRequest,
} from "@azure/msal-browser";

import { loginRequest, protectedResources } from "./authConfig";
import { callApiWithToken } from "./fetch";

export interface GraphData {
  [key: string]: any;
}

export interface UseGetProfileResult {
  graphData: GraphData | null;
  interactionType: InteractionType;
  authenticationRequest: SilentRequest;
}

export const useGetProfile = (): UseGetProfileResult => {
  const authRequest: SilentRequest = {
    ...loginRequest,
  };

  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || ({} as AccountInfo));
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    if (account && inProgress === "none" && !graphData) {
      instance
        .acquireTokenSilent({
          scopes: protectedResources.graphMe.scopes,
          account: account,
        })
        .then((response: AuthenticationResult) => {
          callApiWithToken(
            response.accessToken,
            protectedResources.graphMe.endpoint
          ).then((apiResponse: GraphData) => {
            setGraphData(apiResponse);
          });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            if (account && inProgress === "none") {
              instance
                .acquireTokenPopup({
                  scopes: protectedResources.graphMe.scopes,
                })
                .then((response: AuthenticationResult) => {
                  callApiWithToken(
                    response.accessToken,
                    protectedResources.graphMe.endpoint
                  ).then((apiResponse: GraphData) => setGraphData(apiResponse));
                })
                .catch((error) => console.error(error));
            }
          }
        });
    }
  }, [account, inProgress, instance, graphData]);

  return {
    graphData,
    interactionType: InteractionType.Redirect,
    authenticationRequest: authRequest,
  };
};

export interface HelloData {
  token: string;
  [key: string]: any;
}

export interface UseGetTokenResult {
  helloData: HelloData | null;
  interactionType: InteractionType;
  authenticationRequest: SilentRequest;
}

export const useGetToken = (): UseGetTokenResult => {
  const authRequest: SilentRequest = {
    ...loginRequest,
  };

  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || ({} as AccountInfo));
  const [helloData, setHelloData] = useState<HelloData | null>(null);

  useEffect(() => {
    if (account && inProgress === "none" && !helloData) {
      instance
        .acquireTokenSilent({
          forceRefresh: true,
          scopes: protectedResources.apiHello.scopes,
          account: account,
        })
        .then((response: AuthenticationResult) => {
          setHelloData({ token: response.accessToken });
          // Uncomment below to call API
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
          if (error instanceof InteractionRequiredAuthError) {
            if (account && inProgress === "none") {
              instance
                .acquireTokenPopup({
                  scopes: protectedResources.apiHello.scopes,
                })
                .then((response: AuthenticationResult) => {
                  setHelloData({ token: response.accessToken });
                  // Uncomment below to call API
                  // callApiWithToken(
                  //   response.accessToken,
                  //   protectedResources.apiHello.endpoint,
                  //   response.expiresOn,
                  // ).then((apiResponse) =>
                  //   setHelloData({ token: response.accessToken, apiResponse }),
                  // );
                })
                .catch((error) => console.error(error));
            }
          }
        });
    }
  }, [account, inProgress, instance, helloData]);

  return {
    helloData,
    interactionType: InteractionType.Redirect,
    authenticationRequest: authRequest,
  };
};
