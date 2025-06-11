import React, { useState } from "react"; //UseState permite cambiar entre estados (Ratón no encima-Ratón encima).

export default function Categorias({ texto, onClick, className }) {
  const [Flotar, setFlotar] = useState(false);
  //onClick controla la función que se ejecutará cuando se haga click en el botón.
  //Se agrega className para permitir personalizar el estilo del componente desde el lugar donde se usa sin alterar el código base del componente.
  return (
    <button //${} (template literals) que permite hacer cambios dinámicos
      className={`
        drop-shadow-2xl font-lemon border-2 py-3 px-6 rounded-lg transition-all duration-300 ease-in-out 
        ${Flotar ? "transform translate-y-[-2px] hover:scale-105" : ""}
        ${className}
      `}
      onMouseEnter={() => setFlotar(true)} //permitir añadir clases extra cuando el componente se usa en otro archivo y no cambiar los estilos base.
      onMouseLeave={() => setFlotar(false)}
      onClick={onClick} //Ejecuta la función onClick que se le pase como prop. Lo permite que el botón realice acciones personalizadas cuando se usa en diferentes partes del código.
    >
      <span //Lo pongo aquí para darlse efecto de sombreado al texto porque si lo pongo arriba se aplica solo al botón.
        className={`${
          //Se usa span y no div porque span es un elemento en línea y solo ocupa ese espacio, si fuese div ocuparía toda la línea entera.
          Flotar
            ? "text-white text-shadow text-border transition-all duration-300 ease-in-out"
            : "text-shadow-light"
        }`}
      >
        {texto}
      </span>
    </button>
  );
}
