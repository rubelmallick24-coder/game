// === Mobile Nav Toggle ===
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
menuToggle.addEventListener("click", () => navMenu.classList.toggle("active"));

// === Slider ===
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle("active", i === index));
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 4000);

// === Stats Counter ===
function animateCounter(id, target) {
  let count = 0;
  const el = document.getElementById(id);
  const step = target / 100;
  const interval = setInterval(() => {
    count += step;
    if (count >= target) {
      clearInterval(interval);
      el.textContent = target.toLocaleString();
    } else {
      el.textContent = Math.floor(count).toLocaleString();
    }
  }, 30);
}

animateCounter("players", 1245327);
animateCounter("gamesPlayed", 3452870);
animateCounter("rating", 4.8);

// === Search Filter ===
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(term) ? "block" : "none";
  });
});

// === Category Filter ===
document.querySelectorAll(".dropdown-content a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const cat = link.dataset.category;
    document.querySelectorAll(".card").forEach(card => {
      card.style.display = (cat === "all" || card.dataset.category === cat) ? "block" : "none";
    });
  });
});

// === Telegram WebApp Support ===
function openGame(link) {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.openLink(link);
  } else {
    window.location.href = link;
  }
}
