export default function AttractionCard({ attraction }: any) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
      <h3>{attraction.name}</h3>
      <p>Tipo: {attraction.type}</p>
    </div>
  );
}
