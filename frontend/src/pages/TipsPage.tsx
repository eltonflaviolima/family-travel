import { useTips } from "../hooks/useTips";
import TipCard from "../components/TipCard";

export default function TipsPage() {
  const { tips, loading } = useTips();

  if (loading) return <p>Carregando dicas...</p>;

  return (
    <div>
      <h1>Dicas de Viagem</h1>
      <div style={{ display: "grid", gap: 16 }}>
        {tips.map(t => (
          <TipCard key={t.id} tip={t} />
        ))}
      </div>
    </div>
  );
}
