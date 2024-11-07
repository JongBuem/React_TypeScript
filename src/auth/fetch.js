/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { setCookie } from 'common/utils/cookie';

export const callApiWithToken = async (accessToken, apiEndpoint, accounts) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  if (accounts) {
    setCookie('CMVERIFY', 'verification', accounts);
  }

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch(apiEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
};
