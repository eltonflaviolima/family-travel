import { useEffect, useState } from "react";
import { CitiesAPI } from "../api/cities.api";

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

  useEffect(() => {
    CitiesAPI.getSummary()
      .then((res) => {
        console.log("Resumo das cidades:", res.data);
        setCities(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar resumo:", err);
        setError("Erro ao carregar o resumo das cidades");
      })
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading, error };
}
