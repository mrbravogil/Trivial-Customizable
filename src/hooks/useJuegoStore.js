import { create } from 'zustand';
import { casillas } from '../components/Posiciones/tableroData';
import { caminos as rutasCaminos } from '../components/Posiciones/rutasCaminos';

// Función para acceso circular en arrays
const circularGet = (arr, index) => {
  const len = arr.length;
  return arr[(index + len) % len];
};

// Casillas del círculo exterior
const casillasCirculoExterior = [
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
  43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
  55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
  67, 68, 69, 70, 71, 72
];

// Casillas de quesito (dobles)
const casillasDobles = [31, 38, 45, 52, 59, 66];

// Casillas de “volver a tirar”
export const casillasVolverTirar = [33, 36, 40, 43, 47, 50, 54, 57, 61, 64, 68, 71];

// Mapa de casilla → color del quesito
const mapaCasillasQuesitos = {
  31: 'rosa',
  38: 'azul',
  45: 'amarillo',
  52: 'marron',
  59: 'verde',
  66: 'naranja'
};

// Calcula multiplicador por aciertos grupales (opcional)
const calcularMultiplicador = (aciertos) => {
  if (aciertos >= 8) return 3;
  if (aciertos >= 6) return 2.5;
  if (aciertos >= 4) return 2;
  if (aciertos >= 2) return 1.5;
  return 1;
};

export const useJuegoStore = create((set, get) => ({
  equipos: [
    { nombre: 'Equipo 1', casilla: 0, camino: null },
    { nombre: 'Equipo 2', casilla: 0, camino: null },
  ],
  fichaIndex: 0,
  caminoActual: null,
  turnoActual: 0,
  valorDado: null,
  casillasActivas: [],
  fichaPos: casillas[0],
  esCasillaDoble: false,
  aciertosConsecutivos: 0,
  aciertosGrupales: 0,
  multiplicador: 1,
  multiplicadorDisponible: false,
  multiplicadorUsado: false,
  equiposQuesitos: {}, // { [equipoId]: [coloresDeQuesito] }

  setCaminoActual: (camino) => set({ caminoActual: camino }),
  setFichaIndex: (index) => set({ fichaIndex: index }),

  setValorDado: (valor) => {
    const { fichaIndex: rawFichaIndex, caminoActual } = get();
    const fichaIndex = Number(rawFichaIndex);
    let nuevasCasillas = [];

    if (fichaIndex === 0 && caminoActual === null) {
      nuevasCasillas = Object.values(rutasCaminos)
        .map((camino) => camino[Math.min(valor - 1, camino.length - 1)])
        .filter(Boolean);
    } else if (caminoActual) {
      const camino = rutasCaminos[caminoActual];
      const indexEnCamino = camino.indexOf(fichaIndex);

      if (indexEnCamino !== -1) {
        const pasosRestantes = camino.length - 1 - indexEnCamino;
        const pasosDentroCamino = Math.min(valor, pasosRestantes);
        const pasosEnCirculo = valor - pasosDentroCamino;

        if (pasosDentroCamino > 0 && pasosEnCirculo === 0) {
          nuevasCasillas.push(camino[indexEnCamino + pasosDentroCamino]);
        }

        if (pasosEnCirculo > 0) {
          const ultimaCasilla = camino[camino.length - 1];
          const indexEnCirculo = casillasCirculoExterior.findIndex((id) => Number(id) === Number(ultimaCasilla));
          if (indexEnCirculo !== -1) {
            const derecha = circularGet(casillasCirculoExterior, indexEnCirculo + pasosEnCirculo);
            const izquierda = circularGet(casillasCirculoExterior, indexEnCirculo - pasosEnCirculo);
            nuevasCasillas.push(derecha, izquierda);
          }
        }
      }
    } else {
      const indexEnCirculo = casillasCirculoExterior.findIndex((id) => Number(id) === Number(fichaIndex));
      if (indexEnCirculo !== -1) {
        const derecha = circularGet(casillasCirculoExterior, indexEnCirculo + valor);
        const izquierda = circularGet(casillasCirculoExterior, indexEnCirculo - valor);
        nuevasCasillas.push(derecha, izquierda);
      }
    }

    set({ valorDado: valor, casillasActivas: nuevasCasillas });
  },

  setCaminoInicial: (camino) => {
    const state = get();
    const ruta = rutasCaminos[camino];
    const destino = ruta[state.valorDado - 1];
    if (!destino) return;
    const nuevosEquipos = [...state.equipos];
    nuevosEquipos[state.turnoActual].camino = camino;
    set({
      equipos: nuevosEquipos,
      casillasActivas: [destino],
    });
  },

  moverFicha: (id) => {
    const { fichaIndex, caminoActual } = get();
    const posicion = casillas.find((c) => c.id === id);

    if (fichaIndex === 0 && caminoActual === null) {
      const nuevoCamino = Object.entries(rutasCaminos).find(([_, casillas]) =>
        casillas.includes(id)
      );
      if (nuevoCamino) {
        set({ caminoActual: nuevoCamino[0] });
      }
    }

    if (posicion) {
      const nuevaData = {
        fichaIndex: id,
        fichaPos: { top: posicion.top, left: posicion.left },
        casillasActivas: [],
        esCasillaDoble: casillasDobles.includes(id),
        esVolverTirar: casillasVolverTirar.includes(id)
      };

      if (casillasCirculoExterior.includes(id)) {
        nuevaData.caminoActual = null;
      }

      set(nuevaData);
    }
  },

  avanzarTurno: () => {
    set((state) => ({
      turnoActual: (state.turnoActual + 1) % state.equipos.length,
      valorDado: null,
    }));
  },

  incrementarAciertos: () => {
    const prevAciertos = get().aciertosConsecutivos;
    const aciertos = prevAciertos + 1;
    console.log('🎯 Incrementando aciertos:', { prevAciertos, nuevosAciertos: aciertos });
    set({ aciertosConsecutivos: aciertos });

    if (aciertos >= 8) {
      console.log('🌟 Desbloqueado multiplicador x3');
      set({ multiplicador: 3, multiplicadorDisponible: true });
    } else if (aciertos >= 4) {
      console.log('⭐ Desbloqueado multiplicador x2');
      set({ multiplicador: 2, multiplicadorDisponible: true });
    }
  },

  resetearAciertos: () => {
    console.log('🔄 Reseteando aciertos');
    set({ aciertosConsecutivos: 0 });
  },

  verificarAciertosGrupales: (respuestasEquipos) => {
    const todosAcertaron = respuestasEquipos.every((resp) => resp?.correcta);
    const { aciertosGrupales } = get();
    console.log('🎯 Verificando aciertos grupales:', {
      respuestas: respuestasEquipos,
      todosAcertaron,
      aciertosActuales: aciertosGrupales
    });

    if (todosAcertaron) {
      const nuevosAciertos = aciertosGrupales + 1;
      console.log('✨ Incrementando contador grupal:', nuevosAciertos);
      if (nuevosAciertos >= 8) {
        console.log('🔄 Reiniciando contador tras alcanzar 8 aciertos');
        set({ 
          aciertosGrupales: 0,
          multiplicador: 1,
          multiplicadorDisponible: false
        });
      } else {
        const nuevoMultiplicador = calcularMultiplicador(nuevosAciertos);
        console.log(`🌟 Nuevo multiplicador: x${nuevoMultiplicador}`);
        set({ 
          aciertosGrupales: nuevosAciertos,
          multiplicador: nuevoMultiplicador,
          multiplicadorDisponible: nuevoMultiplicador > 1
        });
      }
    } else {
      console.log('❌ No todos acertaron, reseteando contador');
      set({ 
        aciertosGrupales: 0,
        multiplicador: 1,
        multiplicadorDisponible: false
      });
    }
  },

  usarMultiplicador: () => {
    const { multiplicador, multiplicadorDisponible } = get();
    if (!multiplicadorDisponible) return 1;
    const valorMultiplicador = multiplicador;
    set({ 
      multiplicador: 1,
      multiplicadorDisponible: false
    });
    return valorMultiplicador;
  },

  registrarQuesito: (equipoId, color) => {
    set((state) => {
      const quesitosEquipo = state.equiposQuesitos[equipoId] || [];
      if (!quesitosEquipo.includes(color)) {
        return {
          equiposQuesitos: {
            ...state.equiposQuesitos,
            [equipoId]: [...quesitosEquipo, color]
          }
        };
      }
      return state;
    });
  },

  obtenerColorQuesito: (numeroCasilla) => {
    return mapaCasillasQuesitos[numeroCasilla];
  }
}));
