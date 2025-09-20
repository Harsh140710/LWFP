import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // important for cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/refresh-token`,
          {},
          { withCredentials: true }
        );
        localStorage.setItem("accessToken", res.data.data.accessToken);

        // Retry original request
        error.config.headers["Authorization"] = `Bearer ${res.data.data.accessToken}`;
        return axios(error.config);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
