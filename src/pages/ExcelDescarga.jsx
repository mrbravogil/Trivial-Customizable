//componente para subir excel y convertirlo a json
//conexión con serverprueba.js en carpeta backend fuera de prisma

import React, { useState } from "react"; //exporto función usada para guardar datos
import * as XLSX from "xlsx"; //biblioteca para poder leer excel

function ExcelDescarga() { //COMPONENTE
  const [datos, setDatos] = useState([]); //variable de estado, de momento vacía para poder almacenar los datos

  const manejarArchivo = (event) => { //FUNCIÓN -se activa cuando se selecciona el archivo
    const archivo = event.target.files[0]; //primer archivo seleccionado

    const lector = new FileReader(); //lee el contenido
    lector.onload = (e) => {
      const data = new Uint8Array(e.target.result); //se transforma a un formato que entiende la librería XLSX
      const workbook = XLSX.read(data, { type: "array" }); //lee el archivo
      const hoja = workbook.Sheets[workbook.SheetNames[0]]; //escoge la primera hoja
      const json = XLSX.utils.sheet_to_json(hoja); 
      setDatos(json); //lo transforma en JSON

      console.log("✅ Excel leído como JSON:", json);

      // Envia solicitud al backend para que los guarde en MySQL
      fetch("http://localhost:3000/api/subir-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json), // envío del JSON como POST
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("✅ Respuesta del backend:", res);
          alert("Los datos fueron guardados correctamente en la base de datos.");
        })
        .catch((err) => {
          console.error("❌ Error al enviar datos al backend:", err);
          alert("Hubo un error al guardar los datos en la base de datos.");
        });
    };

    lector.readAsArrayBuffer(archivo); // Leemos el archivo como ArrayBuffer
  };

  return ( //lo que se muestra en pantalla
    <div>
      <h2>Subir y Leer Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={manejarArchivo} />
      <pre>{JSON.stringify(datos, null, 2)}</pre>
    </div>
  );
}

export default ExcelDescarga;
