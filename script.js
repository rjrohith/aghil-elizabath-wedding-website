const loader=document.getElementById('loader');
window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('hidden'),2800));
const header=document.getElementById('siteHeader');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40));
const menuBtn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const target=new Date('2026-08-19T15:30:00+05:30').getTime();
function tick(){const d=Math.max(0,target-Date.now()),s=Math.floor(d/1000);document.getElementById('days').textContent=String(Math.floor(s/86400)).padStart(2,'0');document.getElementById('hours').textContent=String(Math.floor((s%86400)/3600)).padStart(2,'0');document.getElementById('minutes').textContent=String(Math.floor((s%3600)/60)).padStart(2,'0');document.getElementById('seconds').textContent=String(s%60).padStart(2,'0')}tick();setInterval(tick,1000);
const lightbox=document.getElementById('lightbox'),lightboxImage=document.getElementById('lightboxImage');
document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{lightboxImage.src=item.dataset.src;lightbox.showModal()}));
document.getElementById('closeLightbox').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});
document.getElementById('rsvpForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const subject=encodeURIComponent('Wedding RSVP — '+f.get('name'));const body=encodeURIComponent(`Name: ${f.get('name')}\nAttendance: ${f.get('attendance')}\nGuests: ${f.get('guests')}\nMessage: ${f.get('message')||''}`);window.location.href=`mailto:?subject=${subject}&body=${body}`});

// Wedding music and cinematic hero entrance.
const weddingMusic=document.getElementById('weddingMusic');
const musicToggle=document.getElementById('musicToggle');
const beginStory=document.getElementById('beginStory');
let musicStarted=false;

function updateMusicButton(){
  if(!musicToggle||!weddingMusic)return;
  const playing=!weddingMusic.paused;
  musicToggle.classList.toggle('playing',playing);
  musicToggle.setAttribute('aria-pressed',String(playing));
  musicToggle.setAttribute('aria-label',playing?'Pause wedding music':'Play wedding music');
  const label=musicToggle.querySelector('.music-label');
  if(label)label.textContent=playing?'Pause':'Music';
}
async function playWeddingMusic(){
  if(!weddingMusic)return;
  try{weddingMusic.volume=.34;await weddingMusic.play();musicStarted=true;updateMusicButton()}catch(_){updateMusicButton()}
}
if(musicToggle){
  musicToggle.addEventListener('click',async()=>{
    if(weddingMusic.paused)await playWeddingMusic();else{weddingMusic.pause();updateMusicButton()}
  });
}
if(beginStory){
  beginStory.addEventListener('click',async()=>{
    if(!musicStarted)await playWeddingMusic();
    document.getElementById('story')?.scrollIntoView({behavior:'smooth'});
  });
}
const heroHeader=document.getElementById('siteHeader');
function updateHeroHeader(){
  if(!heroHeader)return;
  heroHeader.classList.toggle('is-visible',window.scrollY>window.innerHeight*.56);
}
window.addEventListener('scroll',updateHeroHeader,{passive:true});
window.addEventListener('load',updateHeroHeader);


// Play the featured film silently when it enters view; pause it when it leaves.
const featuredVideo=document.getElementById('featuredVideo');
if(featuredVideo){
  const videoObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){featuredVideo.muted=true;featuredVideo.play().catch(()=>{});}
      else if(!featuredVideo.paused){featuredVideo.pause();}
    });
  },{threshold:.55});
  videoObserver.observe(featuredVideo);
}
