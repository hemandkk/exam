import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/v1",
  withCredentials: false,
});

const TOKEN_KEYS = ["access_token", "token"];
const excludedRoutes = [
  "/login",
  "/auth/login",
  "/register",
  "/auth/register",
  "/register-single-student",
  "/auth/refresh",
  "/refresh",
];

export const getStoredToken = () => {
  for (const key of TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token) {
      persistAuthToken(token);
      return token;
    }
  }
  return null;
};

export const persistAuthToken = (token) => {
  if (!token) return;
  localStorage.setItem("access_token", token);
  localStorage.setItem("token", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
};

const isExcludedRoute = (url = "") => {
  const normalizedUrl = String(url).toLowerCase();
  return excludedRoutes.some((route) => normalizedUrl.includes(route));
};

API.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    const isExcluded = isExcludedRoute(config.url);

    if (token && !isExcluded) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    if (
      (status === 401 || status === 403) &&
      !isExcludedRoute(url)
    ) {
      clearAuthToken();

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export const login = (data) => API.post("/login", data);
export const uploadQuestions = (formData) => API.post("/admin/upload-questions", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const getQuestions = (category) => API.post(`/questions/`, category);
export const submitAnswers = (data) => API.post("/submit-answers", data);
export const getResults = (studentId) => API.get(`/results/${studentId}`);

export default API;


