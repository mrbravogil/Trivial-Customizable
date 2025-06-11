import React, { useState } from "react";
import Feature_Categorias from "./Feature_Categorias";

const Customizar = ({ setSelectedFile, onUpload, selectedFile, className }) => {
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState([]);

  const handleArchivoChange = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSelectedFile(archivo);
    setMensaje("Subiendo archivo...");
    setErrores([]);

    try {
      const res = await onUpload(archivo);
      // si viene como Axios: res.data.mensaje, si viene como fetch/json: res.mensaje
      const serverMsg = res?.data?.mensaje ?? res?.mensaje ?? "Archivo subido correctamente";
      setMensaje(`✅ ${serverMsg}`);
    } catch (err) {
      console.error(err);
      const data = err.response?.data || {};
      // Mensaje principal de error
      const errorMsg = data.error || err.message || "Error desconocido";
      // Detalles de filas inválidas
      const detalles = data.detalles || [];
      // Formatear mensaje con número de filas inválidas si las hay
      if (detalles.length > 0) {
        setMensaje(`❌ ${errorMsg}: ${detalles.length} filas inválidas`);
        setErrores(detalles);
      } else {
        setMensaje(`❌ ${errorMsg}`);
      }
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Feature_Categorias
        texto={
          <span className="w-[300px] sm:w-[400px] h-[80px] sm:h-[90px] text-2xl sm:text-3xl xl:w-[500px] xl:h-[100px] xl:text-4xl 2xl:w-[700px] 2xl:h-[130px] 2xl:text-5xl">
            {selectedFile ? selectedFile.name : "Customizar"}
          </span>
        }
        onClick={() => document.getElementById("archivo").click()}
        className={className}
      />
      <input
        id="archivo"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleArchivoChange}
        className="hidden"
      />
      {mensaje && (
        <p className={`text-black ${mensaje.startsWith('❌') ? 'text-red-600' : 'text-green-600'}text-base 2xl:text-3xl`}>
          {mensaje}
        </p>
      )}
      {errores.length > 0 && (
        <ul className="text-red-400 text-sm text-left mt-2 w-full max-w-[500px] break-words">
          {errores.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Customizar;
