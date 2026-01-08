import { useAttractions } from "../hooks/useAttractions";
import AttractionItem from "../components/AttractionItem";

export default function AttractionsPage() {
  const { items, loading } = useAttractions();

  if (loading) return <p>Carregando atrações...</p>;

  return (
    <div>
      {[...items]
        .sort((a, b) => a.id - b.id)
        .map((i) => (
          <AttractionItem key={i.id} attraction={i} />
        ))}
    </div>
  );
}

