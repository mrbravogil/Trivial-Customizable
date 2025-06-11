import React, { useContext } from 'react';
import ninioAvatar from '../../assets/img/ninio.png';
import { QuizSetupContext } from '../../context/QuizSetupContext';
import { categoryBg } from '../../utils/categoriaColors';

export default function CaraDelantera({
  pregunta,
  equipos,
  equipoActual,
  respuestasEquipos,
  onOpcionClick,
  onRecargar,
  onEnviar,
}) {
  const { selectedFile } = useContext(QuizSetupContext);

  const categoriasBase = ["Idiomas", "Música", "Matemáticas", "Biología", "Geografía", "Lengua"];
  const bgClass = categoryBg[pregunta.categoria] || 'bg-gray-800';
  const yaRespondido = respuestasEquipos[equipoActual] !== null;
  const todosRespondieron = respuestasEquipos.every(r => r !== null);
  const nombreEquipo = equipos[equipoActual]?.nombre || `Equipo ${equipoActual + 1}`;

  const esCategoriaBase = categoriasBase.includes(pregunta.categoria);
  const textoCategoria = esCategoriaBase
    ? pregunta.categoria
    : selectedFile
    ? `${selectedFile.name.split('.').slice(0, -1).join('.')}`
    : "Custom";

  return (
    <div className="absolute inset-0 backface-hidden">
      <div className={`${bgClass} w-full h-[19%] mt-7 flex items-center relative 2xl:gap-[30%]`}>
        <h1 className="text-white text-7xl pt-3 pl-16 font-secular 2xl:text-8xl 2xl:pl-24">
          {textoCategoria}  ({pregunta.puntuacion} puntos)
        </h1>
        <img
          src="/img/Logo_EducaTrivial.png"
          className="w-[15%] pt-6 absolute right-[15%] drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
          alt="Logo EducaTrivial"
        />
      </div>

      <div className="flex-1 w-full h-[75%] flex items-center justify-between font-lemon px-8">
        <div className="w-1/2 h-full flex flex-col items-center justify-center pl-2 ml-4">
          <div className="p-6 h-[90%] w-[90%] border-black border-2 rounded-2xl flex items-center justify-center text-center">
            <h1 className="font-bold text-4xl lg:text-5xl text-black px-4">
              {pregunta.pregunta}
            </h1>
          </div>
        </div>

        <div className="w-1/2 h-[87%] ml-10 flex flex-col justify-center gap-4">
          <div className="flex relative items-center">
            <p className="mb-2 text-2xl text-left font-bold 2xl:text-3xl">
              {nombreEquipo} 
            </p>
            <div className="flex gap-4 absolute right-[13%]">
              <button
                onClick={onRecargar}
                className="border-black border-2 rounded-lg p-1"
              >
                <img
                  src="/assets/img/refresh-arrow.png"
                  className="w-[26px]"
                  alt="Recargar"
                />
              </button>
              <button
                onClick={onEnviar}
                disabled={!todosRespondieron}
                className={`
                  border-black border-2 rounded-lg p-1
                  ${todosRespondieron
                    ? 'hover:bg-gray-200'
                    : 'opacity-50 cursor-not-allowed'}
                `}
              >
                <img
                  src="/assets/img/sendicon.png"
                  className="w-[26px]"
                  alt="Enviar"
                />
              </button>
            </div>
          </div>

          {pregunta.respuestas.map((r, i) => {
            const quienes = respuestasEquipos
              .map((resp, idx) => (resp?.texto === r.texto ? idx : null))
              .filter((idx) => idx !== null);

            return (
              <button
                key={i}
                onClick={() => !yaRespondido && onOpcionClick(r)}
                disabled={yaRespondido}
                className="
                  relative w-[87%] h-[40%] rounded-xl flex items-center gap-2 pt-3
                  border-black border-2 bg-white pl-4 text-black text-lg text-left
                  font-bold 2xl:text-3xl hover:bg-black hover:text-white transition-all
                "
              >
                <img
                  className="w-[24.46px] h-[28.45px] ml-1 2xl:ml-5"
                  src="/assets/img/icono-queso.png"
                  alt="Queso"
                />
                {r.texto}

                {quienes.length > 0 && (
                  <div className="absolute bottom-3 right-3 flex flex-row-reverse gap-3">
                    {quienes.map((idx) => (
                      <img
                        key={idx}
                        src={equipos[idx]?.avatarMini || ninioAvatar}
                        className="w-[10%] h-[10%] lg:w-10 lg:h-10 rounded-full border border-black"
                        alt={`Equipo ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
