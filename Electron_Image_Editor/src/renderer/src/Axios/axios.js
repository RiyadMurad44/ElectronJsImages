import axios from 'axios'

// const axiosBaseUrl = axios.create({
//   baseURL: 'http://localhost:8000/api/v1', 
//   // baseURL: 'http://15.237.215.230:8000/api/v1', 
// })

// export default axiosBaseUrl


const token = localStorage.getItem("Token");

const axiosBaseUrl = axios.create({
  // baseURL: "http://13.37.211.34/hr-server/api/v1",
  // baseURL: "http://15.237.215.230:8000/api/v1",
  baseURL: "http://localhost:8000/api/v1",

  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

axiosBaseUrl.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosBaseUrl;