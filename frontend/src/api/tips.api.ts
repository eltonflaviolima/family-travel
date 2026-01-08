import apiClient from "./apiClient";

export const TipsAPI = {
  getAll: () => apiClient.get("/api/itinerary/tips/"),
  create: (data: any) => apiClient.post("/api/itinerary/tips/", data),

  getByCategory: (category: string) =>
    apiClient.get(`/api/itinerary/tips/by_category/?category=${category}`),

  getStatistics: () => apiClient.get("/api/itinerary/tips/statistics/"),
};
