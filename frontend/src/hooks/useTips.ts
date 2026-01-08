import { useEffect, useState } from "react";
import { TipsAPI } from "../api/tips.api";

export function useTips() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TipsAPI.getAll()
      .then((res) => {
        console.log("Resposta da API:", res.data);
        setTips(res.data.results); // 👈 AQUI ESTÁ A CORREÇÃO
      })
      .finally(() => setLoading(false));
  }, []);

  return { tips, loading };
}
