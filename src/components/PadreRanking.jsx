import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import VistaRanking from '../pages/VistaRanking';

export const PadreRanking = () => {
  const [equipo, setEquipo] = useState([]);
  const location = useLocation();

  // Extrae partidaId de la query string
  const params = new URLSearchParams(location.search);
  const partidaId = params.get("partidaId");

  useEffect(() => {
    if (!partidaId) return;
    fetch(`http://localhost:3000/api/ranking/grupos?partidaId=${partidaId}`)
        .then((res) => res.json())
        .then((data) => {
            console.log('Datos recibidos:', data); // Para debug
            const equiposFormateados = data.map(g => ({
                nombre: g.nombre,
                puntos: g.puntos,
                foto: g.avatarMini 
                    ? (g.avatarMini.startsWith('/uploads') 
                        ? `http://localhost:3000${g.avatarMini}` 
                        : g.avatarMini)
                    : null
            }));
            console.log('Equipos formateados:', equiposFormateados); // Para debug
            setEquipo(equiposFormateados);
        })
        .catch((error) => {
            console.error("Error al obtener datos del servidor:", error);
        });
}, [partidaId]);

  return <VistaRanking equipo={equipo} />;
};

export default PadreRanking;