import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import AppRoutes from "./routes/index";

function App() {
  const [preguntas, setPreguntas] = useState([]);
  const [error, setError] = useState(null);

  // Función para manejar la subida de archivos (CSV/XLSX)
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      console.log("📤 Intentando subir archivo...");
      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Archivo subido exitosamente:", response.data);
      setPreguntas(response.data.preguntas);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("❌ Error al subir archivo:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Error al procesar el archivo";
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <Router>
      <AppRoutes
        onUpload={handleUpload}
        preguntas={preguntas}
        error={error}
      />
    </Router>
  );
}

export default App;
