import { motion } from 'framer-motion';

const QuesitoCentral = ({ color, position, activo }) => {
  // Mapa de colores y sus valores CSS
  const colorMap = {
    rosa: '#FF69B4',
    azul: '#4169E1',
    amarillo: '#FFD700',
    marron: '#8B4513',
    verde: '#32CD32',
    naranja: '#FFA500'
  };

  return (
    <motion.div
      className="absolute w-[15%] h-[15%]"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: 'translate(-50%, -50%)',
        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        backgroundColor: colorMap[color],
        opacity: activo ? 1 : 0.5
      }}
      animate={{
        scale: activo ? [1, 1.1, 1] : 1,
        filter: activo ? ['brightness(100%)', 'brightness(150%)', 'brightness(100%)'] : 'brightness(100%)'
      }}
      transition={{
        duration: 1.5,
        repeat: activo ? Infinity : 0,
        repeatType: "reverse"
      }}
    />
  );
};

export default QuesitoCentral;