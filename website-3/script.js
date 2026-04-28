const state = {
  activeZone: null,
  discovered: new Set(),
  lampOn: true,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  lastPointerTime: 0,
  lastPointerX: 0,
  lastPointerY: 0,
};

const scene = document.getElementById("room-scene");
const hero = document.getElementById("hero");
const startButton = document.getElementById("start-exploring");
const zones = document.querySelectorAll(".zone");
const glowkins = document.querySelectorAll(".glowkin");
const drawerObject = document.getElementById("drawer-object");

const infoCard = {
  wrap: document.getElementById("info-card"),
  name: document.getElementById("info-name"),
  trait: document.getElementById("info-trait"),
  spot: document.getElementById("info-spot"),
  line: document.getElementById("info-line"),
  close: document.getElementById("close-zone"),
};

const collectionEls = {
  drawer: document.getElementById("collection-drawer"),
  grid: document.getElementById("collection-grid"),
  counter: document.getElementById("found-counter"),
  openBtn: document.getElementById("open-collection"),
  closeBtn: document.getElementById("close-collection"),
};

const atmoEls = {
  summary: document.getElementById("atmo-summary"),
  city: document.getElementById("atmo-city"),
  time: document.getElementById("atmo-time"),
  weather: document.getElementById("atmo-weather"),
};

const lampToggle = document.getElementById("lamp-toggle");
const flashlight = document.querySelector(".flashlight");
const dustLayer = document.getElementById("dust-layer");
const raindrops = document.getElementById("raindrops");
const plant = document.getElementById("plant-object");

const GLOWKINS = {
  "nimble-nim": {
    name: "Nimble Nim",
    zone: "desk",
    trait: "Shy, lightning-fast",
    spot: "Behind stacked notebooks",
    line: "Nim peeks out while you work, then vanishes if your cursor darts too quickly.",
    behavior: "hide-fast",
  },
  "echo-moss": {
    name: "Echo Moss",
    zone: "bookshelf",
    trait: "Nosy and chatty",
    spot: "Between old adventure novels",
    line: "Echo leans out to wave if you hover gently near the shelf.",
    behavior: "gentle-wave",
  },
  "luma-lull": {
    name: "Luma Lull",
    zone: "bed",
    trait: "Sleepy dreamer",
    spot: "Under the blanket edge",
    line: "Luma glows brightest when the room lamp is off and the night feels quiet.",
    behavior: "lamp-glow",
  },
  "pip-puffle": {
    name: "Pip Puffle",
    zone: "plant",
    trait: "Dramatic performer",
    spot: "Inside the plant leaves",
    line: "Pip only appears after a calm pause, like waiting for the perfect entrance.",
    behavior: "delayed-appear",
  },
  "vela-guard": {
    name: "Vela Guard",
    zone: "drawer",
    trait: "Tiny guardian",
    spot: "Behind the half-open drawer",
    line: "Vela peeks from behind storage boxes and keeps tiny secrets safe.",
    behavior: "peek-drawer",
  },
};

const COLLECTION_ORDER = ["nimble-nim", "echo-moss", "luma-lull", "pip-puffle", "vela-guard"];

function init() {
  // Core boot sequence.
  initializeSceneState();
  buildDust();
  buildRain();
  bindCoreEvents();
  renderCollection();
  loadAtmosphere();
  runIntroMotion();
}

function initializeSceneState() {
  document.body.dataset.lamp = "on";

  // Keep Glowkins hidden until discovery flow starts.
  glowkins.forEach((el) => {
    el.classList.remove("is-visible");
  });
}

function buildDust() {
  if (state.reducedMotion || !dustLayer) return;

  const count = 34;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("span");
    dot.className = "dust";
    dot.style.setProperty("--size", `${Math.random() * 2.8 + 1.2}px`);
    dot.style.setProperty("--x", `${Math.random() * 100}%`);
    dot.style.setProperty("--y", `${Math.random() * 100}%`);
    dot.style.setProperty("--dur", `${Math.random() * 9 + 7}s`);
    dot.style.setProperty("--drift", `${(Math.random() - 0.5) * 26}px`);
    dot.style.animationDelay = `${Math.random() * -10}s`;
    fragment.appendChild(dot);
  }

  dustLayer.appendChild(fragment);
}

function buildRain() {
  if (!raindrops) return;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 28; i += 1) {
    const drop = document.createElement("span");
    drop.className = "raindrop";
    drop.style.setProperty("--x", `${Math.random() * 100}%`);
    drop.style.setProperty("--h", `${Math.random() * 30 + 18}px`);
    drop.style.setProperty("--d", `${Math.random() * 1.4 + 1.1}s`);
    drop.style.setProperty("--delay", `${Math.random() * -2}s`);
    fragment.appendChild(drop);
  }

  raindrops.appendChild(fragment);
}

function bindCoreEvents() {
  startButton?.addEventListener("click", () => {
    document.getElementById("room-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  zones.forEach((zoneButton) => {
    zoneButton.addEventListener("click", () => {
      const zoneId = zoneButton.dataset.zone;
      if (!zoneId) return;
      activateZone(zoneId, zoneButton);
    });
  });

  infoCard.close.addEventListener("click", resetZoneView);

  lampToggle.addEventListener("click", toggleLamp);

  collectionEls.openBtn.addEventListener("click", () => {
    collectionEls.drawer.classList.add("is-open");
  });

  collectionEls.closeBtn.addEventListener("click", () => {
    collectionEls.drawer.classList.remove("is-open");
  });

  // Flashlight and subtle scene parallax.
  document.addEventListener("pointermove", onPointerMove);
  scene?.addEventListener("pointerleave", () => {
    document.documentElement.style.setProperty("--scene-parallax-x", "0px");
    document.documentElement.style.setProperty("--scene-parallax-y", "0px");
  });

  // Book movement microinteraction support.
  document.querySelector(".bookshelf-object")?.addEventListener("mouseenter", () => {
    gsap.to(".shelf-books i", {
      y: (index) => (index % 2 === 0 ? -5 : -2),
      rotation: (index) => (index % 2 === 0 ? -4 : 3),
      duration: 0.25,
      stagger: 0.03,
      ease: "power2.out",
    });
  });

  document.querySelector(".bookshelf-object")?.addEventListener("mouseleave", () => {
    gsap.to(".shelf-books i", {
      y: 0,
      rotation: 0,
      duration: 0.3,
      stagger: 0.02,
      ease: "power2.out",
    });
  });

  // Drawer interaction.
  drawerObject?.addEventListener("click", () => {
    drawerObject.classList.toggle("is-open");
  });

  // Plant sway intensifies on hover.
  plant?.addEventListener("mouseenter", () => {
    document.body.dataset.weather = document.body.dataset.weather === "windy" ? "windy" : document.body.dataset.weather;
  });
}

function onPointerMove(event) {
  const x = event.clientX;
  const y = event.clientY;

  document.documentElement.style.setProperty("--flash-x", `${x}px`);
  document.documentElement.style.setProperty("--flash-y", `${y}px`);

  if (state.reducedMotion || !scene) return;

  const rect = scene.getBoundingClientRect();
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;

  const dx = ((x - rect.left) / rect.width - 0.5) * 10;
  const dy = ((y - rect.top) / rect.height - 0.5) * 10;
  document.documentElement.style.setProperty("--scene-parallax-x", `${dx.toFixed(2)}px`);
  document.documentElement.style.setProperty("--scene-parallax-y", `${dy.toFixed(2)}px`);

  // Nimble Nim hides if cursor speed spikes.
  const now = performance.now();
  const dt = now - state.lastPointerTime;
  if (dt > 0) {
    const dist = Math.hypot(x - state.lastPointerX, y - state.lastPointerY);
    const speed = dist / dt;
    const nim = document.querySelector(".glowkin-nim");
    if (nim && nim.classList.contains("is-visible")) {
      if (speed > 1.6) {
        nim.classList.add("is-hidden-fast");
      } else {
        nim.classList.remove("is-hidden-fast");
      }
    }
  }

  state.lastPointerTime = now;
  state.lastPointerX = x;
  state.lastPointerY = y;
}

// Zone + Glowkin discovery system.
function activateZone(zoneId, zoneButton) {
  state.activeZone = zoneId;

  const glowkinEl = document.querySelector(`.glowkin[data-zone="${zoneId}"]`);
  if (!glowkinEl) return;

  const profile = GLOWKINS[glowkinEl.dataset.glowkin];
  if (!profile) return;

  // Zoom target anchored on selected zone.
  const zoneRect = zoneButton.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const centerX = ((zoneRect.left + zoneRect.width / 2 - sceneRect.left) / sceneRect.width) * 100;
  const centerY = ((zoneRect.top + zoneRect.height / 2 - sceneRect.top) / sceneRect.height) * 100;

  document.documentElement.style.setProperty("--zoom-scale", "1.18");
  document.documentElement.style.setProperty("--zoom-x", `${centerX}%`);
  document.documentElement.style.setProperty("--zoom-y", `${centerY}%`);

  revealGlowkin(glowkinEl, profile);
  updateInfoCard(profile);

  state.discovered.add(glowkinEl.dataset.glowkin);
  renderCollection();
}

function revealGlowkin(glowkinEl, profile) {
  // Reset all other Glowkins for clear focus.
  glowkins.forEach((el) => el.classList.remove("is-visible", "glowkin-waving"));

  if (profile.behavior === "delayed-appear") {
    glowkinEl.classList.remove("is-visible");
    setTimeout(() => {
      if (state.activeZone === profile.zone) {
        glowkinEl.classList.add("is-visible");
      }
    }, 900);
  } else {
    glowkinEl.classList.add("is-visible");
  }

  if (profile.behavior === "gentle-wave") {
    if (!glowkinEl.dataset.gentleBound) {
      let lastX = null;
      let lastY = null;
      let lastT = null;

      glowkinEl.addEventListener("pointermove", (event) => {
        const now = performance.now();
        if (lastX === null || lastY === null || lastT === null) {
          lastX = event.clientX;
          lastY = event.clientY;
          lastT = now;
          return;
        }

        const dt = now - lastT;
        const dist = Math.hypot(event.clientX - lastX, event.clientY - lastY);
        const speed = dt > 0 ? dist / dt : 0;

        // Only wave for slow, gentle hover movement.
        if (speed < 0.22 && !glowkinEl.classList.contains("glowkin-waving")) {
          glowkinEl.classList.add("glowkin-waving");
          setTimeout(() => glowkinEl.classList.remove("glowkin-waving"), 850);
        }

        lastX = event.clientX;
        lastY = event.clientY;
        lastT = now;
      });

      glowkinEl.dataset.gentleBound = "true";
    }
  }

  if (profile.behavior === "peek-drawer") {
    drawerObject?.classList.add("is-open");
    if (typeof gsap !== "undefined") {
      gsap.to(glowkinEl, { x: 10, duration: 0.4, yoyo: true, repeat: 1, ease: "power1.inOut" });
    }
  }
}

function updateInfoCard(profile) {
  infoCard.name.textContent = profile.name;
  infoCard.trait.textContent = profile.trait;
  infoCard.spot.textContent = profile.spot;
  infoCard.line.textContent = profile.line;
}

function resetZoneView() {
  state.activeZone = null;
  document.documentElement.style.setProperty("--zoom-scale", "1");
  glowkins.forEach((el) => el.classList.remove("is-visible", "is-hidden-fast", "glowkin-waving"));
  drawerObject?.classList.remove("is-open");
  infoCard.name.textContent = "Select a zone";
  infoCard.trait.textContent = "—";
  infoCard.spot.textContent = "—";
  infoCard.line.textContent = "Click a room zone to discover who lives there.";
}

function toggleLamp() {
  state.lampOn = !state.lampOn;
  document.body.dataset.lamp = state.lampOn ? "on" : "off";
  lampToggle.textContent = state.lampOn ? "Lamp: On" : "Lamp: Off";
  lampToggle.setAttribute("aria-pressed", String(state.lampOn));
}

// Collection drawer system.
function renderCollection() {
  collectionEls.grid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  COLLECTION_ORDER.forEach((id) => {
    const profile = GLOWKINS[id];
    const found = state.discovered.has(id);

    const card = document.createElement("article");
    card.className = `collection-item ${found ? "" : "locked"}`.trim();

    card.innerHTML = `
      <h3>${found ? profile.name : "Unknown Glowkin"}</h3>
      <p>${found ? profile.trait : "Still hiding in the room."}</p>
      <span class="status">${found ? "Discovered" : "Locked"}</span>
    `;

    fragment.appendChild(card);
  });

  collectionEls.grid.appendChild(fragment);
  collectionEls.counter.textContent = `${state.discovered.size} / ${COLLECTION_ORDER.length} discovered`;
}

// Atmosphere API integration (Open-Meteo).
async function loadAtmosphere() {
  const defaultCity = {
    name: "St. Louis",
    latitude: 38.627,
    longitude: -90.1994,
    timezone: "America/Chicago",
  };

  atmoEls.city.textContent = defaultCity.name;

  const endpoint =
    `https://api.open-meteo.com/v1/forecast?latitude=${defaultCity.latitude}` +
    `&longitude=${defaultCity.longitude}` +
    "&current=temperature_2m,weather_code,wind_speed_10m,cloud_cover,is_day" +
    `&timezone=${encodeURIComponent(defaultCity.timezone)}`;

  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};

    const weatherCode = Number(current.weather_code ?? -1);
    const weatherType = classifyWeather(weatherCode, Number(current.wind_speed_10m ?? 0));
    const phase = classifyTimePhase(String(current.time || ""), Number(current.is_day ?? 1));
    const weatherText = readableWeather(weatherCode, weatherType);

    document.body.dataset.weather = weatherType;
    document.body.dataset.phase = phase;

    // Weather mood changes.
    raindrops.style.opacity = weatherType === "rain" ? "0.9" : "0";

    atmoEls.weather.textContent = weatherText;
    atmoEls.time.textContent = formatClock(String(current.time || ""));
    atmoEls.summary.textContent = buildAtmosphereLine({
      weatherType,
      phase,
      wind: Number(current.wind_speed_10m ?? 0),
      cloud: Number(current.cloud_cover ?? 0),
      temp: Number(current.temperature_2m ?? 0),
    });
  } catch (error) {
    atmoEls.summary.textContent =
      "Weather feed is resting. Running a calm default night scene with soft lamp glow.";
    atmoEls.time.textContent = `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    atmoEls.weather.textContent = "Cloudy";
    document.body.dataset.weather = "cloudy";
    document.body.dataset.phase = "night";
    console.error(error);
  }
}

function classifyWeather(code, windSpeed) {
  if (windSpeed > 25) return "windy";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) return "rain";
  if ([0, 1].includes(code)) return "clear";
  return "cloudy";
}

function readableWeather(code, fallback) {
  const labels = {
    0: "Clear",
    1: "Mostly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Dense Fog",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    80: "Rain Showers",
    81: "Showers",
    82: "Heavy Showers",
    95: "Thunderstorm",
  };

  return labels[code] || fallback;
}

function classifyTimePhase(timeString, isDay) {
  if (!timeString.includes("T")) {
    return isDay ? "evening" : "night";
  }

  const hour = Number(timeString.split("T")[1].split(":")[0]);
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

function formatClock(timeString) {
  if (!timeString.includes("T")) return "--";
  return `${timeString.split("T")[1].slice(0, 5)}`;
}

function buildAtmosphereLine({ weatherType, phase, wind, cloud, temp }) {
  const weatherLine = {
    rain: "Rain outside deepens shadows and paints the window with drifting drops.",
    clear: "Clear skies pull in cool moonlight and a crisp glow around corners.",
    cloudy: "Cloud cover softens contrast for a quiet, muted nighttime mood.",
    windy: "Windy air makes leaves dance while the room keeps a cozy hush.",
  }[weatherType];

  const phaseLine = {
    dawn: "The room is shifting toward dawn tones.",
    evening: "The room is settling into evening calm.",
    night: "The room is in deep-night mode.",
  }[phase];

  return `${weatherLine} ${phaseLine} ${Math.round(temp)}\u00b0C, wind ${Math.round(wind)} km/h, cloud cover ${Math.round(cloud)}%.`;
}

function runIntroMotion() {
  if (state.reducedMotion || typeof gsap === "undefined") return;

  gsap.from(".hero-copy", {
    y: 28,
    opacity: 0,
    duration: 0.85,
    ease: "power2.out",
  });

  gsap.to(".glowkin-peek", {
    y: -8,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(".room-scene", {
    boxShadow: "0 20px 50px rgba(163, 176, 232, 0.24)",
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

init();
