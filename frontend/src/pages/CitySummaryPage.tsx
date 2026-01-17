import {
  useCitiesSummary,
  AttractionSummary,
} from "../hooks/useCitiesSummary";
import { useNavigate } from "react-router-dom";
import { SortableAttractionsList } from "../components/SortableAttractionsList";

const API_BASE_URL = "http://localhost:8000";

export default function CitySummaryPage() {
  const {
    cities,
    loading,
    error,
    reordering,
    updateLocalOrder,
    reorderAttractions,
  } = useCitiesSummary();
  const navigate = useNavigate();

  const getImageUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${API_BASE_URL}${photoPath.startsWith("/") ? "" : "/"}${photoPath}`;
  };

  const handleReorder = (
    cityId: number,
    newAttractions: AttractionSummary[],
    attractionIds: number[]
  ) => {
    updateLocalOrder(cityId, newAttractions);
    reorderAttractions(cityId, attractionIds);
  };

  if (loading) return <p>Carregando resumo das cidades...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginBottom: 24, fontSize: 28, fontWeight: "bold" }}>
        Resumo do Itinerário
        {reordering && (
          <span
            style={{
              fontSize: 14,
              color: "#666",
              fontWeight: "normal",
              marginLeft: 12,
            }}
          >
            Salvando...
          </span>
        )}
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {cities.map((city) => (
          <div
            key={city.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 24,
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Cabecalho da Cidade */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {getImageUrl(city.photo) && (
                  <img
                    src={getImageUrl(city.photo)!}
                    alt={city.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
                    {city.name}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginTop: 8,
                      color: "#666",
                      fontSize: 14,
                    }}
                  >
                    {city.arrival_date_formatted && (
                      <span>
                        📅 {city.arrival_date_formatted}
                        {city.departure_date_formatted &&
                          ` - ${city.departure_date_formatted}`}
                      </span>
                    )}
                    {city.duration_days !== null && (
                      <span>⏱️ {city.duration_days} dias</span>
                    )}
                    <span>📍 {city.attractions_count} atrações</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Atracoes com Drag-and-Drop */}
            {city.attractions.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 16,
                    color: "#333",
                  }}
                >
                  Atrações do Dia
                  <span
                    style={{
                      fontSize: 12,
                      color: "#999",
                      fontWeight: "normal",
                      marginLeft: 8,
                    }}
                  >
                    (arraste para reordenar)
                  </span>
                </h3>
                <SortableAttractionsList
                  cityId={city.id}
                  attractions={city.attractions}
                  onReorder={handleReorder}
                  onNavigate={(id) => navigate(`/attractions/${id}`)}
                  getImageUrl={getImageUrl}
                />
              </div>
            )}

            {/* Mensagem se nao houver atracoes */}
            {city.attractions.length === 0 && (
              <p style={{ color: "#999", fontStyle: "italic" }}>
                Nenhuma atração cadastrada para esta cidade.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Mensagem se nao houver cidades */}
      {cities.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "#999",
          }}
        >
          <p>Nenhuma cidade cadastrada no itinerário.</p>
        </div>
      )}
    </div>
  );
}
