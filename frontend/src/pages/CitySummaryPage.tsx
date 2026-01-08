import { useCitiesSummary } from "../hooks/useCitiesSummary";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

export default function CitySummaryPage() {
  const { cities, loading, error } = useCitiesSummary();
  const navigate = useNavigate();

  // Função auxiliar para construir URL completa da imagem
  const getImageUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    // Se já for uma URL completa, retorna como está
    if (photoPath.startsWith("http")) return photoPath;
    // Caso contrário, constrói a URL completa
    return `${API_BASE_URL}${photoPath.startsWith("/") ? "" : "/"}${photoPath}`;
  };

  if (loading) return <p>Carregando resumo das cidades...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginBottom: 24, fontSize: 28, fontWeight: "bold" }}>
        Resumo do Itinerário
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {cities.map((city, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 24,
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Cabeçalho da Cidade */}
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

            {/* Lista de Atrações */}
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
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {city.attractions.map((attraction, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(`/attractions/${attraction.id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: 12,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 8,
                        border: "1px solid #f0f0f0",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#f9f9f9";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {/* Foto da Atração */}
                      {getImageUrl(attraction.photo) && (
                        <img
                          src={getImageUrl(attraction.photo)!}
                          alt={attraction.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      )}

                      {/* Ícone de pontos */}
                      {!getImageUrl(attraction.photo) && (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e0e0e0",
                            borderRadius: 6,
                          }}
                        >
                          <span style={{ fontSize: 20 }}>📍</span>
                        </div>
                      )}

                      {/* Informações da Atração */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              fontSize: 16,
                              fontWeight: "500",
                            }}
                          >
                            {attraction.name}
                          </h4>
                          {attraction.visited && (
                            <span
                              style={{
                                fontSize: 12,
                                padding: "2px 8px",
                                backgroundColor: "#4caf50",
                                color: "white",
                                borderRadius: 4,
                              }}
                            >
                              ✓ Visitado
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            marginTop: 4,
                            fontSize: 13,
                            color: "#666",
                          }}
                        >
                          <span>{attraction.type_display}</span>
                          {attraction.suggested_duration && (
                            <span>⏱️ {attraction.suggested_duration} min</span>
                          )}
                          {attraction.priority_order && (
                            <span>⭐ Prioridade: {attraction.priority_order}</span>
                          )}
                        </div>
                      </div>

                      {/* Seta de navegação */}
                      <div
                        style={{
                          fontSize: 20,
                          color: "#ccc",
                        }}
                      >
                        ›
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem se não houver atrações */}
            {city.attractions.length === 0 && (
              <p style={{ color: "#999", fontStyle: "italic" }}>
                Nenhuma atração cadastrada para esta cidade.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Mensagem se não houver cidades */}
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
