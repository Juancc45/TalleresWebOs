const chatinput     = document.querySelector('.chat-input');
const chatMessages  = document.querySelector('.chat-messages');
const chatInputForm = document.querySelector('.chat-input-form');
const sendButton    = document.querySelector('.send-button');
const spellStatus   = document.getElementById('spell-status');


const BLOCK_ON_ERRORS = true; 
const CUSTOM_WORDS = new Set(['Fortnite', 'InfoFortnite']); 


const BASIC_ES = new Set([
  'de','la','que','el','en','y','a','los','se','del','las','un','por','con','no','una','su','para','es','al','lo',
  'como','más','pero','sus','le','ya','o','fue','ha','sí','porque','esta','son','entre','cuando','muy','sin',
  'sobre','también','me','hasta','hay','donde','quien','desde','todo','nos','durante','todos','uno','les','ni',
  'contra','otros','ese','eso','otro','tan','esa','estos','mucho','quienes','nada','muchos','cual','poco','ella',
  'estar','estas','algunas','algo','nosotros','mi','mis','tú','te','ti','tu','tus','él','ella','ello','ellos','ellas',
  'ser','haber','hacer','poder','decir','ir','ver','dar','saber','querer','llegar','pasar','deber','poner','parecer',
  'quedar','creer','hablar','llevar','dejar','seguir','encontrar','llamar','venir','pensar','salir','volver','tomar',
  'conocer','vivir','sentir','tratar','mirar','contar','empezar','esperar','buscar','entrar','trabajar','escribir',
  'perder','entender','hola','gracias','porfavor','por','favor','buenos','días','buenas','tardes','noche','mañana',
  'hoy','ayer','si','no','chat','mensaje','enviar'
]);


const WORD_RE       = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g;
const hasThreeSame  = /(.)\1\1/;              
const VOWELS_RE     = /[aeiouáéíóúü]/i;

function debounce(fn, delay = 220) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const chatMessageElement = (message) => `
  <div class="message gray-bg">
    <div class="message-text">${escapeHtml(message.text)}</div>
  </div>
`;

let hasSpellingErrors = false;
function setSpellUI({ errorsCount, message }) {
  hasSpellingErrors = errorsCount > 0;

  if (hasSpellingErrors) {
    chatinput && chatinput.classList.add('error');
    if (spellStatus) {
      spellStatus.hidden = false;
      spellStatus.querySelector('.status-text').textContent =
        message || `Revisa la ortografía (${errorsCount} posible(s) error(es)).`;
    }
    if (BLOCK_ON_ERRORS && sendButton) sendButton.setAttribute('disabled', 'true');
  } else {
    chatinput && chatinput.classList.remove('error');
    if (spellStatus) spellStatus.hidden = true;
    if (BLOCK_ON_ERRORS && sendButton) sendButton.removeAttribute('disabled');
  }
}

function normalizeBasic(s){
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,''); 
}

function isKnown(word){
  if (CUSTOM_WORDS.has(word)) return true;
  const w = normalizeBasic(word);
  if (BASIC_ES.has(w)) return true;

  // Variantes simples
  if (w.endsWith('s')  && BASIC_ES.has(w.slice(0,-1)))  return true;
  if (w.endsWith('es') && BASIC_ES.has(w.slice(0,-2)))  return true; 
  if (w.endsWith('mente') && BASIC_ES.has(w.slice(0,-5))) return true; 
  return false;
}

function extractUniqueWords(text){
  const words = text.match(WORD_RE) || [];
  return [...new Set(words)];
}

const checkSpelling = debounce((text) => {
  const trimmed = text.trim();
  if (!trimmed) { setSpellUI({ errorsCount: 0 }); return; }

  const words = extractUniqueWords(trimmed);
  let errors = 0;

  for (const w of words) {
    if (w.length <= 2) continue;               
    if (!VOWELS_RE.test(w) && w.length >= 4) {   
      errors++; continue;
    }
    if (hasThreeSame.test(w)) {                  
      errors++; continue;
    }
    if (!isKnown(w)) errors++;
  }

  setSpellUI({ errorsCount: errors });
}, 220);


chatinput && chatinput.addEventListener('input', (e) => {
  if (BLOCK_ON_ERRORS && sendButton) {
    if (!e.target.value.trim()) sendButton.setAttribute('disabled', 'true');
  }
  checkSpelling(e.target.value);
});

function sendMessage(e){
  e.preventDefault();

  if (BLOCK_ON_ERRORS && hasSpellingErrors) {
    if (chatinput) {
      chatinput.classList.add('shake');
      setTimeout(() => chatinput.classList.remove('shake'), 400);
    }
    return;
  }

  const text = chatinput ? chatinput.value : '';
  const message = { text };
  if (chatMessages) {
    chatMessages.innerHTML += chatMessageElement(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  if (chatinput) chatinput.value = '';

  setSpellUI({ errorsCount: 0 });
  if (BLOCK_ON_ERRORS && sendButton) sendButton.setAttribute('disabled', 'true');
}

chatInputForm && chatInputForm.addEventListener('submit', sendMessage);


if (BLOCK_ON_ERRORS && sendButton) sendButton.setAttribute('disabled', 'true');
