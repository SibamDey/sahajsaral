import axios from "axios";

//
// export const devApi = "http://43.239.110.159:8094";
// export const devApi = "http://localhost:8094";

export const devApi = "https://javaapi.wbpms.in/api";

export let baseURL;
const subdomain = window.location.host.split(".")[0];

baseURL = devApi;
let instance = axios.create({
  baseURL: baseURL,
  responseType: "json",
});

const authToken = localStorage.getItem("GPMS_USER_DETAILS");
console.log(authToken, "authToken")


instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("GPMS_USER_DETAILS");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;



