import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

export const downloadResultadoExcel = async (req, res) => {
  try {
    // Obtener el ID de la última partida
    const ultimoPartida = await prisma.partida.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    const ultimoPartidaId = ultimoPartida?.id;


    // -----------------------CONSTANTES----------------------------------
    //--------------------------------------------------------------------

    const equipos = await prisma.equipo.findMany({
      where: { partidaId: ultimoPartidaId },
      select: {
        nombre: true,
        integrantes: true,
        puntos: true
      },
      orderBy: { puntos: 'desc' }
    });
    //------------------------------------------------------------------------
    const fallosPorGrupo = await prisma.RespuestaPartida.findMany({
      where: {
        esCorrecta: false,
        equipo: {
          partidaId: ultimoPartidaId,
        },
      },
      select: {
        equipo: {
          select: { nombre: true }
        },
        pregunta: {
          select: { texto: true }
        }
      }
    });

    // --- Crear Excel ---
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resultados');

    // -----------------------FIN DE CONSTANTES----------------------------------
    //--------------------------------------------------------------------

    // Título y encabezados tabla principal
    worksheet.mergeCells('A1:C1');
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = 'RESUMEN GENERAL';
    titleRow.font = { size: 16, bold: true };
    titleRow.alignment = { horizontal: 'center' }
    titleRow.height = 25;

    // Encabezados de columnas

    // Define columnas solo con clave y ancho
    worksheet.columns = [
      { key: 'nombre', width: 30 },
      { key: 'integrantes', width: 60 },
      { key: 'puntos', width: 12 }
    ];

    // Agrega encabezados manualmente en la fila 2
    const headerRow = worksheet.getRow(2);
    headerRow.values = ['Nombre del equipo', 'Integrantes', 'Puntuación'];
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };
    headerRow.height = 20; // Opcional
    headerRow.commit();

    let currentRow = 3; // Comenzar desde la fila 3 para los datos
    // quita los ; almacenados en integrantes y lo sustituye por , para que sea más legible

    //-------------------------AÑADE LOS DATAOS DEL equipo, INTEGRANTES Y PUNTUACIÓN-------------------
    equipos.forEach(equipo => {
      // Si integrantes está guardado como string separado por ';', mejor mostrar con comas
      const integrantesFormateados = equipo.integrantes
        ? equipo.integrantes.split(';').join(', ')
        : '';

      const row = worksheet.getRow(currentRow++);
      row.values = [equipo.nombre, integrantesFormateados, equipo.puntos ?? 0];
      row.commit();
    });

    // Añadir fila vacía y aumentar currentRow para reservarla
    worksheet.getRow(currentRow++).commit();

    // Comprobar si hay respuestas customizables para la partida
    const hayCustomizables = await prisma.respuestaCustomizable.findFirst({
      where: {
        equipo: {
          partidaId: ultimoPartidaId
        }
      },
      select: { id: true } // no importa qué, solo saber si existe
    });

    // Agrupar errores por equipo
    let agrupadas = {};

    // ---------------------------SELECCIONAR INFO CUSTOMIZABLE O DEL JUEGO-----------------
    if (hayCustomizables) {
      // Obtener preguntas falladas en modo customizable
      const fallosCustomizables = await prisma.respuestaCustomizable.findMany({
        where: {
          esCorrecta: false,
          equipo: {
            partidaId: ultimoPartidaId
          }
        },
        select: {
          equipo: { select: { nombre: true } },
          customizable: { select: { pregunta: true } }
        }

      });
      // ---------------------------PREGUNTAS FALLADAS CUSTOMIZABLE-----------------
      fallosCustomizables.forEach(({ equipo, customizable }) => {
        if (!agrupadas[equipo.nombre]) {
          agrupadas[equipo.nombre] = [];
        }
        agrupadas[equipo.nombre].push(customizable.pregunta);
      });

    } else {
      // ---------------------------PREGUNTAS FALLADAS DEL JUEGO-----------------
      fallosPorGrupo.forEach(({ equipo, pregunta }) => {
        if (!agrupadas[equipo.nombre]) {
          agrupadas[equipo.nombre] = [];
        }
        agrupadas[equipo.nombre].push(pregunta.texto);
      });
    }
    // Escribir errores agrupados por equipo
    Object.entries(agrupadas).forEach(([nombreEquipo, preguntas]) => {
      const rowEquipo = worksheet.getRow(currentRow++);
      rowEquipo.getCell(1).value = `Nombre del equipo: ${nombreEquipo}`;
      rowEquipo.font = { bold: true };
      rowEquipo.commit();

      preguntas.forEach(textoPregunta => {
        const row = worksheet.getRow(currentRow++);
        row.getCell(1).value = `• ${textoPregunta}`;
        row.alignment = { horizontal: 'left' };
        row.commit();
      });

      worksheet.getRow(currentRow++).commit(); // fila vacía entre equipos
    });


    //-----------------------------------------------------------------------------------------------
    // Preparar descarga
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename="resultados.xlsx"');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error al generar Excel:', error);
    res.status(500).json({ error: 'Error al generar Excel' });
  }
};
