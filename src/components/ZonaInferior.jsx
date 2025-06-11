import React, { useState } from 'react';
import DadoModal from './DadoModal';
import { useJuegoStore } from '../hooks/useJuegoStore';
import useGuiaStore from '../hooks/useGuiaStore';
import { useTurnoStore } from '../hooks/useTurnoStore';
import MultiplierModal from './MultiplierModal'; // <— Importamos el modal

const carasDado = [
  '/assets/Cara1.svg',
  '/assets/Cara2.svg',
  '/assets/Cara3.svg',
  '/assets/Cara4.svg',
  '/assets/Cara5.svg',
  '/assets/Cara6.svg',
];

const BotonSimple = ({ icono, onClick, extraClass = '', children }) => (
  <button
    onClick={onClick}
    className={`
      w-10 h-10            /* móvil */
      sm:w-14 sm:h-14      /* ≥640px */
      md:w-16 md:h-16      /* ≥768px */
      lg:w-20 lg:h-20      /* ≥1024px */
      xl:w-28 xl:h-28      /* ≥1280px */
      relative hover:scale-105 transition-transform 
      ${extraClass}
    `}
  >
    <img src={icono} alt="icono" className="w-full h-full" />
    {children}
  </button>
);

const ZonaInferior = ({ onDadoResultado }) => {
  const [resultado, setResultado] = useState(null);
  const [showMultiplierModal, setShowMultiplierModal] = useState(false);

  // Datos de multiplicador grupal (se mantienen, aunque no los usemos para abrir el modal de quesitos)
  const multiplicador = useJuegoStore((s) => s.multiplicador);
  const multiplicadorDisponible = useJuegoStore((s) => s.multiplicadorDisponible);
  const aciertosGrupales = useJuegoStore((s) => s.aciertosGrupales);
  const usarMultiplicador = useJuegoStore((s) => s.usarMultiplicador);

  // Datos de equipos para recargar después de aplicar multiplicador grupal, si fuera necesario
  const equipos = useTurnoStore((s) => s.equipos);
  const turnoActual = useTurnoStore((s) => s.turnoActual);
  const setEquipos = useTurnoStore((s) => s.setEquipos);

  // Lógica del botón de multiplicador GRUPAL (sigue intacta por si se necesita)
  const handleMultiplicadorGrupal = () => {
    if (!multiplicadorDisponible) return;
    const mult = usarMultiplicador();
    const nuevos = equipos.map((eq, idx) =>
      idx === turnoActual ? { ...eq, puntos: eq.puntos * mult } : eq
    );
    setEquipos(nuevos);
  };

  const toggleGuia = useGuiaStore((s) => s.toggleGuia);

  const manejarResultadoDado = (numero) => {
    setResultado(numero);
    onDadoResultado(numero);
  };

  return (
    <>
      {/* -- Vista Principal de la zona inferior -- */}
      <div
        className={`
          border-b-4 border-x-4 border-double border-orange-600 
          relative w-full 
          min-h-[6rem]      /* móvil */
          sm:min-h-[8rem]   /* ≥640px */
          md:min-h-[10rem]  /* ≥768px */
          lg:min-h-[12rem]  /* ≥1024px */
          xl:min-h-[11rem]  /* ≥1280px - reducido para 1920x1080 */
          2xl:min-h-[14rem] /* ≥1536px */
          h-fit
        `}
      >
        <div
          className={`
            absolute bottom-0 left-0 w-full
            h-20           /* móvil */
            sm:h-24        /* ≥640px */
            md:h-28        /* ≥768px */
            lg:h-32        /* ≥1024px */
            xl:h-36        /* ≥1280px */
            bg-purple-700 rounded-t-[60%] z-0
            pointer-events-none
          `}
        ></div>

        <div
          className={`
            relative w-full flex flex-col items-center justify-end z-10
            -mt-6       
            sm:-mt-8    
            md:-mt-10   
            lg:-mt-12   
            xl:-mt-2   
          `}
        >
          <div
            className={`
              flex justify-center items-end
              gap-2       /* móvil */
              sm:gap-4    /* ≥640px */
              md:gap-6    /* ≥768px */
              lg:gap-8    /* ≥1024px */
              xl:gap-10   /* ≥1280px */
            `}
          >
            {/* Botón de GUÍA */}
            <BotonSimple
              icono={'/assets/Guia.png'}
              onClick={toggleGuia}
              extraClass={`
                top-4      /* móvil */
                sm:top-6   /* ≥640px */
                md:top-8   /* ≥768px */
                lg:top-10  /* ≥1024px */
                xl:top-6   /* ≥1280px */
              `}
            />

            {/* Botón de DADO */}
            <DadoModal onResultado={manejarResultadoDado}>
              <img
                src={'/assets/Dado.svg'}
                alt="Tirar dado"
                className={`
                  w-12 h-12       /* móvil */
                  sm:w-16 sm:h-16 /* ≥640px */
                  md:w-20 md:h-20 /* ≥768px */
                  lg:w-24 lg:h-24 /* ≥1024px */
                  xl:w-32 xl:h-32 /* ≥1280px */
                  hover:scale-105 transition-transform
                `}
              />
            </DadoModal>

            {/* Botón para mostrar el Modal de multiplicadores (QUESITOS) */}
            <BotonSimple
              icono={'/assets/Group.png'}
              onClick={() => setShowMultiplierModal(true)}
              extraClass={`
                top-4      /* móvil */
                sm:top-6   /* ≥640px */
                md:top-8   /* ≥768px */
                lg:top-10  /* ≥1024px */
                xl:top-6   /* ≥1280px */
              `}
            >
              {/* Indicador visual del contador de aciertos grupales (mantener, opcional) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`
                    text-sm      /* móvil */
                    sm:text-base /* ≥640px */
                    md:text-lg   /* ≥768px */
                    lg:text-xl   /* ≥1024px */
                    xl:text-2xl  /* ≥1280px */
                    font-bold text-yellow-400 drop-shadow-lg
                    translate-y-8    /* móvil */
                    sm:translate-y-10 /* ≥640px */
                    md:translate-y-12 /* ≥768px */
                    lg:translate-y-14 /* ≥1024px */
                    xl:translate-y-8 /* ≥1280px */
                  `}
                >
                </span>
                <span
                  className={`
                    text-xs      /* móvil */
                    sm:text-sm   /* ≥640px */
                    md:text-base /* ≥768px */
                    lg:text-lg   /* ≥1024px */
                    xl:text-xl   /* ≥1280px */
                    text-white drop-shadow-lg
                    translate-y-6    /* móvil */
                    sm:translate-y-8 /* ≥640px */
                    md:translate-y-10 /* ≥768px */
                    lg:translate-y-12 /* ≥1024px */
                    xl:translate-y-14 /* ≥1280px */
                  `}
                >
                </span>
              </div>
            </BotonSimple>
          </div>

          {/* Vista de la cara del dado al mostrarse un resultado */}
          {resultado !== null && (
            <div
              className={`
                mt-2      /* móvil - aumentado */
                sm:mt-3   /* ≥640px */
                md:mt-4   /* ≥768px */
                lg:mt-5   /* ≥1024px */
                xl:mt-6   /* ≥1280px */
                flex justify-center items-center
                pb-2      /* padding bottom para separarlo del borde */
                sm:pb-3
                md:pb-4
                lg:pb-5
                xl:pb-6
              `}
            >
              <img
                src={carasDado[resultado - 1]}
                alt={`Cara ${resultado}`}
                className={`
                  w-6 h-6
                  sm:w-7 sm:h-7     /* ≥640px */
                  md:w-8 md:h-8     /* ≥768px */
                  lg:w-10 lg:h-10   /* ≥1024px */
                  xl:w-14 xl:h-14   /* ≥1280px - aumentado */
                  drop-shadow-lg   /* sombra para mejor visibilidad */
                  transition-all duration-300
                  hover:scale-110  /* efecto hover */
                `}
              />
            </div>
          )}
        </div>
      </div>

      {/* -- Modal de MULTIPLICADORES (QUESITOS) -- */}
      <MultiplierModal
        isOpen={showMultiplierModal}
        onClose={() => setShowMultiplierModal(false)}
      />
    </>
  );
};

export default ZonaInferior;