// all language translations live here. edit both languages when adding text.
const translations={en:{about:'about',contact:'contact',getInTouch:'get in touch',role:'producer / composer',enterRoom:'enter room',secretProject:'secret project',playPiece:'play the piece',aboutPiece:'about the piece',process:'process / notes',processPlaceholder:'write about sketches, workshops, ideas, or the making of the piece here.',inspirations:'inspo',inspirationPlaceholder:'add the images and references that shaped this piece.',streaming:'listen elsewhere',credits:'credits',creditsPlaceholder:'add performers, ensemble, recording, production and other credits here.',score:'score',requestScore:'email me to request sheet music',backArchive:'back to the archive',archive:'archive',selectedCredits:'production highlights',creditsPrompt:'add your biography, projects, collaborators and performances here.',aboutBio:"i'm a composer and producer working across contemporary music, film, bands and sound. this is a place to hear the work and explore what went into it.",secretTitle:'a room between things.',secretText:'a listening space is taking shape here. no feed, no likes, just music and thoughts. come back soon.'},sr:{about:'o meni',contact:'kontakt',getInTouch:'javi se',role:'producent / kompozitor',enterRoom:'uđi u sobu',secretProject:'tajni projekat',playPiece:'poslušaj delo',aboutPiece:'o delu',process:'proces / beleške',processPlaceholder:'ovde napiši nešto o skicama, radionicama, idejama ili nastanku dela.',inspirations:'inspo',inspirationPlaceholder:'ovde dodaj slike i reference koje su oblikovale ovo delo.',streaming:'slušaj i ovde',credits:'saradnici',creditsPlaceholder:'ovde dodaj izvođače, ansambl, snimanje, produkciju i ostale zasluge.',score:'partitura',requestScore:'pošalji mi mejl za note',backArchive:'nazad na arhivu',archive:'arhiva',selectedCredits:'istaknute saradnje',creditsPrompt:'ovde dodaj biografiju, projekte, saradnike i nastupe.',aboutBio:'komponujem i produciram muziku za savremene ansamble, filmove i bendove. ovo je mesto za slušanje muzike i istraživanje ideja iza nje.',secretTitle:'soba između svetova.',secretText:'ovde nastaje prostor za slušanje. bez fidova i lajkova, samo muzika i misli. svrati uskoro.'}};
function applyLanguage(lang){document.documentElement.lang=lang;document.querySelectorAll('[data-i18n]').forEach(el=>{const t=translations[lang][el.dataset.i18n];if(t)el.textContent=t});document.querySelectorAll('[data-en][data-sr]').forEach(el=>{el.textContent=el.dataset[lang]});localStorage.setItem('iliyuh-lang',lang);const b=document.querySelector('#language-switch');if(b)b.textContent=lang==='en'?'en / sr':'sr / en'}
// A visitor's browser language/region gives a privacy-friendly default.
// Their manual choice is saved and always takes priority.
function defaultLanguage(){
 const locales=navigator.languages?.length?navigator.languages:[navigator.language||'en'];
 const first=(locales[0]||'en').toLowerCase();
 const primary=first.split('-')[0];
 const region=(first.split('-')[1]||'').toUpperCase();
 const serbianLanguages=['sr','bs','hr','cnr'];
 const nearbyRegions=['RS','BA','ME','HR'];
 return serbianLanguages.includes(primary)||nearbyRegions.includes(region)?'sr':'en';
}
let lang=localStorage.getItem('iliyuh-lang')||defaultLanguage();applyLanguage(lang);document.querySelector('#language-switch')?.addEventListener('click',()=>{lang=lang==='en'?'sr':'en';applyLanguage(lang)});
// homepage: click a row to expand its cover into a playing film.
// Sound is requested only in response to a real click (browser autoplay rules).
const items=document.querySelectorAll('.work-item');
items.forEach(item=>{
  item.querySelector('.work-trigger').addEventListener('click',()=>{
    const opening=!item.classList.contains('is-open');
    items.forEach(other=>{
      other.classList.remove('is-open');
      other.querySelector('.work-trigger').setAttribute('aria-expanded','false');
      const v=other.querySelector('.thumbnail-video');
      if(v){v.pause();v.currentTime=0;}
    });
    if(opening){
      item.classList.add('is-open');
      item.querySelector('.work-trigger').setAttribute('aria-expanded','true');
      const video=item.querySelector('.thumbnail-video');
      if(video){video.muted=false;video.volume=0.85;video.play().catch(()=>{});}
    }
  });
});
// contact overlay
const overlay=document.querySelector('#contact-overlay');function closeContact(){overlay?.classList.remove('is-visible');overlay?.setAttribute('aria-hidden','true')}document.querySelector('#contact-open')?.addEventListener('click',()=>{overlay?.classList.add('is-visible');overlay?.setAttribute('aria-hidden','false')});document.querySelector('#contact-close')?.addEventListener('click',closeContact);overlay?.addEventListener('click',e=>{if(e.target===overlay)closeContact()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeContact()});
// custom audio player for each room
function formatTime(s){if(!Number.isFinite(s))return '0:00';return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`};document.querySelectorAll('.custom-player').forEach(player=>{const audio=player.querySelector('audio'),button=player.querySelector('.play-toggle'),seek=player.querySelector('.seek'),current=player.querySelector('.current-time'),duration=player.querySelector('.duration');button.addEventListener('click',()=>{if(audio.paused)audio.play().catch(()=>{});else audio.pause()});audio.addEventListener('play',()=>button.textContent='Ⅱ');audio.addEventListener('pause',()=>button.textContent='▶');audio.addEventListener('loadedmetadata',()=>duration.textContent=formatTime(audio.duration));audio.addEventListener('timeupdate',()=>{current.textContent=formatTime(audio.currentTime);if(Number.isFinite(audio.duration)&&audio.duration>0)seek.value=audio.currentTime/audio.duration*100});seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(seek.value)/100*audio.duration})});
// Cover image filenames: slug-cover.jpg/png/webp/jpeg.
// For extra artwork in a room, see README-START-HERE.txt.
document.querySelectorAll('img[data-cover]').forEach(img=>{
 const slug=img.dataset.cover;
 const prefix=img.dataset.root==='true'?'images/':'../images/';
 let i=0;const extensions=['jpg','png','webp','jpeg'];
 img.addEventListener('error',()=>{
   i++;if(i<extensions.length)img.src=`${prefix}${slug}-cover.${extensions[i]}`;
   else img.style.visibility='hidden';
 });
});
// streaming links are placeholders until you paste real URLs.
document.querySelectorAll('a.placeholder-link').forEach(a=>a.addEventListener('click',e=>{if(a.getAttribute('href')==='#')e.preventDefault()}));
// Try alternative snippet formats when a browser cannot load the default .mp4.
document.querySelectorAll('.thumbnail-video').forEach(video=>{
  const source=video.querySelector('source');
  if(!source)return;
  const base=source.getAttribute('src').replace(/\.[^.]+$/, '');
  const formats=[['mp4','video/mp4'],['webm','video/webm'],['mov','video/quicktime']];
  let next=0;
  video.addEventListener('error',()=>{if(++next<formats.length){source.src=base+'.'+formats[next][0];source.type=formats[next][1];video.load();}});
});

// Keep the about page's biography and production credits in the exact same
// position in either language, including on narrow screens. Measure both
// translations at the actual available width, then reserve the taller height.
(() => {
 const bio=document.querySelector('.about-mosaic .about-bio');
 if(!bio)return;
 const measure=()=>{
   bio.style.minHeight='0px';
   const original=lang;
   const heights=[];
   for(const language of ['en','sr']){
     applyLanguage(language);
     heights.push(Math.ceil(bio.getBoundingClientRect().height));
   }
   bio.style.minHeight=Math.max(...heights)+'px';
   applyLanguage(original);
 };
 // Measure once fonts have settled; repeat on width changes, not translation.
 if(document.fonts?.ready)document.fonts.ready.then(measure);
 else measure();
 let lastWidth=document.documentElement.clientWidth;
 window.addEventListener('resize',()=>{
   const w=document.documentElement.clientWidth;
   if(w!==lastWidth){lastWidth=w;measure();}
 });
})();

// v26: shared room navigation and score translation, without touching the homepage.
if (document.querySelector('.piece-page')) {
  document.querySelectorAll('.back-home a').forEach(a => a.classList.add('enter-link', 'about-back'));
}
// Control the YouTube player through its iframe API without reloading the iframe.
// Autoplay must start muted on most browsers; a real user click can unmute it.
(() => {
  const frame = document.querySelector('#listening-hero-youtube');
  const sound = document.querySelector('#listening-sound-toggle');
  const play = document.querySelector('#listening-play-toggle');
  if (!frame || !sound) return;
  const command = (func, args = []) => {
    frame.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}), 'https://www.youtube-nocookie.com');
  };
  let audible = false;
  sound.addEventListener('click', () => {
    audible = !audible;
    if (audible) {
      command('unMute');
      command('setVolume', [100]);
      command('playVideo');
    } else command('mute');
    sound.setAttribute('aria-pressed', String(audible));
    sound.textContent = audible ? 'sound off' : 'sound on';
  });
  let playing = true;
  play?.addEventListener('click', () => {
    playing = !playing;
    command(playing ? 'playVideo' : 'pauseVideo');
    play.textContent = playing ? 'pause' : 'play';
    play.setAttribute('aria-pressed', String(playing));
    play.setAttribute('aria-label', playing ? 'pause video' : 'play video');
  });
})();

// Soar of the Simurgh: sound and playback without resetting the YouTube iframe.
(() => {
  const frame = document.querySelector('#simurgh-hero-youtube');
  const sound = document.querySelector('#simurgh-sound-toggle');
  const play = document.querySelector('#simurgh-play-toggle');
  if (!frame || !sound || !play) return;
  const command = (func, args = []) => frame.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args }), 'https://www.youtube-nocookie.com'
  );
  let audible = false;
  sound.addEventListener('click', () => {
    audible = !audible;
    if (audible) { command('unMute'); command('setVolume', [100]); command('playVideo'); }
    else command('mute');
    sound.setAttribute('aria-pressed', String(audible));
    sound.textContent = audible ? 'sound off' : 'sound on';
  });
  let playing = true;
  play.addEventListener('click', () => {
    playing = !playing;
    command(playing ? 'playVideo' : 'pauseVideo');
    play.textContent = playing ? 'pause' : 'play';
    play.setAttribute('aria-pressed', String(playing));
    play.setAttribute('aria-label', playing ? 'pause video' : 'play video');
  });
})();

// doux: matching YouTube sound and playback controls, without reloading the video.
(() => {
 const frame=document.querySelector('#doux-hero-youtube');
 const sound=document.querySelector('#doux-sound-toggle');
 const play=document.querySelector('#doux-play-toggle');
 if(!frame||!sound||!play)return;
 const command=(func,args=[])=>frame.contentWindow?.postMessage(JSON.stringify({event:'command',func,args}),'https://www.youtube-nocookie.com');
 let audible=false,playing=true;
 sound.addEventListener('click',()=>{
  audible=!audible;
  if(audible){command('unMute');command('setVolume',[100]);command('playVideo');}
  else command('mute');
  sound.textContent=audible?'sound off':'sound on';
  sound.setAttribute('aria-pressed',String(audible));
 });
 play.addEventListener('click',()=>{
  playing=!playing;command(playing?'playVideo':'pauseVideo');
  play.textContent=playing?'pause':'play';
  play.setAttribute('aria-pressed',String(playing));
  play.setAttribute('aria-label',playing?'pause video':'play video');
 });
})();

// v38: visible progress fill and request best available YouTube quality (YouTube ultimately decides).
document.querySelectorAll('.custom-player .seek').forEach(seek=>{
 const player=seek.closest('.custom-player');const audio=player?.querySelector('audio');
 const paint=()=>seek.style.setProperty('--progress',`${Math.min(100,Math.max(0,Number(seek.value)||0))}%`);
 seek.addEventListener('input',paint);audio?.addEventListener('timeupdate',paint);audio?.addEventListener('loadedmetadata',paint);paint();
});
(() => {
 const frame=document.querySelector('#doux-hero-youtube');if(!frame)return;
 const quality=()=>frame.contentWindow?.postMessage(JSON.stringify({event:'command',func:'setPlaybackQuality',args:['hd1080']}),'https://www.youtube-nocookie.com');
 frame.addEventListener('load',()=>{quality()});
})();
