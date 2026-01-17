import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CitiesPage from "./pages/CitiesPage";
import CitySummaryPage from "./pages/CitySummaryPage";
import AttractionDetailPage from "./pages/AttractionDetailPage";
import AttractionsPage from "./pages/AttractionsPage";
import TipsPage from "./pages/TipsPage";
import LoginPage from "./pages/LoginPage";
import { PrivateRoute } from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <nav style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <Link to="/">Resumo</Link>
          <Link to="/cities">Cidades</Link>
          <Link to="/attractions">Atrações</Link>
          <Link to="/tips">Dicas</Link>
          <Link to="/login">Login</Link>
        </nav>

        {/* TODO: Funcionalidade de colapsar a seçao das atraçoes mantenho apenas o cartao da cidade */}
        {/* TODO: Adicionar as seçoes de dicas nas paginas de detalhes */}

        <Routes>
          {/* Página pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <CitySummaryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/cities"
            element={
              <PrivateRoute>
                <CitiesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/attractions/:id"
            element={
              <PrivateRoute>
                <AttractionDetailPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/attractions"
            element={
              <PrivateRoute>
                <AttractionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/tips"
            element={
              <PrivateRoute>
                <TipsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
