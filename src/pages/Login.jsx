import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Audio “Por favor, inicie sesión…”
  const [audioHabilitado, setAudioHabilitado] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/audio/01 Por favor inicie sesion_FEMENINO.mp3');

    const handleFirstClick = () => {
      setAudioHabilitado(true);
    };

    document.addEventListener('click', handleFirstClick);
    return () => {
      document.removeEventListener('click', handleFirstClick);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioHabilitado) return;
    const playAudio = () => {
      audioRef.current.play().catch(() => {});
    };
    playAudio();
    intervalRef.current = setInterval(playAudio, 15000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [audioHabilitado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usuario || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password })
      });
      const data = await res.json();

      if (res.ok) {
        // guarda el token si lo necesitas:
        localStorage.setItem('token', data.token);
        onLoginSuccess?.();
        navigate('/categorias');
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center py-8" // Añadido py-8 y flex-col
      style={{ backgroundImage: `url(/assets/Fondo.svg)` }}
    >
      <Header />

      <div
        className="relative bg-no-repeat bg-cover bg-center p-20 rounded shadow-lg w-full max-w-5xl min-h-[800px] flex items-center justify-center my-8" 
        style={{ backgroundImage: `url(/assets/Pizarra-login.svg)` }}
      >
        <img
          src="/assets/Profesor.svg"
          alt="Profesor"
          className="hidden md:block absolute left-40 w-64 h-auto" // Changed from left-48 to left-32
        />

        <form
          className="text-white font-secular z-10"
          onSubmit={handleSubmit}
        >
          <div className="w-64 space-y-8 text-base"> {/* Aumentado w-64 y space-y-8 */}
            <img 
              src="/img/Logo_educacion.png" 
              alt="Logo Trivial" 
              className="mx-auto w-40 h-auto mb-8" // Aumentado w-40 y mb-8
            />

            <div className="flex flex-col">
              <label htmlFor="usuario" className="mb-2 text-black font-itim text-lg"> {/* Aumentado texto y margen */}
                Usuario:
              </label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-700 rounded-xl text-black font-lemon text-lg" // Aumentado padding y borde
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 text-black font-itim text-lg"> {/* Aumentado texto y margen */}
                Contraseña:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-700 rounded-xl text-black font-lemon text-lg" // Aumentado padding y borde
              />
            </div>

            <button
              type="submit"
              className="w-32 px-4 py-2 text-lg bg-[#446CD1] text-white rounded-xl hover:bg-[#365bb0] mx-auto block font-itim" // Aumentado tamaño y padding
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};