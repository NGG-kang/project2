import Axios from "axios";
import { makeUseAxios } from "axios-hooks";

export const axiosInstance = Axios.create({
  baseURL: "",
});

export const useAxios = makeUseAxios({
  axios: axiosInstance,
});
