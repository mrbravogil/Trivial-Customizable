import React, { useContext, useState, useEffect } from 'react';
import { QuizSetupContext } from '../context/QuizSetupContext';
import { useJuegoStore } from "../hooks/useJuegoStore";
import { useTurnoStore } from '../hooks/useTurnoStore';
import TarjetaPregunta from './TarjetaPregunta';

export default function ModalPregunta({ visible, categoria, esCasillaDoble, casillaActual, onClose }) {
  // — 1. Suscripción a store con selectors individuales —
  const equipos = useTurnoStore((s) => s.equipos);
  const registrarRespuesta = useTurnoStore((s) => s.registrarRespuesta);
  const registrarRespuestaCustomizable = useTurnoStore((s) => s.registrarRespuestaCustomizable);
  const actualizarQuesitosEquipo = useTurnoStore((s) => s.actualizarQuesitosEquipo);
  const syncPuntos = useTurnoStore((s) => s.syncPuntos);
  const addPuntos = useTurnoStore((s) => s.addPuntos);
  const avanzarTurno = useTurnoStore((s) => s.avanzarTurno);

  // Para determinar si uso preguntas custom (subidas por archivo)
  const { selectedFile } = useContext(QuizSetupContext);
  const useCustom = Boolean(selectedFile);

  // — 2. Extraer funciones de useJuegoStore para quesitos y multiplicador grupal —
  const juegoStore = useJuegoStore.getState();
  const obtenerColorQuesito = juegoStore.obtenerColorQuesito;
  const registrarQuesito = juegoStore.registrarQuesito;
  const multiplicadorGrupalDisponible = juegoStore.multiplicadorDisponible;
  const multiplicadorGrupalValor = juegoStore.multiplicador;

  // — 3. Estado local para mostrar un mensaje breve de “Quesito obtenido” —
  const [mensajeQuesito, setMensajeQuesito] = useState(null);

  // Limpiar el mensaje cada vez que se abra o cierre el modal
  useEffect(() => {
    if (!visible) {
      setMensajeQuesito(null);
    }
  }, [visible]);

  if (!visible) return null;

  /**
   * Función auxiliar: Calcula el multiplicador exponencial según quesitosUnicos.
   * Nunca la usamos en el propio turno donde se obtiene el quesito: allí solo va x2.
   */
  const calcularMultiplicador = (quesitosUnicos) => {
    const fases = [1, 1.2, 1.4, 1.7, 2.1, 2.5, 3];
    const fase = Math.min(quesitosUnicos, 6);
    return fases[fase];
  };

  const onFinish = async (respuestasEquipos, pregunta) => {
    const puntuacionBase = Number(pregunta.puntuacion || 10);

    for (let idx = 0; idx < respuestasEquipos.length; idx++) {
      const resp = respuestasEquipos[idx];
      const eq = equipos[idx]; // trae: { id, puntos, quesitosVisitados, quesitosUnicos, … }
      const correcta = !!resp?.correcta;
      let puntos = 0;

      if (correcta) {
        // — Caso 1: Primera vez en casilla doble (quesito) —
        if (esCasillaDoble) {
          const visitasAct = eq.quesitosVisitados || [];
          const contadorAct = eq.quesitosUnicos || 0;

          // Si sigue sin haber visitado esta casilla:
          if (!visitasAct.includes(casillaActual)) {
            // 1) Solo damos x2, SIN multiplicador exponencial
            puntos = puntuacionBase * 2;

            // 2) Actualizamos el store local: añadimos esta casilla y aumentamos el contador
            const nuevosVisitas = [...visitasAct, casillaActual];
            const nuevosUnicos = contadorAct + 1;
            actualizarQuesitosEquipo(eq.id, nuevosVisitas, nuevosUnicos);

            // 3) Registramos “quesito” visual (color) si hace falta:
            const colorQuesito = obtenerColorQuesito?.(casillaActual);
            if (colorQuesito) {
              registrarQuesito?.(eq.id, colorQuesito);
              setMensajeQuesito(`¡${eq.nombre} ha obtenido un quesito ${colorQuesito}!`);
            }
          } else {
            // — Ya había visitado esta casilla antes —
            // Le damos solo la puntuación base (sin x2) y sí aplicamos exponencial
            const contadorActualizado = eq.quesitosUnicos || 0;
            const multiplicadorExpo = calcularMultiplicador(contadorActualizado);
            puntos = puntuacionBase * multiplicadorExpo;
          }
        } else {
          // — Caso 2: No es casilla doble — solo aplicamos exponencial según quesitosUnicos
          const contadorActualizado = eq.quesitosUnicos || 0;
          const multiplicadorExpo = calcularMultiplicador(contadorActualizado);
          puntos = puntuacionBase * multiplicadorExpo;
        }

        // — 4. Aplicar multiplicador grupal si está disponible —
        if (multiplicadorGrupalDisponible) {
          puntos *= multiplicadorGrupalValor;
        }
      }

      // — 5. Registrar la respuesta en el backend y sumar puntos —
      if (useCustom) {
        // Preguntas custom
        try {
          console.log("📤 Enviando respuesta CUSTOMIZABLE al backend", {
            customizableId: pregunta.id,
            esCorrecta: correcta,
          });
          await registrarRespuestaCustomizable(eq.id, {
            customizableId: pregunta.id,
            esCorrecta: correcta,
          });

          // Si acertó, sumamos puntos
          if (correcta && puntos > 0) {
            await syncPuntos(eq.id, puntos);
            addPuntos(eq.id, puntos);
          }
        } catch (error) {
          console.error('❌ Error registrando respuesta CUSTOMIZABLE:', error);
        }
      } else {
        // Preguntas normales
        if (
          pregunta?.id &&
          typeof resp?.idRespuestaSeleccionada !== 'undefined' &&
          typeof correcta !== 'undefined' &&
          typeof puntos !== 'undefined'
        ) {
          try {
            console.log("📤 Enviando respuesta al backend:", {
              preguntaId: pregunta.id,
              respuestaId: resp.idRespuestaSeleccionada,
              esCorrecta: correcta,
              puntosObtenidos: puntos,
            });
            await registrarRespuesta(eq.id, {
              preguntaId: pregunta.id,
              respuestaId: resp.idRespuestaSeleccionada,
              esCorrecta: correcta,
              puntosObtenidos: puntos,
            });
          } catch (error) {
            console.error('❌ Error registrando respuesta partida:', error);
          }
        } else {
          // Fallback: sumar puntos directamente
          if (correcta && puntos > 0) {
            try {
              await syncPuntos(eq.id, puntos);
              addPuntos(eq.id, puntos);
            } catch (error) {
              console.error('❌ Error al sumar puntos (fallback):', error);
            }
          }
        }
      }
    }

    // — 6. Consumir multiplicador grupal si se usó —
    if (multiplicadorGrupalDisponible && multiplicadorGrupalValor > 1) {
      juegoStore.usarMultiplicador();
    }

    // — 7. Avanzar turno y cerrar modal —
    avanzarTurno();
    onClose();
  };

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <TarjetaPregunta
        categoria={categoria}
        equipos={equipos}
        onFinish={onFinish}
        useCustom={useCustom}
      />
      <button
        onClick={() => {
          avanzarTurno();
          onClose();
        }}
        className="absolute top-5 right-5 bg-white border px-4 py-2 rounded"
      >
        ✖
      </button>
    </div>
  );
}
