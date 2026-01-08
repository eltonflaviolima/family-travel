import { useCities } from "../hooks/useCities";
import CityCard from "../components/CityCard";
import AttractionItem from "../components/AttractionItem";

export default function CitiesPage() {
  const { cities, loading } = useCities();

  if (loading) return <p>Carregando cidades...</p>;

  return (
    <div>
      <h1>Cidades</h1>
      {/* <AttractionItem></AttractionItem> */}
      <div style={{ display: "grid", gap: 16 }}>
        {cities.map(c => (
          <CityCard key={c.id} city={c} />
        ))}
      </div> 
    </div>
  );
}
