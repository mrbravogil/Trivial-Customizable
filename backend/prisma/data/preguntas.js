
import preguntasBiologia from './preguntas/preguntas_biologia.js';
import preguntasGeografia from './preguntas/preguntas_geografia.js';
import preguntasIdiomas from './preguntas/preguntas_idiomas.js';
import preguntasLengua from './preguntas/preguntas_lengua.js';
import preguntasMatematicas from './preguntas/preguntas_matematicas.js';
import preguntasMusica from './preguntas/preguntas_musica.js';

// Array combinado con todas las preguntas de los archivos individuales
const preguntas = [
    ...preguntasIdiomas,
    ...preguntasMatematicas,
    ...preguntasBiologia,
    ...preguntasMusica,
    ...preguntasGeografia,
    ...preguntasLengua,
];

export default preguntas;