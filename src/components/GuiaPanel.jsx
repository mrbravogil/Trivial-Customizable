import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePartidaStore } from "../hooks/usePartidaStore";
import useGuiaStore from "../hooks/useGuiaStore";
import ConfirmModal from "./ConfirmModal";

const GuiaPanel = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { guiaAbierta, toggleGuia } = useGuiaStore();
  const navigate = useNavigate();
  const { partidaId } = usePartidaStore();

  const handleTerminar = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmTerminar = () => {
    toggleGuia();
    setShowConfirmModal(false);
    navigate(`/padre-ranking?partidaId=${partidaId}`);
  };

  return (
    <>
      <AnimatePresence>
        {guiaAbierta && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-96 bg-white border-r border-orange-600 shadow-xl z-40 p-8 pt-40 overflow-y-auto"
          >
            {/* Título */}
            <h2 className="text-3xl font-bold text-naranja mb-8">
              Guía del Juego
            </h2>

            {/* Secciones */}
            <div className="space-y-8">
              {/* Objetivo */}
              <section>
                <h3 className="text-xl font-semibold text-naranja mb-3">
                  Objetivo
                </h3>
                <p className="text-gray-700">
                  Consigue la mayor cantidad de puntos posible respondiendo preguntas correctamente. 
                  Aprovecha las casillas especiales, los quesitos y los multiplicadores para llevar a tu equipo a la victoria.
                </p>
              </section>

              {/* Sistema de Puntos */}
              <section>
                <h3 className="text-xl font-semibold text-naranja mb-3">
                  Sistema de Puntos
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    <b>Preguntas personalizadas:</b> Los puntos los define el archivo que subas.
                  </li>
                  <li>
                    <b>Preguntas predefinidas:</b> Pueden valer entre 10 y 30 puntos según la dificultad.
                  </li>
                  <li>
                    <b>Casilla de quesito:</b> Si aciertas por primera vez en una casilla de quesito, ¡ganas el doble de puntos!
                  </li>
                  <li>
                    <b>Multiplicadores:</b> Cuantos más quesitos únicos consigas, mayor será tu multiplicador de puntos.
                  </li>
                </ul>
              </section>

              {/* Casillas Especiales */}
              <section>
                <h3 className="text-xl font-semibold text-naranja mb-3">
                  Casillas Especiales
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                    <p>
                      <b>Quesito:</b> Si aciertas en una casilla de quesito que tu equipo no había visitado, obtienes el doble de puntos y sumas un quesito único.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                    <p>
                      <b>Volver a tirar:</b> Si caes aquí, tu equipo puede lanzar el dado de nuevo.
                    </p>
                  </div>
                </div>
              </section>

              {/* Multiplicadores por Quesitos */}
              <section>
                <h3 className="text-xl font-semibold text-naranja mb-3">
                  Multiplicadores por Quesitos
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Cada vez que tu equipo consigue un quesito único, aumenta su multiplicador de puntos para las siguientes preguntas.
                  </li>
                  <li>
                    <b>Tabla de multiplicadores:</b>
                    <ul className="ml-4 list-disc">
                      <li>0 quesitos: x1</li>
                      <li>1 quesito: x1.2</li>
                      <li>2 quesitos: x1.4</li>
                      <li>3 quesitos: x1.7</li>
                      <li>4 quesitos: x2.1</li>
                      <li>5 quesitos: x2.5</li>
                      <li>6 quesitos: x3</li>
                    </ul>
                  </li>
                  <li>
                    El multiplicador se aplica automáticamente a cada acierto, ¡y se mantiene aunque falles!
                  </li>
                  <li>
                    Si vuelves a acertar en una casilla de quesito ya visitada, solo se aplica el multiplicador, no el x2.
                  </li>
                </ul>
              </section>

              {/* Otras funcionalidades */}
              <section>
                <h3 className="text-xl font-semibold text-naranja mb-3">
                  Otras funcionalidades del juego
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Puedes subir tus propias preguntas personalizadas en formato Excel  antes de empezar la partida.
                  </li>
                  <li>
                    Terminar el juego te llevara a el ranking final muestra la puntuación de todos los equipos y permite descargar los resultados en Excel.
                  </li>
                  <li>
                    El juego es por turnos: cada equipo tiene un turno donde podra elegir a donde moverse.
                  </li>
                  <li>
                    El tablero y las posiciones de los equipos se actualizan en tiempo real.
                  </li>
                </ul>
              </section>

              {/* Controles */}
              <section>
                <h3 className="text-xl font-semibold text-naranja mb-3">
                  Controles
                </h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/Dado.svg"
                      alt="Dado"
                      className="w-8 h-8"
                    />
                    <span>Lanzar dado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/Group.png"
                      alt="Multiplicador"
                      className="w-8 h-8"
                    />
                    <span>Ver multiplicadores de cada equipo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/Guia.png"
                      alt="Guía"
                      className="w-8 h-8"
                    />
                    <span>Abrir esta guía</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Botones de acción */}
            <div className="mt-8 space-y-4">
              <button
                onClick={toggleGuia}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow transition"
              >
                Cerrar Guía
              </button>
              <button
                onClick={handleTerminar}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow transition"
              >
                Terminar Juego
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTerminar}
        title="¿Terminar el juego?"
        message="¿Estás seguro de que quieres terminar el juego y ver el ranking final?"
      />
    </>
  );
};

export default GuiaPanel;

