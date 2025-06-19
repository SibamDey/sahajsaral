import axios from "axios";

//
// export const devApi = "http://43.239.110.159:8094";
// export const devApi = "http://localhost:8094";

export const devApi = "https://api.wbpms.in";

export let baseURL;
const subdomain = window.location.host.split(".")[0];

baseURL = devApi;
let instance = axios.create({
  baseURL: baseURL,
  responseType: "json",
});



instance.interceptors.request.use(
  (config) => {
    const token = "Dev!l$k!tchen";
    if (token) {
      config.headers["deadlock"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;



