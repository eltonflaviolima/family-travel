import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

interface AttractionDetail {
  id: number;
  name: string;
  type: string;
  type_display: string;
  description: string;
  fun_fact: string;
  photo: string | null;
  suggested_duration: number | null;
  priority_order: number | null;
  visited: boolean;
  city: number;
  city_name: string;
}

export default function AttractionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState<AttractionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFunFactExpanded, setIsFunFactExpanded] = useState(false);

  // Função auxiliar para construir URL completa da imagem
  const getImageUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath;
    return `${API_BASE_URL}${photoPath.startsWith("/") ? "" : "/"}${photoPath}`;
  };

  // Função para converter minutos em horas formatadas
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${API_BASE_URL}/api/itinerary/attractions/${id}/`)
      .then((res) => {
        console.log("Detalhes da atração:", res.data);
        setAttraction(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar atração:", err);
        setError("Erro ao carregar detalhes da atração");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Carregando detalhes da atração...</p>
      </div>
    );
  }

  if (error || !attraction) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p style={{ color: "red" }}>{error || "Atração não encontrada"}</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Voltar ao Resumo
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Botão Voltar */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: "500",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9f9f9";
            e.currentTarget.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <span style={{ fontSize: 18 }}>←</span>
          Voltar
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 20px 40px" }}>
        {/* Cabeçalho com Foto */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: 24,
          }}
        >
          {/* Foto da Atração */}
          {getImageUrl(attraction.photo) && (
            <div
              style={{
                width: "100%",
                height: 400,
                overflow: "hidden",
              }}
            >
              <img
                src={getImageUrl(attraction.photo)!}
                alt={attraction.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Informações do Cabeçalho */}
          <div style={{ padding: 32 }}>
            {/* Título e Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {attraction.name}
                </h1>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#e3f2fd",
                      color: "#1976d2",
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {attraction.type_display}
                  </span>
                  {attraction.visited && (
                    <span
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      ✓ Visitado
                    </span>
                  )}
                  {attraction.priority_order && (
                    <span
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#fff3e0",
                        color: "#f57c00",
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      ⭐ Prioridade {attraction.priority_order}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tempo Sugerido */}
            {attraction.suggested_duration && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "16px 20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 8,
                  marginTop: 20,
                }}
              >
                <span style={{ fontSize: 20 }}>⏱️</span>
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
                    Tempo sugerido
                  </div>
                  <div style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
                    {formatDuration(attraction.suggested_duration)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        {attraction.description && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 32,
              marginBottom: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px 0",
                fontSize: 22,
                fontWeight: "600",
                color: "#333",
              }}
            >
              Sobre
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: "#555",
                whiteSpace: "pre-wrap",
              }}
            >
              {attraction.description}
            </p>
          </div>
        )}

        {/* Curiosidade (Colapsável) */}
        {attraction.fun_fact && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => setIsFunFactExpanded(!isFunFactExpanded)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 32px",
                backgroundColor: "white",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                fontWeight: "600",
                color: "#333",
                textAlign: "left",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9f9f9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>💡</span>
                <span>Curiosidade</span>
              </div>
              <span
                style={{
                  fontSize: 24,
                  transform: isFunFactExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              >
                ⌄
              </span>
            </button>

            {/* Conteúdo Colapsável */}
            <div
              style={{
                maxHeight: isFunFactExpanded ? "1000px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease-in-out",
              }}
            >
              <div
                style={{
                  padding: "0 32px 32px 32px",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#555",
                  whiteSpace: "pre-wrap",
                }}
              >
                {attraction.fun_fact}
              </div>
            </div>
          </div>
        )}

        {/* Informação da Cidade */}
        <div
          style={{
            marginTop: 24,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: 14, color: "#666" }}>
            📍 Localizada em{" "}
            <span style={{ fontWeight: "600", color: "#333" }}>
              {attraction.city_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
