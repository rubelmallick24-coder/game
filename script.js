// ===== Counter Animation =====
const counters = document.querySelectorAll('.counter');
let started = false;

function animateCounters() {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / 200;
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 10);
      } else {
        counter.innerText = target + '+';
      }
    };
    updateCount();
  });
}

window.addEventListener('scroll', () => {
  const section = document.querySelector('.stats');
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight && !started) {
    started = true;
    animateCounters();
  } else if (rect.top > window.innerHeight) {
    started = false;
    counters.forEach(c => c.innerText = '0');
  }
});

// ===== Testimonial Slider =====
let index = 0;
const testimonials = document.querySelectorAll('.testimonial');
function showNextTestimonial() {
  testimonials.forEach((t, i) => t.classList.toggle('active', i === index));
  index = (index + 1) % testimonials.length;
}
setInterval(showNextTestimonial, 4000);

// ===== Dark/Light Mode =====
document.getElementById('modeToggle').onclick = () => {
  document.body.classList.toggle('dark');
};
