const fs = require('fs');
const path = require('path');

// Rutas
const inputDir = path.join(__dirname, '../../src/assets/tablero-casillas');
const outputDir = path.join(__dirname, '../../src/components/casillas');

// Crea carpeta de salida si no existe
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Recorre SVGs
fs.readdirSync(inputDir).forEach((file) => {
  if (path.extname(file) === '.svg') {
    const id = path.basename(file, '.svg');
    const svgPath = path.join(inputDir, file);
    const jsxPath = path.join(outputDir, `Casilla${id}.jsx`);

    let svgContent = fs.readFileSync(svgPath, 'utf-8');

    // Elimina xmlns y convierte atributos a JSX-friendly
    svgContent = svgContent
      .replace(/xmlns="[^"]+"/g, '')
      .replace(/stroke-width/g, 'strokeWidth')
      .replace(/fill-rule/g, 'fillRule')
      .replace(/clip-rule/g, 'clipRule')
      .replace(/class=/g, 'className=');

    // Mueve transform del <rect> a un <g> si existe
    const match = svgContent.match(/<rect[^>]*transform="([^"]+)"([^>]*)\/>/);
    if (match) {
      const transform = match[1];
      const rest = match[2];
      const rectClean = match[0]
        .replace(`transform="${transform}"`, '')
        .replace(/\/>/, '');
      const gWrapped = `<g transform="${transform}">${rectClean}</rect></g>`;
      svgContent = svgContent.replace(match[0], gWrapped);
    }

    // Empaqueta en un componente
    const jsxComponent = `
export default function Casilla${id}() {
  return (
    ${svgContent
      .replace('<svg', '<svg className="w-full h-full" viewBox="0 0 100 100"')
      .trim()}
  );
}
`.trim();

    // Escribe archivo
    fs.writeFileSync(jsxPath, jsxComponent, 'utf-8');
    console.log(`✅ Generado: Casilla${id}.jsx`);
  }
});