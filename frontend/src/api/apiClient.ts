import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000", // ajuste conforme seu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inserir o token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
