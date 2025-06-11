import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HamburgerIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
  const Header = ({ className = "" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCerrarSesion = async () => {
    setMenuOpen(false); // Cierra el menú inmediatamente
  
    try {
      await fetch("http://localhost:3000/api/reset/todo", { method: "DELETE" });
      console.log("✅ Base de datos reseteada");
    } catch (error) {
      console.error("❌ Error al resetear la base de datos:", error);
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className={`h-32 fixed top-0 left-0 right-0 z-50 w-full bg-[url('/assets/Fondo.svg')] shadow-lg bg-cover bg-center ${className}`}>
      <div className="container mx-auto h-full px-4 py-3 flex items-center justify-center">
        {/* Título */}
        <div className="text-center relative">
          <h1 className="text-white text-7xl font-balmoralplain tracking-wide mb-3">
            EducaTrivial
          </h1>
        </div>

        {/* Botón hamburguesa + menú desplegable */}
        <div className="absolute right-4">
          <button
            className="text-white hover:text-gray-300 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <HamburgerIcon />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg px-2 py-2 z-50 text-center font-itim text-lg"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={handleCerrarSesion}
                className="w-full py-2 text-black hover:bg-gray-200 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
