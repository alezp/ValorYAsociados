/**
 * OFUSCADOR CRIPTOGRÁFICO DE CÓDIGO JS NATIVO (V2 - ULTRA ROBUSTO)
 * Protege datos sensibles, números de teléfono, base de conocimiento y lógica del bot
 * - Codificación XOR con clave polimórfica + Base64
 * - Ocultación de nombres de variables y funciones sensibles
 * - Preservación intacta de URLs (https://) y template literals
 * - Empaquetado hermético en IIFE
 */

const fs = require('fs');
const path = require('path');

const XOR_KEY = 0x5a; // Clave de cifrado

function xorEncrypt(text) {
  const buf = Buffer.from(text, 'utf8');
  for (let i = 0; i < buf.length; i++) {
    buf[i] = buf[i] ^ XOR_KEY;
  }
  return buf.toString('base64');
}

function obfuscateCode(sourceCode) {
  const stringLiterals = [];
  const stringMap = new Map();

  // 1. Limpiar comentarios SOLO al inicio de línea o bloques multilínea explícitos
  let cleanSource = sourceCode
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/[^\r\n]*/gm, '');

  // 2. Extraer strings con comillas dobles y simples (sin tocar backticks)
  const stringRegex = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g;

  let cleanedCode = cleanSource.replace(stringRegex, (match) => {
    const rawVal = match.slice(1, -1);
    if (rawVal.length === 0 || rawVal.includes('<style>') || rawVal.includes('</style>')) {
      return match;
    }

    if (!stringMap.has(rawVal)) {
      const encrypted = xorEncrypt(rawVal);
      const index = stringLiterals.length;
      stringLiterals.push(encrypted);
      stringMap.set(rawVal, index);
    }

    const idx = stringMap.get(rawVal);
    return `_0xdec(${idx})`;
  });

  // 3. Decodificador en tiempo de ejecución
  const decoderCode = `
var _0xtbl = ${JSON.stringify(stringLiterals)};
var _0xkey = ${XOR_KEY};
function _0xdec(_0xi) {
  var _0xb64 = _0xtbl[_0xi];
  if (!_0xb64) return '';
  try {
    var _0xbin;
    if (typeof atob !== 'undefined') {
      _0xbin = atob(_0xb64);
    } else {
      _0xbin = Buffer.from(_0xb64, 'base64').toString('binary');
    }
    var _0xres = [];
    for (var _0xj = 0; _0xj < _0xbin.length; _0xj++) {
      _0xres.push(String.fromCharCode(_0xbin.charCodeAt(_0xj) ^ _0xkey));
    }
    var _0xstr = _0xres.join('');
    try {
      return decodeURIComponent(escape(_0xstr));
    } catch(e) {
      return _0xstr;
    }
  } catch(err) {
    return '';
  }
}
`;

  // 4. Renombrado de variables y funciones sensibles
  const sensitiveNames = [
    'ARGENTINA_PROVINCIAS',
    'DEFAULT_BANNERS',
    'DEFAULT_VIDEOS',
    'CONTACTO_OFICIAL',
    'BOT_KNOWLEDGE',
    'LegalChatbot',
    'MediaManager',
    'userState',
    'escalateToHuman',
    'saveLeadToLocal',
    'processNLP',
    'tempBannerImageBase64',
    'tempVideoBase64',
    'storageKeyBanners',
    'storageKeyVideos',
    'initProvinciaSelect',
    'initConsultationForm',
    'initTearTabs',
    'initMobileMenu'
  ];

  let obfuscatedBody = cleanedCode;
  sensitiveNames.forEach((name, i) => {
    const hexName = '_0x' + (0xa100 + i * 29).toString(16);
    const regex = new RegExp('\\b' + name + '\\b', 'g');
    obfuscatedBody = obfuscatedBody.replace(regex, hexName);
  });

  return `(function(){\n${decoderCode}\n${obfuscatedBody}\n})();`;
}

// 1. Unificar código de los módulos
const jsDir = path.join(__dirname, 'assets', 'js');
const files = ['data.js', 'chatbot.js', 'media-manager.js', 'main.js'];

let combined = '';
files.forEach(f => {
  const p = path.join(jsDir, f);
  if (fs.existsSync(p)) {
    combined += fs.readFileSync(p, 'utf8') + '\n;\n';
  }
});

console.log('Ofuscando código sensible del estudio...');
const obfuscated = obfuscateCode(combined);

// Guardar versión ofuscada en assets/js/app.min.js
fs.writeFileSync(path.join(jsDir, 'app.min.js'), obfuscated, 'utf8');
console.log('✓ Archivo d:/abogados/assets/js/app.min.js generado (' + obfuscated.length + ' bytes).');

// 2. Inyectar en index.html
const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const startScript = html.indexOf('<script>');
const endScript = html.indexOf('</script>') + 9;

if (startScript >= 0 && endScript > startScript) {
  const newHtml = html.substring(0, startScript) +
    `<script>\n${obfuscated}\n  </script>` +
    html.substring(endScript);
  
  fs.writeFileSync(indexPath, newHtml, 'utf8');
  console.log('✓ index.html actualizado con script completamente ofuscado.');
}
