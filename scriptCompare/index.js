const fs = require('fs');
const path = require('path');

const basePathCon = '/home/almendra/qa-infobae/scripts-output-type/con';
const basePathSin = '/home/almendra/qa-infobae/scripts-output-type/sin';

const categorias = ['argentina', 'colombia-peru', 'españa', 'mexico', 'mundo'];

const archivos = [
  'argentina-prod-con-config.json',
  'colombia-prod-con-config.json',
  'espana-prod-con-config.json',
  'mexico-prod-con-config.json',
  'peru-prod-con-config.json',
  'mundo-prod-con-config.json',
  'ultimas-noticias-america-prod-con-config.json',
  'economia-prod-con-config.json',
  'teleshow-prod-con-config.json',
  'peru-economia-prod-con-config.json',
  'live-argentina-prod-con-config.json',
  'nota-argentina-prod-con-config.json',
  'nota-colombia-prod-con-config.json',
  'nota-espana-prod-con-config.json',
  'live-mexico-prod-con-config.json',
  'nota-mexico-prod-con-config.json',
  'live-peru-prod-con-config.json',
  'nota-peru-prod-con-config.json',
  'live-america-prod-con-config.json',
  'nota-america-prod-con-config.json',
];

const diferencias = [];
const archivosFaltantes = [];

function limpiarYComparar(arr1, arr2) {
  const filtrar = (arr) =>
    arr.filter(
      (item) =>
        !item.content.includes('3128') &&
        !item.content.includes('3124')
    );

  const cleanArr1 = filtrar(arr1);
  const cleanArr2 = filtrar(arr2);

  const difs = [];
  const maxLength = Math.max(cleanArr1.length, cleanArr2.length);

  for (let i = 0; i < maxLength; i++) {
    const item1 = cleanArr1[i];
    const item2 = cleanArr2[i];

    if (!item1 || !item2 || item1.type !== item2.type || item1.content !== item2.content) {
      difs.push({
        index: i,
        con: item1 || null,
        sin: item2 || null,
      });
    }
  }

  return difs;
}

for (const categoria of categorias) {
  const pathCon = path.join(basePathCon, categoria);
  const pathSin = path.join(basePathSin, categoria);

  for (const archivo of archivos) {
    const archivoCon = path.join(pathCon, archivo);
    const archivoSin = path.join(pathSin, archivo);

    const existeEnCon = fs.existsSync(archivoCon);
    const existeEnSin = fs.existsSync(archivoSin);

    // Solo si existe en ambos, comparar contenido
    if (existeEnCon && existeEnSin) {
      try {
        const jsonCon = JSON.parse(fs.readFileSync(archivoCon, 'utf8'));
        const jsonSin = JSON.parse(fs.readFileSync(archivoSin, 'utf8'));

        const difs = limpiarYComparar(jsonCon, jsonSin);
        if (difs.length > 0) {
          diferencias.push({
            categoria,
            archivo,
            diferencias: difs,
          });
        }
      } catch (err) {
        console.error(`Error leyendo o parseando archivo: ${archivo}`, err);
      }
    }

    // Si existe en SIN pero no en CON, agregar a faltantes
    if (!existeEnCon && existeEnSin) {
      archivosFaltantes.push({
        categoria,
        archivo,
        mensaje: 'Existe en carpeta "sin" pero falta en "con"',
      });
    }
  }
}

fs.writeFileSync('diferencias.json', JSON.stringify(diferencias, null, 2));
fs.writeFileSync('faltantes.json', JSON.stringify(archivosFaltantes, null, 2));
console.log('Comparación finalizada. Revisa diferencias.json y faltantes.json');
