import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTurnoStore } from '../hooks/useTurnoStore';
import ninioAvatar from '../assets/img/ninio.png';

const MultiplierModal = ({ isOpen, onClose }) => {
  const equipos = useTurnoStore((s) => s.equipos);

  // Calcula el multiplicador basado en quesitos únicos
  const calcularMultiplicador = (quesitosUnicos) => {
    const fases = [1, 1.2, 1.4, 1.7, 2.1, 2.5, 3];
    const fase = Math.min(quesitosUnicos, 6); // máximo 6 quesitos
    return fases[fase];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay con blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 z-50"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Multiplicadores por Equipo
          </h2>

          <div className="space-y-4">
            {equipos.map((equipo) => {
              const multiplicador = calcularMultiplicador(equipo.quesitosUnicos || 0);
              
              return (
                <div 
                  key={equipo.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={equipo.avatarMini || ninioAvatar}
                      alt={equipo.nombre}
                      className="w-12 h-12 rounded-full border-2 border-orange-500"
                    />
                    <span className="font-semibold text-lg">{equipo.nombre}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      x{multiplicador.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({equipo.quesitosUnicos || 0}/6 quesitos)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Cerrar
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MultiplierModal;