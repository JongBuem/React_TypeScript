import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import useSWR, { SWRResponse } from "swr";
import { getCookie } from "common/utils/cookie";
import { RefreshAccessToken } from "auth/acquireTokenSilent";

// Indirect API
export const axiosInstance = axios.create({
  baseURL: "https://cmwapi.azurewebsites.net/v1",
});

// Bearer Token
export const setToken = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const useAxiosSwr = <T>(
  url: string,
  params: any,
  refreshInterval?: number
): SWRResponse<T, any> => {
  const fetcher = (url: string) =>
    axiosInstance.get(url, { params }).then((res) => res.data);
  return useSWR<T>(url, fetcher, { refreshInterval });
};

// GET 방식
export const getAPI = async (url: string) => await axiosInstance.get(url);

// POST 방식
export const postAPI = async (url: string, body: object) =>
  await axiosInstance.post(url, body);

// DELETE 방식
export const deleteAPI = async (url: string, body: object) =>
  await axiosInstance.delete(url, { data: body });

// PATCH 방식
export const patchAPI = async (url: string, body: object) =>
  await axiosInstance.patch(url, body);

// PUT 방식
export const putAPI = async (url: string, body: object) =>
  await axiosInstance.put(url, body);

// 파일 업로드
export const fileUploadtAPI = async (url: string, params: object | Node) => {
  return await axiosInstance.post(url, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 파일 다운로드
export const fileDownloadAPI = async (url: string) => {
  return await axiosInstance.get(url, { responseType: "blob" });
};

// API 응답 전 실행
const requestHandler = async (config: InternalAxiosRequestConfig) => {
  const cookieToken = getCookie("CMVERIFY");
  if (!cookieToken) {
    const token = await RefreshAccessToken();
    if (token) {
      setToken(token);
      // // config.headers가 AxiosHeaders인지 확인 후 설정
      // if (config.headers instanceof AxiosHeaders) {
      //   config.headers.set("Authorization", `Bearer ${token}`);
      // }
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
};

const requestErrorHandler = (error: AxiosError): Promise<AxiosError> =>
  Promise.reject(error);

// API 응답 처리
const responseHandler = async (response: AxiosResponse) => response;

// 재요청 로직
const recursive = async (error: AxiosError) => {
  const url = error.response?.config.url;
  const method = error.response?.config.method;
  const errorurl = sessionStorage.getItem("errorurl");
  const errorcount = sessionStorage.getItem("errorcount");

  if (url === errorurl && Number(errorcount) < 0 && method === "get") {
    sessionStorage.setItem("errorcount", `${Number(errorcount) + 1}`);
    const reResponse = await getAPI(url!);
    return reResponse ?? Promise.reject(error);
  } else if (url !== errorurl && method === "get") {
    sessionStorage.setItem("errorurl", url!);
    sessionStorage.setItem("errorcount", "0");
    const reResponse = await getAPI(url!);
    return reResponse ?? Promise.reject(error);
  } else if (error.response?.status === 401 && method !== "get") {
    window.location.reload();
  } else {
    return Promise.reject(error);
  }
};

// 응답 에러 핸들러
const responseErrorHandler = async (error: AxiosError) => {
  if (error.response?.status === 401) {
    const token = await RefreshAccessToken();
    if (token) setToken(token);
    return await recursive(error);
  } else if (error.response) {
    return await recursive(error);
  } else {
    return Promise.reject(error);
  }
};

// Axios 인터셉터 설정
axiosInstance.interceptors.request.use(
  async (config) => await requestHandler(config as InternalAxiosRequestConfig),
  async (error) => await requestErrorHandler(error as AxiosError)
);

axiosInstance.interceptors.response.use(
  async (response) => await responseHandler(response as AxiosResponse),
  async (error) => await responseErrorHandler(error as AxiosError)
);

export default axiosInstance;
