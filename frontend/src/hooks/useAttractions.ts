import { useEffect, useState } from "react";
import { AttractionsAPI } from "../api/attractions.api";

export function useAttractions() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AttractionsAPI.getAll()
      .then((res) => {
        console.log("Resposta da API:", res.data);
        setItems(res.data.results); // 👈 AQUI ESTÁ A CORREÇÃO
      })
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}

