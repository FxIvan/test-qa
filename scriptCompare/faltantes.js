const fs = require('fs');
const path = require('path');

const basePathCon = '/home/almendra/qa-infobae/scripts-output-type/con';
const basePathSin = '/home/almendra/qa-infobae/scripts-output-type/sin';

const categorias = ['argentina', 'colombia-peru', 'españa', 'mexico', 'mundo'];

const faltantesEnCon = [];

function limpiar(arr) {
  return arr.filter(
    (item) =>
      !item.content.includes('3128') &&
      !item.content.includes('3124')
  );
}

for (const categoria of categorias) {
  const pathCon = path.join(basePathCon, categoria);
  const pathSin = path.join(basePathSin, categoria);

  if (fs.existsSync(pathSin) && fs.existsSync(pathCon)) {
    const archivosEnSin = fs.readdirSync(pathSin).filter(f => f.endsWith('.json'));

    for (const archivo of archivosEnSin) {
      const archivoSin = path.join(pathSin, archivo);
      const archivoCon = path.join(pathCon, archivo);

      if (fs.existsSync(archivoCon)) {
        try {
          const jsonSin = limpiar(JSON.parse(fs.readFileSync(archivoSin, 'utf8')));
          const jsonCon = limpiar(JSON.parse(fs.readFileSync(archivoCon, 'utf8')));

          const contenidoConStr = jsonCon.map(item => JSON.stringify(item));
          const faltantes = jsonSin.filter(
            item => !contenidoConStr.includes(JSON.stringify(item))
          );

          if (faltantes.length > 0) {
            faltantesEnCon.push({
              categoria,
              archivo,
              faltantes
            });
          }
        } catch (err) {
          console.error(`Error leyendo o parseando archivo: ${archivo}`, err);
        }
      }
    }
  }
}

fs.writeFileSync('faltantes-contenido-en-con.json', JSON.stringify(faltantesEnCon, null, 2));
console.log('Verificación de objetos faltantes completada. Revisa faltantes-contenido-en-con.json');
