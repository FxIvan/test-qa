const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getScripts(url, outFile) {
  const { data = '' } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    },
  }).catch(err => console.log("ERROR >>>>>>", err))
  if (!data) return null
  const $ = cheerio.load(data);

  const scripts = [];

  $('script').each((_, el) => {
    const src = $(el).attr('src');
    if (src) {
      scripts.push({ type: 'external', content: src });
    } else {
      const content = $(el).html()?.trim();
      scripts.push({ type: 'inline', content: content?.slice(0, 200) + '...' }); // Limita texto
    }
  });

  fs.writeFileSync(outFile, JSON.stringify(scripts, null, 2));
}

(async () => {
  await getScripts('https://www.infobae.com/', 'argentina-prod-con-config.json');
  await getScripts('https://www.infobae.com/colombia/', 'colombia-prod-con-config.json');
  await getScripts('https://www.infobae.com/espana/', 'espana-prod-con-config.json');
  await getScripts('https://www.infobae.com/mexico/', 'mexico-prod-con-config.json');
  await getScripts('https://www.infobae.com/peru/', 'peru-prod-con-config.json');
  await getScripts('https://www.infobae.com/america/', 'mundo-prod-con-config.json');
  await getScripts('https://www.infobae.com/ultimas-noticias-america/', 'ultimas-noticias-america-prod-con-config.json');
  await getScripts('https://www.infobae.com/economia/', 'economia-prod-con-config.json');
  await getScripts('https://www.infobae.com/teleshow/', 'teleshow-prod-con-config.json');
  await getScripts('https://www.infobae.com/tag/peru-economia/', 'peru-economia-prod-con-config.json');

  await getScripts('https://www.infobae.com/politica/2025/04/10/el-paro-general-de-la-cgt-en-vivo-las-ultimas-noticias-de-la-medida-de-fuerza-contra-el-gobierno-de-javier-milei/', 'live-argentina-prod-con-config.json');
  await getScripts('https://www.infobae.com/politica/2025/04/10/el-segundo-de-kicillof-le-pedira-a-la-casa-rosada-el-comando-electoral-para-organizar-las-elecciones-desdobladas/', 'nota-argentina-prod-con-config.json');

  await getScripts('https://www.infobae.com/colombia/2025/04/10/latam-se-pronuncio-por-el-robo-de-pelicula-en-aeropuerto-de-riohacha-en-el-que-uno-de-sus-aviones-estuvo-involucrado/', 'nota-colombia-prod-con-config.json');
  await getScripts('https://www.infobae.com/espana/2025/04/10/china-defiende-a-pedro-sanchez-tras-las-criticas-de-eeuu-acusa-a-trump-de-estrangular-las-gargantas-de-todos-los-paises-con-los-aranceles/', 'nota-espana-prod-con-config.json');

  await getScripts('https://www.infobae.com/mexico/2025/04/10/la-mananera-de-claudia-sheinbaum-hoy-10-de-abril-en-vivo/', 'live-mexico-prod-con-config.json');
  await getScripts('https://www.infobae.com/mexico/2025/04/10/operacion-enjambre-detienen-a-alicia-n-sindico-de-san-jose-del-rincon-por-secuestro-expres/', 'nota-mexico-prod-con-config.json');

  await getScripts('https://www.infobae.com/peru/2025/04/10/paro-de-transportistas-en-vivo-lima-callao-10-de-abril-2025-ultimas-noticias-rutas-afectadas-gremios-extorsiones-pnp-fotos-videos/', 'live-peru-prod-con-config.json');
  await getScripts('https://www.infobae.com/peru/2025/04/10/gustavo-adrianzen-minimiza-paro-de-transportistas-de-hoy-10-de-abril-no-ayuda-contra-la-delincuencia/', 'nota-peru-prod-con-config.json');

  await getScripts('https://www.infobae.com/america/mundo/2025/04/10/en-vivo-la-bolsa-de-taiwan-cerro-con-un-alza-record-del-93-tras-la-pausa-arancelaria-de-estados-unidos/', 'live-america-prod-con-config.json');
  await getScripts('https://www.infobae.com/america/mundo/2025/04/10/estremecedor-descubrimiento-hallaron-los-restos-de-cuatro-ninos-asesinados-en-un-campo-de-concentracion-nazi-en-polonia/', 'nota-america-prod-con-config.json');
})();
