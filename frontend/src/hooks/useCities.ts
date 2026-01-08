import { useEffect, useState } from "react";
import { CitiesAPI } from "../api/cities.api";

export function useCities() {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CitiesAPI.getAll()
      .then((res) => {
        console.log("Resposta da API:", res.data);
        setCities(res.data.results); // 👈 AQUI ESTÁ A CORREÇÃO
      })
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading };
}
