import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function wrap(value) {
  const lines = [''];
  for (const word of String(value).split(' ')) {
    const last = lines.length - 1;
    if (lines[last] && `${lines[last]} ${word}`.length > 19) lines.push(word);
    else lines[last] += `${lines[last] ? ' ' : ''}${word}`;
  }
  return lines;
}
export function prepareDataDiagrams() {
  mkdirSync('public/images/machines', { recursive: true });
  const machines = JSON.parse(readFileSync('src/data/machines/machines.json', 'utf8'));
  for (const m of machines) {
    const values = m.recipe ? [m.input, `${m.recipe.outputKg} kg ${m.recipe.outputMaterial.replaceAll('-', ' ')} / cycle`, `${m.cycle} s / ${m.power} kW`] : m.powerMode === 'generator' ? [`${m.powerOutput} kW peak`, `${m.battery} kWh battery`, `${m.range} m radius`] : m.category === 'Robots' ? m.stats.filter(s => ['Working area', 'Robot bin', 'Cleaning width'].includes(s.label)).map(s => s.value) : [`$${m.cost}${m.costUnit === 'metre' ? '/m' : ' build price'}`, m.storage ? `${m.storage} kg storage` : m.input, m.output];
    const labels = m.recipe ? ['INPUT', 'OUTPUT', 'FULL POWER'] : m.powerMode === 'generator' ? ['GENERATION', 'STORAGE', 'COVERAGE'] : m.category === 'Robots' ? ['AREA', 'BIN', 'WIDTH'] : ['BASE COST', m.storage ? 'STORAGE' : 'INPUT', 'OUTPUT'];
    const boxes = values.map((value, i) => `<g transform="translate(${30 + i * 232},130)"><rect width="216" height="155" rx="13" fill="#132d41" stroke="#3a6079"/><text x="18" y="32" fill="#8bcbeb" font-size="12" letter-spacing="2">${labels[i]}</text>${wrap(value).map((line, j) => `<text x="18" y="${68 + j * 24}" fill="#f1f6fc" font-size="20" font-weight="700">${escape(line)}</text>`).join('')}</g>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="740" height="420" viewBox="0 0 740 420"><rect width="740" height="420" rx="18" fill="#0b1d2b"/><path d="M30 335H710M30 346H250" stroke="#36586f"/><g font-family="Arial"><text x="30" y="38" fill="#ffa329" font-size="11" letter-spacing="3">MOON SWEEPERS / EQUIPMENT REFERENCE</text><text x="30" y="89" fill="#f3f7fc" font-size="34" font-weight="700">${escape(m.title)}</text>${boxes}<text x="30" y="322" fill="#ffa329" font-size="12">${m.recipe ? 'RECIPE MODEL • CONTINUOUS INPUT AND FULL POWER REQUIRED' : 'REFERENCE PARAMETERS • NOT A DRAWING OF THE GAME MODEL'}</text><text x="30" y="375" fill="#9bb8cc" font-size="11">Community-reported specifications • reviewed 2026-11-03</text><text x="30" y="397" fill="#6b91aa" font-size="10">Original data diagram by Moon Sweepers Wiki • sources linked on the entry</text></g></svg>`;
    writeFileSync(`public/images/machines/${m.slug}-data.svg`, svg);
  }
}
if (process.argv[1]?.endsWith('prepare-data-diagrams.mjs')) prepareDataDiagrams();
