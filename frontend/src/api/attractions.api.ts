import apiClient from "./apiClient";

export interface ReorderPayload {
  city_id: number;
  attraction_ids: number[];
}

export const AttractionsAPI = {
  getAll: () => apiClient.get("/api/itinerary/attractions/"),
  create: (data: any) => apiClient.post("/api/itinerary/attractions/", data),

  getByType: (type: string) =>
    apiClient.get(`/api/itinerary/attractions/by_type/?type=${type}`),

  getPopular: () => apiClient.get("/api/itinerary/attractions/popular/"),

  addTip: (id: number, tip: any) =>
    apiClient.post(`/api/itinerary/attractions/${id}/add_tip/`, tip),

  reorder: (payload: ReorderPayload) =>
    apiClient.post("/api/itinerary/attractions/reorder/", payload),
};
