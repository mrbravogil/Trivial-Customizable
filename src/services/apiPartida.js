/* ---- Partidas ---- */
export const crearPartida = async () => {
  const res = await fetch("http://localhost:3000/api/partidas", {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ codigo: generarCodigo() }), // estado opcional
  });
  if (!res.ok) throw new Error("No se pudo crear la partida");
  return res.json(); // { id, codigo, estado }
};

/* ---- Equipos ---- */
export const crearEquipos = async (equipos, partidaId) => {
  const res = await fetch("http://localhost:3000/api/equipos", {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ equipos, partidaId }),
  });
  if (!res.ok) throw new Error("No se pudieron crear equipos");
  return res.json(); // array de equipos creados
};