// src/components/TarjetaPregunta/CaraTrasera.jsx
import React, { useContext } from 'react';
import ninioAvatar from '../../assets/img/ninio.png';
import { QuizSetupContext } from '../../context/QuizSetupContext';
import { useTurnoStore } from '../../hooks/useTurnoStore';
import { categoryBg } from '../../utils/categoriaColors';

export default function CaraTrasera({
  pregunta,
  respuestasEquipos,
  siguienteRonda,
}) {

  const { selectedFile } = useContext(QuizSetupContext);

  const categoriasBase = ["Idiomas", "Música", "Matemáticas", "Biología", "Geografía", "Lengua"];
  const bgClass = categoryBg[pregunta.categoria] || 'bg-gray-800';
  const equipos = useTurnoStore((s) => s.equipos);

  // Determinar si mostrar categoría normal o nombre de archivo
  const esCategoriaBase = categoriasBase.includes(pregunta.categoria);
  const textoCategoria = esCategoriaBase
  ? pregunta.categoria
  : selectedFile
    ? `${selectedFile.name.split('.').slice(0, -1).join('.')}`
    : "Custom";

  return (
    <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center">
      {/* Header */}
      <div className={`${bgClass} w-full h-[19%] mt-7 flex items-center relative 2xl:gap-[30%]`}>
        <h1 className="text-white text-7xl pt-3 pl-16 font-secular 2xl:text-8xl 2xl:pl-24">
          {textoCategoria} ({pregunta.puntuacion} puntos)
        </h1>
        <img
          src="\img\Logo_EducaTrivial.png"
          className="z-10 w-[15%] pt-6 absolute right-[15%] drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
          alt=""
        />
      </div>

      {/* Resultados */}
      <div className="flex-1 w-full flex flex-col items-center justify-center font-lemon p-6 gap-4">
        {pregunta.respuestas.map((r, i) => {
          const fueSeleccionada = respuestasEquipos.some(
            (resp) => resp?.texto === r.texto
          );
          const esCorrecta = r.correcta;
          const quienes = respuestasEquipos
            .map((resp, idx) => (resp?.texto === r.texto ? idx + 1 : null))
            .filter(Boolean);

          let borde = 'border-gray-900 border';
          if (esCorrecta) borde = 'border-green-600 border-2';
          else if (fueSeleccionada) borde = 'border-red-600 border-2';

          return (
            <div
              key={i}
              className={`
                relative w-[75%] h-auto rounded-xl flex items-start gap-2
                bg-white ${borde} pl-4 2xl:p-6
                text-black text-xl font-bold lg:text-4xl transition-all
              `}
            >
              <img
                className="w-[24px] h-[28px] 2xl:w-[34px] 2xl:h-[37px] 2xl:ml-5"
                src="/assets/img/icono-queso.png"
                alt=""
              />
              <div className="flex-1 flex flex-col gap-2 relative">
                <div className="flex gap-4">
                  <span className="whitespace-nowrap">{r.texto}</span>
                  <div className="flex gap-3">
                    {quienes.map((num) => (
                      <img
                        key={num}
                        src={equipos[num - 1]?.avatarMini || ninioAvatar}
                        className="w-[10%] h-[10%] lg:w-10 lg:h-10 rounded-full border border-black"
                        alt={`Equipo ${num}`}
                      />
                    ))}
                  </div>
                </div>
                {esCorrecta && r.explicacion && (
                  <p className="text-md font-light lg:text-2xl text-black text-left font-secular leading-relaxed break-words">
                    {r.explicacion}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={siguienteRonda}
          className="w-72 rounded-md mt-2 p-2 border-2 border-gray-900 text-black text-xl lg:w-96 lg:text-3xl 2xl:p-5 hover:bg-black hover:text-white transition"
        >
          SIGUIENTE RONDA
        </button>
      </div>
    </div>
  );
}
