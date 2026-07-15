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
document.getElementById('rsvpForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const subject=encodeURIComponent('Wedding RSVP — '+f.get('name'));const body=encodeURIComponent(`Name: ${f.get('name')}\nAttendance: ${f.get('attendance')}\nGuests: ${f.get('guests')}\nMessage: ${f.get('message')||''}`);window.location.href=`mailto:aghiljoy6@gmail.com?subject=${subject}&body=${body}`});

// Wedding music and cinematic hero entrance.
const weddingMusic = document.getElementById('weddingMusic');
const beginStory = document.getElementById('beginStory');
const featuredVideo = document.getElementById('featuredVideo');
const heroHeader = document.getElementById('siteHeader');

let musicStarted = false;
let musicShouldResumeAfterVideo = false;
let fadeTimer = null;

const normalMusicVolume = 0.34;

function fadeAudio(audio, targetVolume, duration = 1200, pauseAtEnd = false) {
  if (!audio) return;

  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }

  const startVolume = audio.volume;
  const difference = targetVolume - startVolume;
  const intervalTime = 50;
  const steps = Math.max(1, Math.round(duration / intervalTime));
  let currentStep = 0;

  fadeTimer = setInterval(() => {
    currentStep += 1;

    const nextVolume =
      startVolume + difference * (currentStep / steps);

    audio.volume = Math.min(1, Math.max(0, nextVolume));

    if (currentStep >= steps) {
      clearInterval(fadeTimer);
      fadeTimer = null;
      audio.volume = targetVolume;

      if (pauseAtEnd && targetVolume === 0) {
        audio.pause();
      }
    }
  }, intervalTime);
}

async function playWeddingMusic() {
  if (!weddingMusic || musicStarted) return;

  try {
    weddingMusic.volume = 0;
    weddingMusic.loop = true;

    await weddingMusic.play();

    musicStarted = true;
    fadeAudio(weddingMusic, normalMusicVolume, 2500);
  } catch (error) {
    console.info(
      'The browser is waiting for user interaction before playing music.',
      error
    );
  }
}

function pauseMusicForVideo() {
  if (!weddingMusic || !musicStarted || weddingMusic.paused) {
    musicShouldResumeAfterVideo = false;
    return;
  }

  musicShouldResumeAfterVideo = true;
  fadeAudio(weddingMusic, 0, 900, true);
}

async function resumeMusicAfterVideo() {
  if (
    !weddingMusic ||
    !musicStarted ||
    !musicShouldResumeAfterVideo
  ) {
    return;
  }

  musicShouldResumeAfterVideo = false;

  try {
    weddingMusic.volume = 0;
    await weddingMusic.play();
    fadeAudio(weddingMusic, normalMusicVolume, 1800);
  } catch (error) {
    console.info('Background music could not resume.', error);
  }
}

if (beginStory) {
  beginStory.addEventListener('click', async () => {
    await playWeddingMusic();

    document
      .getElementById('story')
      ?.scrollIntoView({ behavior: 'smooth' });
  });
}

// Fallback: the first click, tap or key press can start the music.
document.addEventListener('pointerdown', playWeddingMusic, {
  once: true
});

document.addEventListener('keydown', playWeddingMusic, {
  once: true
});

function updateHeroHeader() {
  if (!heroHeader) return;

  heroHeader.classList.toggle(
    'is-visible',
    window.scrollY > window.innerHeight * 0.56
  );
}

window.addEventListener('scroll', updateHeroHeader, {
  passive: true
});

window.addEventListener('load', updateHeroHeader);

// Featured video behaviour.
if (featuredVideo) {
  featuredVideo.addEventListener('play', () => {
    pauseMusicForVideo();
  });

  featuredVideo.addEventListener('pause', () => {
    if (!featuredVideo.ended) {
      resumeMusicAfterVideo();
    }
  });

  featuredVideo.addEventListener('ended', () => {
    resumeMusicAfterVideo();
  });

  // Play muted when the video enters view and pause when it leaves.
  const videoObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          featuredVideo.muted = true;
          featuredVideo.play().catch(() => {});
        } else if (!featuredVideo.paused) {
          featuredVideo.pause();
        }
      });
    },
    { threshold: 0.55 }
  );

  videoObserver.observe(featuredVideo);
}
