import React, { useEffect, useRef, useState } from 'react';
import CaraDelantera from './CaraDelantera';
import CaraTrasera from './CaraTrasera';

export default function TarjetaPregunta({ categoria, equipos, onFinish, useCustom = false }) {
  const numEquipos = equipos.length;
  const audioRef = useRef(new Audio());

  const [pregunta, setPregunta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [turnLocal, setTurnLocal] = useState(0);
  const [respuestasEquipos, setRespuestasEquipos] = useState(Array(numEquipos).fill(null));
  const [respuestasCompletadas, setRespuestasCompletadas] = useState(false);
  const [show, setShow] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    setLoading(true);
    const url = useCustom
      ? 'http://localhost:3000/api/upload/test'
      : `http://localhost:3000/api/preguntas/${encodeURIComponent(categoria)}`;

    console.log('Cargando preguntas desde', url);

    fetch(url)
      .then(res => res.ok ? res.json() : Promise.reject('Error al cargar preguntas'))
      .then(data => {
        const rnd = data[Math.floor(Math.random() * data.length)];

        if (useCustom) {
          setPregunta({
            id: rnd.id,
            categoria: 'Custom',
            pregunta: rnd.pregunta,
            puntuacion: rnd.puntuacion ?? 10,
            respuestas: [
              { id: `${rnd.id}-1`, texto: rnd.opcion1, correcta: rnd.respuesta_correcta === rnd.opcion1, explicacion: rnd.explicacion },
              { id: `${rnd.id}-2`, texto: rnd.opcion2, correcta: rnd.respuesta_correcta === rnd.opcion2, explicacion: rnd.explicacion },
              { id: `${rnd.id}-3`, texto: rnd.opcion3, correcta: rnd.respuesta_correcta === rnd.opcion3, explicacion: rnd.explicacion },
              { id: `${rnd.id}-4`, texto: rnd.opcion4, correcta: rnd.respuesta_correcta === rnd.opcion4, explicacion: rnd.explicacion },
            ]
          });
        } else {
          setPregunta({
            id: rnd.id,
            categoria: rnd.categoria?.nombre,
            pregunta: rnd.texto,
            puntuacion: rnd.puntuacion ?? 10,
            respuestas: rnd.respuestas.map(r => ({
              id: r.id,
              texto: r.texto,
              correcta: r.esCorrecta,
              explicacion: r.explicacion
            }))
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoria, round, useCustom]);

  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, [round]);

  const reproducirAudioAleatorio = (respuestas) => {
    const aciertos = respuestas.filter(r => r?.correcta).length;
    const total = respuestas.length;
    // Audio por defecto para cuando hay pocos aciertos
    let audioPath = '/assets/audio/07 Gran esfuerzo de todos los equipos, algunos..._FEMENINO.mp3';

    if (total === 2) {
      audioPath = aciertos === 2 
        ? '/assets/audio/03 Impresionante lo habeis clavado_FEMENINO.mp3'
        : aciertos === 1 
        ? '/assets/audio/04 Buen intento a veces intentarlo es lo que cuenta_FEMENINO.mp3' 
        : audioPath;
    } else if (total === 3) {
      audioPath = aciertos === 3 
        ? '/assets/audio/03 Impresionante lo habeis clavado_FEMENINO.mp3'
        : aciertos === 2 
        ? '/assets/audio/08 Genial la mayoria habeis acertado la respuesta_FEMENINO.mp3'
        : aciertos === 1 
        ? '/assets/audio/04 Buen intento a veces intentarlo es lo que cuenta_FEMENINO.mp3' 
        : audioPath;
    } else if (total === 4) {
      audioPath = aciertos === 4 
        ? '/assets/audio/03 Impresionante lo habeis clavado_FEMENINO.mp3'
        : aciertos === 3 
        ? '/assets/audio/08 Genial la mayoria habeis acertado la respuesta_FEMENINO.mp3'
        : aciertos === 2 
        ? '/assets/audio/04 Buen intento a veces intentarlo es lo que cuenta_FEMENINO.mp3'
        : aciertos === 1 
        ? '/assets/audio/05 No es correcto pero os felicito por el intento_FEMENINO.mp3' 
        : audioPath;
    } else if (total >= 5) {
      const ratio = aciertos / total;
      audioPath = ratio === 1 
        ? '/assets/audio/03 Impresionante lo habeis clavado_FEMENINO.mp3'
        : ratio >= 0.75 
        ? '/assets/audio/08 Genial la mayoria habeis acertado la respuesta_FEMENINO.mp3'
        : ratio >= 0.5 
        ? '/assets/audio/04 Buen intento a veces intentarlo es lo que cuenta_FEMENINO.mp3'
        : ratio >= 0.1 
        ? '/assets/audio/06 buen intento pero no es la respuesta correcta_FEMENINO.mp3' 
        : audioPath;
    }

    const audio = new Audio(audioPath);
    audio.addEventListener('loadeddata', () => audio.play().catch(console.error));
    audio.addEventListener('error', (e) => console.error('❌ Error cargando audio:', e));
    audioRef.current = audio;
  };

  const handleOpcionClick = (r) => {
    setRespuestasEquipos(prev => {
      const cop = [...prev];
      cop[turnLocal] = {
        idRespuestaSeleccionada: r.id,
        texto: r.texto,
        correcta: r.correcta,
        explicacion: r.explicacion
      };
      return cop;
    });

    if (turnLocal < numEquipos - 1) {
      setTurnLocal(turnLocal + 1);
    }
  };

  const handleRecargar = () => {
    setRespuestasEquipos(Array(numEquipos).fill(null));
    setTurnLocal(0);
    setRespuestasCompletadas(false);
  };

  const handleEnviar = () => {
    if (respuestasEquipos.every(r => r !== null)) {
      setRespuestasCompletadas(true);
      reproducirAudioAleatorio(respuestasEquipos);
    }
  };

  const siguienteRonda = () => {
    onFinish(respuestasEquipos, pregunta);
    setRespuestasEquipos(Array(numEquipos).fill(null));
    setTurnLocal(0);
    setRespuestasCompletadas(false);
    setRound(r => r + 1);
  };

  if (loading) return <p className="text-center mt-10 text-xl">Cargando pregunta…</p>;
  if (!pregunta) return <p className="text-center mt-10 text-xl">No hay preguntas.</p>;

  return (
    <div className="h-full w-full flex items-center justify-center perspective">
      <div className="h-[70%] w-full flex items-center justify-center">
        <section className={`
          relative w-[65%] 2xl:w-[70%] h-full rounded-lg bg-white
          border-black border-[4px] transform transition-transform
          duration-1000 ease-out transform-style-preserve-3d
          ${show ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          ${respuestasCompletadas ? 'rotate-y-180' : ''}
        `}>
          <CaraDelantera
            pregunta={pregunta}
            equipoActual={turnLocal}
            equipos={equipos}
            respuestasEquipos={respuestasEquipos}
            onOpcionClick={handleOpcionClick}
            onRecargar={handleRecargar}
            onEnviar={handleEnviar}
          />
          <CaraTrasera
            pregunta={pregunta}
            respuestasEquipos={respuestasEquipos}
            siguienteRonda={siguienteRonda}
          />
        </section>
      </div>
    </div>
  );
}