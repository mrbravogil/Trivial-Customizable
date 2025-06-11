import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas de autenticación y selección/subida de preguntas
import Login from "../pages/Login";
import VistaCategorias from "../pages/VistaCategorias";

// Páginas de descarga y ranking (controller-ranking)
import ExcelDescarga from "../pages/ExcelDescarga";
import VistaRanking from "../pages/VistaRanking";   // si la usas
import PadreRanking from "../components/PadreRanking";

// Nuevas vistas de la rama Back-end
import Equipos from "../pages/Equipos";
import Tablero from "../pages/Tablero";

export default function AppRoutes({ onUpload, preguntas, error }) {
  return (
    <Routes>
      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Autenticación */}
      <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />

      {/* Subida / selección de categorías */}
      <Route
        path="/categorias"
        element={
          <VistaCategorias
            onUpload={onUpload}
            preguntas={preguntas}
            error={error}
          />
        }
      />

      {/* Descarga de Excel */}
      <Route path="/excel-descarga" element={<ExcelDescarga />} />

      {/* Ranking histórico/controller-ranking */}
      <Route path="/vista-ranking" element={<VistaRanking />} />
      {/* Alternativa con PadreRanking */}
      <Route path="/padre-ranking" element={<PadreRanking />} />

      {/* Rutas rama Back-end */}
      <Route path="/equipos" element={<Equipos />} />
      <Route path="/tablero" element={<Tablero />} />

      {/* Catch-all: redirige a /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
