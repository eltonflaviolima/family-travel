export default function TipCard({ tip }: any) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
      <h3>{tip.title}</h3>
      <p>{tip.content}</p>
    </div>
  );
}
