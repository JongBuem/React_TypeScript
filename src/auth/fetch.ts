/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export const callApiWithToken = async (
  accessToken: string,
  apiEndpoint: string
) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(apiEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
};
