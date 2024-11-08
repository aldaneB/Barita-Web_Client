/**
 * Deal with api authorization and token management
 */

import axios from "axios";

//create base url
const apiEndpoint = axios.create({
  baseURL: "https://localhost:7075/api/v1",
});

//create instance of axios to add token to each request
apiEndpoint.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiEndpoint;
