import React from 'react';
import { useJuegoStore } from '../hooks/useJuegoStore';

const Ficha = () => {
  const fichaPos = useJuegoStore((state) => state.fichaPos);

  if (!fichaPos || (fichaPos.left === undefined && fichaPos.right === undefined)) {
    console.warn('⚠️ Posición inválida para ficha:', fichaPos);
    return null;
  }

  const styleFicha = {
    top: `${fichaPos.top}%`,
    ...(fichaPos.left !== undefined
      ? { left: `${fichaPos.left}%` }
      : { right: `${fichaPos.right}%` }),
    transform: 'translate(-50%, -50%)',
  };

  console.log('✅ Posición de ficha:', fichaPos, 'Estilo aplicado:', styleFicha);

  return (
    <div
      className="absolute z-30 w-[4%] h-[4%] rounded-full bg-gradient-to-br from-purple-500 to-purple-700 border-4 border-white shadow-lg shadow-black transition-all duration-500"
      style={styleFicha}
    />
  );
};

export default Ficha;
