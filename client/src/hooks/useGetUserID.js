import { useCookies } from "react-cookie";

export const useGetUserID = () => {
  return window.localStorage.getItem("userID");
};

export const useGetUserName = () => {
  return window.localStorage.getItem("userName");
};

export const useHasJwtCookie = () => {
  const [cookies] = useCookies(["access_token"]);
  return !!cookies.access_token;
};
