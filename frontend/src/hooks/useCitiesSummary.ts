import { useEffect, useState, useCallback } from "react";
import { CitiesAPI } from "../api/cities.api";
import { AttractionsAPI } from "../api/attractions.api";

export interface AttractionSummary {
  id: number;
  name: string;
  type: string;
  type_display: string;
  photo: string | null;
  suggested_duration: number | null;
  priority_order: number | null;
  visited: boolean;
}

export interface CitySummary {
  id: number;
  name: string;
  photo: string | null;
  arrival_date_formatted: string | null;
  departure_date_formatted: string | null;
  duration_days: number | null;
  attractions_count: number;
  attractions: AttractionSummary[];
}

export function useCitiesSummary() {
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const fetchCities = useCallback(() => {
    setLoading(true);
    CitiesAPI.getSummary()
      .then((res) => {
        console.log("Resumo das cidades:", res.data);
        setCities(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Erro ao buscar resumo:", err);
        setError("Erro ao carregar o resumo das cidades");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const updateLocalOrder = useCallback(
    (cityId: number, newAttractions: AttractionSummary[]) => {
      setCities((prev) =>
        prev.map((city) =>
          city.id === cityId ? { ...city, attractions: newAttractions } : city
        )
      );
    },
    []
  );

  const reorderAttractions = useCallback(
    async (cityId: number, attractionIds: number[]) => {
      setReordering(true);
      try {
        await AttractionsAPI.reorder({
          city_id: cityId,
          attraction_ids: attractionIds,
        });
      } catch (err) {
        console.error("Erro ao reordenar:", err);
        fetchCities();
        setError("Erro ao salvar a nova ordem");
      } finally {
        setReordering(false);
      }
    },
    [fetchCities]
  );

  return {
    cities,
    setCities,
    loading,
    error,
    reordering,
    updateLocalOrder,
    reorderAttractions,
    refetch: fetchCities,
  };
}
