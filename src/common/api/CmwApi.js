import axios from 'axios';
import useSWR from 'swr';
import { getCookie } from 'common/utils/cookie';
import { RefreshAccessToken } from 'auth/acquireTokenSilent';

//Indirect API
export const axiosInstance = axios.create({
  baseURL: 'https://cmwapi.azurewebsites.net/v1',
  // baseURL: 'http://localhost:8800/v1',
  // baseURL: 'http://localhost:8181/v1',
  // baseURL: 'http://172.30.1.189:8000/v1',
});

//Bearer Token
export const setToken = (token) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const useAxiosSwr = (url, params, refreshInterval) => {
  const fetcher = (url) => axiosInstance.get(url, { params });

  const { data, mutate, error, isLoading } = useSWR(
    url,
    fetcher,
    refreshInterval,
  );
  return {
    data,
    isLoading,
    mutate,
    error,
  };
};

export const useAxiosSwrWithState = (url, params) => {
  const fetcher = async (url, params) => {
    const res = await axiosInstance.get(url, { params });
    return res.data;
  };
  const { data, mutate, error } = useSWR(() => [url, params], fetcher);
  return {
    data,
    isLoading: !error && !data,
    mutate,
    error,
  };
};

//get 방식
export const getAPI = async (url) => {
  return await axiosInstance.get(url);
};

//post 방식
export const postAPI = async (url, body) => {
  return await axiosInstance.post(url, body);
};

//delete 방식
export const deleteAPI = async (url, body) => {
  return await axiosInstance.delete(url, body);
};

//patch 방식
export const patchAPI = async (url, body) => {
  return await axiosInstance.patch(url, body);
};

//patch 방식
export const putAPI = async (url, body) => {
  return await axiosInstance.put(url, body);
};

//파일 업로드
export const fileUploadtAPI = async (url, params) => {
  return await axiosInstance.post(url, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

//파일 다운로드
export const fileDownloadAPI = async (url) => {
  return await axiosInstance.get(url, { responseType: 'blob' });
};

//API 응답전 실행
const requestHandler = async (config) => {
  const cookieToken = getCookie('CMVERIFY');
  if (!cookieToken) {
    const token = await RefreshAccessToken();
    if (token) {
      setToken(token);
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
};

const requestErrorHandler = (error) => {
  return Promise.reject(error);
};

//API 응답
const responseHandler = (response) => {
  return response;
};

//재요청
const recursive = async (error) => {
  const url = error.response.config.url;
  const method = error.response.config.method;
  const errorurl = sessionStorage.getItem('errorurl'); //이전 error url
  const errorcount = sessionStorage.getItem('errorcount'); //이전 error count

  //에러시 재요청 1번만 더 요청
  if (url == errorurl && Number(errorcount) < 0 && method == 'get') {
    sessionStorage.setItem('errorcount', Number(errorcount) + 1);
    const ReResponse = await getAPI(url);
    if (ReResponse) return ReResponse;
    else return Promise.reject(error);
  } else if (url != errorurl && method == 'get') {
    sessionStorage.setItem('errorurl', url);
    sessionStorage.setItem('errorcount', 0);
    const ReResponse = await getAPI(url);
    if (ReResponse) return ReResponse;
    else return Promise.reject(error);
  } else if (error?.response?.status == 401 && method != 'get') {
    return location.reload(true);
  } else {
    return Promise.reject(error);
  }
};

// return location.reload(true);
const responseErrorHandler = async (error) => {
  if (error?.response?.status == 401) {
    const token = await RefreshAccessToken();
    if (token) setToken(token);
    const result = await recursive(error);
    return result;
  } else if (error?.response) {
    const result = await recursive(error);
    return result;
  } else {
    return Promise.reject(error);
  }
};

//axios API호출
axiosInstance.interceptors.request.use(
  async (config) => await requestHandler(config),
  async (error) => await requestErrorHandler(error),
);

//axios API응답
axiosInstance.interceptors.response.use(
  async (response) => await responseHandler(response),
  async (error) => await responseErrorHandler(error),
);
