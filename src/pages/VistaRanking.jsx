import React from "react";
import Ranking from "../components/Ranking";
import Header from "../components/Header";

const VistaRanking = ({ equipo }) => {


    //accedo a los elementos de equipo del archivo PadreRanking.jsx
    //recibe propiedades de padreRanking
    // Validamos que `equipo` es un array antes de hacer .map()
    if (!Array.isArray(equipo)) {
        return <div>Cargando...</div>; // O algún otro mensaje mientras no se tenga el array
    }
    //según el número de equipos tendrá un gap u otro
    const numequipo = equipo.length < 5 ? "gap-6" : "gap-1";

    //ordenación según la puntuación 
    const ordenEquipo = [...equipo].sort((a, b) => b.puntos - a.puntos);

    //en caso de que se produzcan empates, le daremos efecto visual

    const mismapuntuacion = equipo //para darle efecto cuando coincida la puntuación entre equipos
        .map(e => e.puntos)
        .filter((valor, i, arr) => arr.indexOf(valor) !== i);


    return (

        <div className="h-screen w-screen relative flex flex-col bg-[url('../assets/img/Mesa.svg')] bg-cover border-4 border-double border-orange-600 overflow-hidden">
            <div>
                <Header className="border-4 border-double border-orange-600"/>
            </div>
            <div className="relative w-full flex-grow transform translate-y-32 ">

                {/* Imágenes de fondo (banderines y pizarra) */}
                <img
                    src="../assets/img/banderines.png"
                    alt="banderines de fondo"
                    className="absolute w-full h-full object-cover z-20"
                />
                {/* Contenido central */}
                <div className="relative z-30 flex w-full px-[3%] pb-[3%] box-border min-h-[calc(100vh)] items-center justify-between">

                    {/* Tablero 2/3 */}

                    <div className="w-2/3 translate-y-[1vw] h-full relative flex items-center justify-center">
                        <img
                            src="../assets/img/tablero_base.png"
                            className="w-full h-full object-contain"
                            style={{ transform: "scale(0.8)" }}
                            alt="Tablero mesa"
                        />
                        <div className="absolute w-full h-full z-40 flex flex-col justify-center items-center pl-[3%] pr-[6%]">
                            {ordenEquipo.map((x, y) => {
                                const destacar = mismapuntuacion.includes(x.puntos);
                                return (
                                    <Ranking
                                        key={y}
                                        nombre={x.nombre}
                                        puntos={x.puntos}
                                        foto={x.foto}  // Cambiado de 'imagen' a 'foto'
                                        destacado={destacar}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Panel derecho 1/3 */}
                    <div className="w-1/3 h-full flex flex-col p-[2%] box-border text-center translate-y-[4vw]">
                        <div className="w-full flex justify-center items-center">
                            <h2 className="text-[4vw] text-naranja font-personalizada font-bold leading-snug w-[80%]">
                                Gracias por participar
                            </h2>
                        </div>

                        <div className="mt-52 flex justify-end items-end w-full">
                            <div className="w-[80%] flex justify-end items-end gap-4 text-right">
                                <div className="leading-tight">
                                    <p className="text-[1.5vw] text-naranja font-personalizada font-bold">Descarga de</p>
                                    <p className="text-[1.5vw] text-naranja font-personalizada font-bold">resultados:</p>
                                </div>

                                <div className="relative w-[4vw]">
                                    <img
                                        src="../assets/img/carpeta_descarga_naranja.png"
                                        alt="Descarga"
                                        className="w-full"
                                    />
                                    <p className="absolute inset-0 flex items-center justify-center text-white font-personalizada text-[1.2vw] translate-y-[1vw]">
                                        <a
                                            href="http://localhost:3000/api/download-grupos"
                                            download > aquí </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div >
        </div >




    );
};

export default VistaRanking;
