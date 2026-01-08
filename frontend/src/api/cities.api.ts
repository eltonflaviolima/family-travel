import apiClient from "./apiClient";

export const CitiesAPI = {
  getAll: () => apiClient.get("/api/itinerary/cities/"),
  getById: (id: number) => apiClient.get(`/api/itinerary/cities/${id}/`),
  create: (data: any) => apiClient.post("/api/itinerary/cities/", data),

  getUpcoming: () => apiClient.get("/api/itinerary/cities/upcoming/"),
  getCurrent: () => apiClient.get("/api/itinerary/cities/current/"),
  getPast: () => apiClient.get("/api/itinerary/cities/past/"),

  getByCountry: (country: string) =>
    apiClient.get(`/api/itinerary/cities/by_country/?country=${country}`),

  getStatistics: (id: number) =>
    apiClient.get(`/api/itinerary/cities/${id}/statistics/`),

  getSummary: () => apiClient.get("/api/itinerary/cities/summary/"),
};

