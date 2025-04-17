import axios from "axios";


const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: false,
});


// List of URLs to exclude from attaching Authorization header
const excludedRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
];

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    // Check if the request URL is not in the excluded list
    const isExcluded = excludedRoutes.some(route => config.url.includes(route));

    if (token && !isExcluded) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (data) => API.post("/login", data);
export const uploadQuestions = (formData) => API.post("/admin/upload-questions", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const getQuestions = (category) => API.post(`/questions/`,category);
export const submitAnswers = (data) => API.post("/submit-answers", data);
export const getResults = (studentId) => API.get(`/results/${studentId}`);

export default API;


