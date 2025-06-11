import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Asegúrate de que exista la carpeta uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Controlador principal para procesar el archivo
export const procesarArchivo = async (req, res) => {
  console.log('📝 Procesando archivo de preguntas customizadas…');

  if (!req.file) {
    console.error('❌ No se ha subido ningún archivo');
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }

  const filePath = req.file.path;
  console.log('📁 Archivo recibido:', req.file.originalname);

  const resultados = [];
  const errores = [];

  const procesarFila = (data) => {
    const texto       = data['pregunta']?.trim();
    const puntuacion  = parseInt(data['puntuación'], 10);
    const opcionA     = data['opción_a']?.trim();
    const opcionB     = data['opción_b']?.trim();
    const opcionC     = data['opción_c']?.trim();
    const opcionD     = data['opción_d']?.trim();
    const correcta    = data['correcta']?.trim().toLowerCase();
    const explicacion = data['explicación']?.trim() || '';

    const opcionesValidas = ['a', 'b', 'c', 'd'];
    const valida =
      texto &&
      opcionesValidas.includes(correcta) &&
      !isNaN(puntuacion) &&
      opcionA && opcionB && opcionC && opcionD;

    if (!valida) {
      errores.push(`Fila inválida: ${JSON.stringify(data)}`);
      return;
    }

    const opciones = {
      a: opcionA,
      b: opcionB,
      c: opcionC,
      d: opcionD,
    };

    const respuestaCorrecta = opciones[correcta];

    resultados.push({
      pregunta:             texto,
      opcion1:              opcionA,
      opcion2:              opcionB,
      opcion3:              opcionC,
      opcion4:              opcionD,
      respuesta_correcta:   respuestaCorrecta,
      puntuacion:           puntuacion,
      explicacion:          explicacion,
      esCustom:             true,
    });
  };

  const finConError = (status, payload) => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(status).json(payload);
  };

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext === '.csv') {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', procesarFila)
        .on('end', async () => {
          await manejarResultado(res, resultados, errores);
          fs.unlinkSync(filePath);
        })
        .on('error', () => finConError(500, { error: 'Error al leer CSV' }));
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = xlsx.readFile(filePath);
      const sheet1 = workbook.SheetNames[0];
      const filas = xlsx.utils.sheet_to_json(workbook.Sheets[sheet1], { defval: '' });
      filas.forEach(procesarFila);
      await manejarResultado(res, resultados, errores);
      fs.unlinkSync(filePath);
    } else {
      return finConError(400, { error: 'Formato de archivo no soportado' });
    }
  } catch (err) {
    console.error('❌ Error procesando archivo:', err);
    return finConError(500, { error: 'Error interno al procesar archivo' });
  }
};

// Función auxiliar para guardar en la base de datos
async function guardarPreguntas(preguntas) {
  try {
    const resultado = await prisma.customizable.createMany({
      data: preguntas,
      skipDuplicates: true,
    });
    return resultado;
  } catch (error) {
    console.error('❌ Error al guardar preguntas customizadas:', error);
    throw error;
  }
  // Nota: no desconectamos prisma aquí para evitar problemas si se llama varias veces
}

// Manejador del resultado final tras validación
async function manejarResultado(res, resultados, errores) {
  if (errores.length) {
    console.warn(`⚠️ ${errores.length} filas inválidas`);
    return res.status(400).json({
      error: 'Algunas filas inválidas',
      detalles: errores,
      validas: resultados.length,
    });
  }

  try {
    const { count } = await guardarPreguntas(resultados);
    return res.json({
      mensaje: `${count} preguntas importadas correctamente`,
    });
  } catch (dbErr) {
    console.error('❌ Error al guardar en BD:', dbErr);
    return res.status(500).json({ error: 'Falló al guardar en la base de datos' });
  }
}

// Nueva función para listar las preguntas almacenadas en la base de datos
export const verPreguntas = async () => {
  try {
    return await prisma.customizable.findMany();
  } catch (error) {
    console.error('❌ Error al obtener preguntas:', error);
    throw error;
  }
};
