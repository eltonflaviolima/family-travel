export default function CityCard({ city }: any) {
  const arrival_date = new Date(city.arrival_date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
  const arrival_date_week_day = new Date(city.arrival_date).toLocaleDateString("pt-BR", {
    weekday: "long",
  });

  const departure_date = new Date(city.departure_date).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
    }
  );
  return (
    <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
      <h3>{city.name}</h3>
      <p>Pais: {city.country}</p>
      <p>Data da Chegada: {arrival_date}</p>
      <p>Data da Partida: {departure_date}</p>
      <p>{arrival_date_week_day} • {city.attractions_count} atrações</p>
    </div>
  );
}
