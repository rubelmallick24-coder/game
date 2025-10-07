/* RBL GameHub — script.js
   - Banner slider (autoplay + manual)
   - Top sections horizontal scroll (touch friendly)
   - Stats counters
   - Mobile menu toggle
   - openGame helper (Telegram.WebApp aware)
*/

// ===== Mobile menu toggle =====
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle && menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// ===== Banner slider =====
(function(){
  const slider = document.getElementById('bannerSlider');
  const slides = Array.from(slider.querySelectorAll('.banner-slide'));
  const prevBtn = document.getElementById('bannerPrev');
  const nextBtn = document.getElementById('bannerNext');
  const dotsWrap = document.getElementById('bannerDots');
  let index = 0;
  let timer = null;
  const INTERVAL = 5000;

  // create dots
  slides.forEach((s, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i+1));
    dot.addEventListener('click', () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
  });

  function update() {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    update();
  }
  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }

  nextBtn && nextBtn.addEventListener('click', () => { next(); restart(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); restart(); });

  function start(){
    timer = setInterval(next, INTERVAL);
  }
  function stop(){ if(timer) clearInterval(timer); }
  function restart(){ stop(); start(); }

  // swipe support for mobile
  let startX = 0, isDown = false;
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDown = true;
    stop();
  }, {passive:true});
  slider.addEventListener('touchmove', (e) => {
    if(!isDown) return;
    const diff = e.touches[0].clientX - startX;
    if(Math.abs(diff) > 50){
      if(diff < 0) next(); else prev();
      isDown = false;
    }
  }, {passive:true});
  slider.addEventListener('touchend', () => { isDown = false; restart(); });

  // init
  update();
  start();
})();

// ===== Top sections horizontal scroll touch/drag (improves mobile experience) =====
(function(){
  const container = document.getElementById('sectionsRow');
  if(!container) return;
  let isDown = false, startX, scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('active-drag');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });
  container.addEventListener('mouseleave', () => { isDown = false; container.classList.remove('active-drag'); });
  container.addEventListener('mouseup', () => { isDown = false; container.classList.remove('active-drag'); });
  container.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.2;
    container.scrollLeft = scrollLeft - walk;
  });

  // touch scroll is native — no need to do extra
})();

// ===== Stats counter when visible =====
(function(){
  const nums = document.querySelectorAll('.stat-number');
  if(!nums.length) return;
  const options = { threshold: 0.5 };
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        nums.forEach(el => animateNumber(el, el.dataset.target));
        observer.disconnect();
      }
    });
  }, options);
  const target = document.querySelector('.stats-inner');
  if(target) obs.observe(target);

  function animateNumber(el, target){
    const isFloat = String(target).includes('.');
    const total = parseFloat(target);
    let current = 0;
    const duration = 1400;
    const start = performance.now();
    requestAnimationFrame(function step(ts){
      const progress = Math.min((ts - start) / duration, 1);
      const val = progress * total;
      el.textContent = isFloat ? (Math.round(val*10)/10) : Math.floor(val).toLocaleString();
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? total : Math.floor(total).toLocaleString();
    });
  }
})();

// ===== openGame helper (Telegram WebApp aware) =====
function openGame(link){
  // If inside Telegram WebApp use its openLink method, otherwise normal navigation
  try {
    if(window.Telegram && Telegram.WebApp && typeof Telegram.WebApp.openLink === 'function'){
      Telegram.WebApp.openLink(link);
      return;
    }
  } catch(e){ /* ignore */ }
  // fallback: open in new tab
  window.open(link, '_blank', 'noopener');
}
