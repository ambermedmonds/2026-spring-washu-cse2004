// All room information lives in this object so the page can render dynamically.
// Each hotspot's x and y values mark the Smiski's belly point.
const rooms = {
  bedroom: {
    title: "BEDROOM",
    seriesName: "Bed Series",
    seriesUrl: "https://smiski.com/e/products/bed-series/",
    image: "images/bedroom.png",
    alt: "A cozy bedroom filled with hidden Smiski characters",
    hotspots: [
      {
        id: "before-rest",
        x: 28.5,
        y: 49,
        width: 9,
        height: 19,
        name: "SMISKI before rest",
        description: "This Smiski gets ready for bed with a quiet book and a sleepy little nightcap.",
        personality: "Calm, prepared, and gently curious",
        favoriteSpot: "On the left side of the bed before lights out",
      },
      {
        id: "co-sleeping",
        x: 44,
        y: 48,
        width: 14,
        height: 10,
        name: "SMISKI co-sleeping",
        description: "This Smiski naps beside a tiny companion and turns the bed into a cozy shared hideout.",
        personality: "Tender, relaxed, and protective",
        favoriteSpot: "Between the bedroom pillows",
      },
      {
        id: "reading",
        x: 46.5,
        y: 70.5,
        width: 9,
        height: 20,
        name: "SMISKI reading",
        description: "This Smiski settles in with a book and quietly disappears into the story.",
        personality: "Focused, thoughtful, and peaceful",
        favoriteSpot: "The round rug by the bed",
      },
      {
        id: "fussing",
        x: 14.3,
        y: 77.3,
        width: 10,
        height: 20,
        name: "SMISKI fussing",
        description: "This Smiski covers its face when bedtime feels a little too dramatic.",
        personality: "Bashful, expressive, and easily flustered",
        favoriteSpot: "Beside the tiny house shoes",
      },
      {
        id: "sleepy",
        x: 70.5,
        y: 50.5,
        width: 8,
        height: 22,
        name: "SMISKI Sleepy",
        description: "This Smiski hugs its pillow and yawns like it has been waiting all day for bedtime.",
        personality: "Drowsy, soft-hearted, and dreamy",
        favoriteSpot: "Near the closet doorway",
      },
      {
        id: "at-sleep",
        x: 68,
        y: 76,
        width: 18,
        height: 11,
        name: "SMISKI at sleep",
        description: "This Smiski is fully tucked into dream mode and can sleep almost anywhere.",
        personality: "Peaceful, cozy, and deeply relaxed",
        favoriteSpot: "The open wooden floor",
      },
    ],
  },
  bathroom: {
    title: "BATHROOM",
    seriesName: "Bath Series",
    seriesUrl: "https://smiski.com/e/products/bath-series/",
    image: "images/bathroom.png",
    alt: "A bright bathroom filled with hidden blue Smiski characters",
    hotspots: [
      {
        id: "shampooing",
        x: 14,
        y: 64,
        width: 10,
        height: 22,
        name: "Smiski Shampooing",
        description: "Smiski trying to copy how to shampoo while sitting in the corner.",
        personality: "Curious, careful, and quietly determined",
        favoriteSpot: "Inside the glass shower",
      },
      {
        id: "not-looking",
        x: 37,
        y: 58,
        width: 9,
        height: 24,
        name: "Smiski Not Looking",
        description: "Very shy Smiski that doesn't know where to look but sometime sneaks through the hands.",
        personality: "Shy, bashful, and secretly observant",
        favoriteSpot: "Behind the shower door",
      },
      {
        id: "dazed",
        x: 47.5,
        y: 77,
        width: 12,
        height: 17,
        name: "Smiski Dazed",
        description: "A Smiski relaxing and enjoying the bath. Maybe it stayed too much inside the hot tub and became slim.",
        personality: "Dreamy, relaxed, and a little overheated",
        favoriteSpot: "The bath mat",
      },
      {
        id: "scrubbing",
        x: 70,
        y: 82,
        width: 16,
        height: 22,
        name: "Smiski Scrubbing",
        description: "Smiski that loves to scrub each other. It seems that it will continue until Smiski Little is satisfied.",
        personality: "Helpful, persistent, and gently fussy",
        favoriteSpot: "In front of the vanity",
      },
      {
        id: "with-duck",
        x: 80,
        y: 64,
        width: 9,
        height: 18,
        name: "Smiski With Duck",
        description: "A Smiski that wants to play with Duck in the bath tub but scared to do so. Looks little bit sad.",
        personality: "Tender, cautious, and quietly hopeful",
        favoriteSpot: "On top of the toilet",
      },
      {
        id: "looking",
        x: 95,
        y: 80,
        width: 5,
        height: 26,
        name: "Smiski Looking",
        description: "A Smiski that saw bath room for the first time and is very surprised. Thinks that it is biggest discovery of this century.",
        personality: "Surprised, wide-eyed, and wonderfully dramatic",
        favoriteSpot: "The far right wall corner",
      },
    ],
  },
  gym: {
    title: "GYM",
    seriesName: "Exercising Series",
    seriesUrl: "https://smiski.com/e/products/exercising-series/",
    image: "images/gym.png",
    alt: "A home gym filled with active Smiski characters",
    hotspots: [
      {
        id: "hoop",
        x: 11.5,
        y: 64,
        width: 12,
        height: 22,
        name: "SMISKI Hoop",
        description: "SMISKI hooping. SMISKI is having fun and breaking a sweat.",
        personality: "Playful, energetic, and proudly sweaty",
        favoriteSpot: "Beside the leafy plant",
      },
      {
        id: "aerobics",
        x: 46,
        y: 65,
        width: 17,
        height: 16,
        name: "SMISKI Aerobics",
        description: "SMISKI is doing aerobics. Let's work out! One two, One two...",
        personality: "Peppy, motivated, and full of rhythm",
        favoriteSpot: "The workout bench",
      },
      {
        id: "doing-crunches",
        x: 29,
        y: 57,
        width: 11,
        height: 18,
        name: "SMISKI Doing Crunches",
        description: "SMISKI is working his ads. Do you think his muffin top is cute?",
        personality: "Determined, self-conscious, and charmingly committed",
        favoriteSpot: "The treadmill belt",
      },
      {
        id: "dumbbell",
        x: 64,
        y: 58,
        width: 10,
        height: 18,
        name: "SMISKI Dumbbell",
        description: "SMISKI is doing weight training. It is too heavy to lift!",
        personality: "Ambitious, strained, and stubbornly brave",
        favoriteSpot: "Near the green barbell",
      },
      {
        id: "balance",
        x: 86.5,
        y: 57,
        width: 11,
        height: 17,
        name: "Little SMISKI Balance",
        description: "Little SMISKI is on a balance ball. Do you want to train your core?",
        personality: "Balanced, focused, and tiny but mighty",
        favoriteSpot: "On the exercise ball",
      },
      {
        id: "stretch",
        x: 75,
        y: 79.5,
        width: 12,
        height: 18,
        name: "SMISKI Stretch",
        description: "SMISKI is doing stretches. Stretching is very important before exercise!",
        personality: "Calm, flexible, and health-conscious",
        favoriteSpot: "The green yoga mat",
      },
    ],
  },
  closet: {
    title: "CLOSET",
    seriesName: "Dressing Series",
    seriesUrl: "https://smiski.com/e/products/dressing-series/",
    image: "images/closet.png",
    alt: "A warm walk-in closet filled with hidden Smiski characters",
    hotspots: [
      {
        id: "underpants",
        x: 17,
        y: 67,
        width: 13,
        height: 27,
        name: "SMISKI Underpants",
        description: "SMISKI is putting on underpants. He is embarrassed, so he is sneaking around so he can't be seen.",
        personality: "Embarrassed, sneaky, and bashful",
        favoriteSpot: "Beside the low shoe shelf",
      },
      {
        id: "struggling",
        x: 39,
        y: 60,
        width: 15,
        height: 17,
        name: "SMISKI Struggling",
        description: "A sad SMISKI who is trying on a sweater but can't get his head through.",
        personality: "Sad, stuck, and trying his best",
        favoriteSpot: "Inside the green hoodie",
      },
      {
        id: "loose-pants",
        x: 52.5,
        y: 56,
        width: 10,
        height: 22,
        name: "SMISKI Loose Pants",
        description: "SMISKI is at a loss because his pants are too big.",
        personality: "Confused, discouraged, and quietly funny",
        favoriteSpot: "In front of the shoe cubbies",
      },
      {
        id: "putting-on-socks",
        x: 70,
        y: 60,
        width: 12,
        height: 20,
        name: "SMISKI Putting On Socks",
        description: "SMISKI is putting on socks. He can't wear them well because he is wobbling standing on one leg.",
        personality: "Wobbly, focused, and persistent",
        favoriteSpot: "By the closet door",
      },
      {
        id: "sweater",
        x: 86,
        y: 67,
        width: 11,
        height: 24,
        name: "SMISKI Sweater",
        description: "SMISKI is trying on a sweater. Will it fit?",
        personality: "Hopeful, cozy, and uncertain",
        favoriteSpot: "Under the hanging shirts",
      },
      {
        id: "tight-pants",
        x: 72,
        y: 81,
        width: 18,
        height: 18,
        name: "SMISKI Tight Pants",
        description: "SMISKI is trying on tight pants. He's desperately trying to get them on!",
        personality: "Determined, strained, and dramatic",
        favoriteSpot: "On the round closet rug",
      },
    ],
  },
  office: {
    title: "OFFICE",
    seriesName: "Work Series",
    seriesUrl: "https://smiski.com/e/products/work-series/",
    image: "images/office.png",
    alt: "A cozy home office filled with hidden Smiski characters",
    hotspots: [
      {
        id: "group-think",
        x: 14,
        y: 77,
        width: 23,
        height: 20,
        name: "SMISKI Group Think",
        description: "SMISKI are deliberating in the meeting. They think that three heads are better than one!",
        personality: "Collaborative, thoughtful, and adorably serious",
        favoriteSpot: "With the office floor team",
      },
      {
        id: "approving",
        x: 28,
        y: 50,
        width: 9,
        height: 18,
        name: "SMISKI Approving",
        description: "SMISKI praises your work from the corner. He is good at complimenting everything.",
        personality: "Encouraging, approving, and wonderfully supportive",
        favoriteSpot: "On the desktop",
      },
      {
        id: "researching",
        x: 61,
        y: 52,
        width: 9,
        height: 15,
        name: "SMISKI Researching",
        description: "SMISKI is searching for something on his computer. He has trouble hitting the keys.",
        personality: "Curious, focused, and a little clumsy",
        favoriteSpot: "Next to the desk organizer",
      },
      {
        id: "good-idea",
        x: 76.5,
        y: 43,
        width: 9,
        height: 16,
        name: "SMISKI Good Idea",
        description: "SMISKI is inspired. The light bulb means he has a good idea.",
        personality: "Inventive, bright, and quietly proud",
        favoriteSpot: "On the bookshelf stack",
      },
      {
        id: "on-the-rord",
        x: 73,
        y: 68,
        width: 11,
        height: 17,
        name: "SMISKI On the Rord",
        description: "SMISKI hurries to work. He pretends to be an executive although he is often late.",
        personality: "Busy, ambitious, and always rushing",
        favoriteSpot: "Near the filing drawers",
      },
      {
        id: "presenting",
        x: 82,
        y: 87,
        width: 10,
        height: 22,
        name: "SMISKI Presenting",
        description: "SMISKI is presenting. He likes to explain to the group but he's always nervous.",
        personality: "Nervous, expressive, and bravely prepared",
        favoriteSpot: "The right edge of the rug",
      },
    ],
  },
};

const homeScreen = document.querySelector("#home-screen");
const roomScreen = document.querySelector("#room-screen");
const navLogo = document.querySelector(".nav-logo");
const startButton = document.querySelector("#start-button");
const roomHomeButton = document.querySelector("#room-home-button");
const previousRoomButton = document.querySelector("#previous-room-button");
const nextRoomButton = document.querySelector("#next-room-button");
const houseStage = document.querySelector("#house-stage");
const roomStage = document.querySelector("#room-stage");
const roomTitle = document.querySelector("#room-title");
const roomImage = document.querySelector("#room-image");
const roomHotspots = document.querySelector("#room-hotspots");
const roomSeriesLink = document.querySelector("#room-series-link");
const popupOverlay = document.querySelector("#popup-overlay");
const closePopup = document.querySelector("#close-popup");
const saveButton = document.querySelector("#save-button");
const popupTitle = document.querySelector("#popup-title");
const popupDescription = document.querySelector("#popup-description");
const popupSeries = document.querySelector("#popup-series");
const popupPersonality = document.querySelector("#popup-personality");
const modeLabel = document.querySelector("#mode-label");
const currentTimeLabel = document.querySelector("#current-time");
const modeToggle = document.querySelector("#mode-toggle");
const openSavedButton = document.querySelector("#open-saved");
const closeSavedButton = document.querySelector("#close-saved");
const savedDrawer = document.querySelector("#saved-drawer");
const savedList = document.querySelector("#saved-list");

let currentMode = getModeFromTime();
let activeRoomId = "bedroom";
let activeProductId = "";
const roomOrder = Object.keys(rooms);
const legacyProductIds = {
  "sleepy-reader": "before-rest",
  "pillow-napper": "co-sleeping",
  "rug-reader": "reading",
  "shoe-hider": "fussing",
  "door-dreamer": "sleepy",
  "floor-lounger": "at-sleep",
  "shower-thinker": "shampooing",
  "glass-peeker": "not-looking",
  "bath-mat-buddy": "dazed",
  "tiny-helper": "scrubbing",
  "toilet-waver": "with-duck",
  "corner-peeker": "looking",
  "hula-hero": "hoop",
  "treadmill-tumbler": "aerobics",
  "bench-star": "doing-crunches",
  "barbell-buddy": "dumbbell",
  "balance-ball": "balance",
  "mat-meditator": "stretch",
  "shelf-scout": "underpants",
  "hoodie-hideout": "struggling",
  "pants-planner": "loose-pants",
  "sock-sitter": "putting-on-socks",
  "hanger-hugger": "sweater",
  "rug-recliner": "tight-pants",
  "plant-meeting": "group-think",
  "team-listener": "group-think",
  "idea-keeper": "group-think",
  "desk-waver": "approving",
  "laptop-learner": "researching",
  "shelf-thinker": "good-idea",
  "clipboard-runner": "on-the-rord",
  "corner-presenter": "presenting",
};
const WEATHER_API_URL = "https://cse2004.com/api/weather?latitude=38.627&longitude=-90.199";
const DAYLIGHT_API_URL = "https://api.sunrise-sunset.org/json?lat=38.627&lng=-90.199&formatted=0";
const DAYLIGHT_REFRESH_MS = 15 * 60 * 1000;
const savedProducts = new Set(migrateSavedProducts(JSON.parse(localStorage.getItem("savedSmiskis") || "[]")));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const productsById = buildProductIndex();
let draggedSavedItem = null;
let didDragSavedItem = false;
let savedDrawerItemIds = [];

function getModeFromTime() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 18 ? "day" : "night";
}

function applyMode(mode) {
  currentMode = mode;
  document.body.classList.toggle("night-mode", mode === "night");
  modeLabel.textContent = mode === "night" ? "Night Mode" : "Day Mode";
  modeToggle.setAttribute("aria-pressed", mode === "night");
  modeToggle.setAttribute("aria-label", mode === "night" ? "Switch to day mode" : "Switch to night mode");
}

function updateCurrentTime() {
  currentTimeLabel.textContent = new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function isBetweenSunriseAndSunset(daylight, currentDate = new Date()) {
  const sunrise = daylight?.results?.sunrise ? new Date(daylight.results.sunrise) : null;
  const sunset = daylight?.results?.sunset ? new Date(daylight.results.sunset) : null;

  if (!sunrise || !sunset || Number.isNaN(sunrise.valueOf()) || Number.isNaN(sunset.valueOf())) {
    return null;
  }

  return currentDate >= sunrise && currentDate < sunset;
}

async function updateModeFromSunriseSunset() {
  try {
    const weatherResponse = await fetch(WEATHER_API_URL);

    if (!weatherResponse.ok) {
      throw new Error("Weather API request failed");
    }

    const weather = await weatherResponse.json();
    const daylightResponse = await fetch(DAYLIGHT_API_URL);

    if (!daylightResponse.ok) {
      throw new Error("Daylight API request failed");
    }

    const daylight = await daylightResponse.json();
    const isDaylight = isBetweenSunriseAndSunset(daylight);

    if (isDaylight === null) {
      applyMode(weather.isDaytime ? "day" : "night");
      return;
    }

    applyMode(isDaylight ? "day" : "night");
  } catch (error) {
    applyMode(getModeFromTime());
  }
}

function showHome() {
  closeInfoCard();
  document.body.classList.add("has-started");

  if (!roomScreen.classList.contains("is-active")) {
    homeScreen.classList.add("is-active");
    homeScreen.classList.remove("intro-mode");
    homeScreen.classList.add("house-mode");
    return;
  }

  roomScreen.classList.add("is-zooming-out");

  window.setTimeout(() => {
    roomScreen.classList.remove("is-active", "is-zooming-out", "is-zooming-in");
    homeScreen.classList.add("is-active");
    homeScreen.classList.remove("intro-mode");
    homeScreen.classList.add("house-mode");
  }, prefersReducedMotion ? 0 : 240);
}

function showCover() {
  closeInfoCard();
  savedDrawer.classList.remove("is-open");
  savedDrawerItemIds = [];
  document.body.classList.remove("has-started");
  roomScreen.classList.remove("is-active", "is-zooming-out", "is-zooming-in");
  homeScreen.classList.add("is-active", "intro-mode");
  homeScreen.classList.remove("house-mode");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showRoom(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  activeRoomId = roomId;
  roomTitle.textContent = room.title;
  roomImage.src = room.image;
  roomImage.alt = room.alt;
  roomSeriesLink.href = room.seriesUrl;
  roomSeriesLink.textContent = `Shop ${room.seriesName}`;
  renderRoomHotspots(room);

  homeScreen.classList.remove("is-active");
  roomScreen.classList.add("is-active");
  roomScreen.classList.remove("is-zooming-in", "is-zooming-out");
  void roomScreen.offsetWidth;
  roomScreen.classList.add("is-zooming-in");
  window.setTimeout(() => {
    roomScreen.classList.remove("is-zooming-in");
  }, prefersReducedMotion ? 0 : 720);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAdjacentRoom(direction) {
  const currentIndex = roomOrder.indexOf(activeRoomId);
  const nextIndex = (currentIndex + direction + roomOrder.length) % roomOrder.length;
  showRoom(roomOrder[nextIndex]);
}

function renderRoomHotspots(room) {
  roomHotspots.innerHTML = "";

  room.hotspots.forEach((hotspot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = activeRoomId === "bathroom" ? "room-hotspot bath-hotspot" : "room-hotspot";
    button.setAttribute("aria-label", `Learn about ${hotspot.name}`);
    button.dataset.label = hotspot.name;
    button.style.setProperty("--x", `${hotspot.x}%`);
    button.style.setProperty("--y", `${hotspot.y}%`);
    button.style.setProperty("--w", `${hotspot.width}%`);
    button.style.setProperty("--h", `${hotspot.height}%`);

    button.addEventListener("click", () => {
      playDiscoveryBurst(button);
      window.setTimeout(() => showSmiskiCard(hotspot), prefersReducedMotion ? 0 : 220);
    });
    roomHotspots.appendChild(button);
  });
}

function playDiscoveryBurst(button) {
  if (prefersReducedMotion) return;

  button.querySelectorAll(".sparkle-burst").forEach((sparkle) => sparkle.remove());

  for (let i = 0; i < 10; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle-burst";
    sparkle.style.setProperty("--angle", `${i * 36}deg`);
    sparkle.style.animationDelay = `${i * 12}ms`;
    button.appendChild(sparkle);
    sparkle.addEventListener("animationend", () => sparkle.remove());
  }
}

function showSmiskiCard(hotspot) {
  const room = rooms[activeRoomId];
  activeProductId = hotspot.id;

  popupTitle.textContent = hotspot.name;
  popupDescription.textContent = hotspot.description;
  popupSeries.textContent = room.seriesName;
  popupPersonality.textContent = hotspot.personality;
  updateSaveButton();
  popupOverlay.hidden = false;
}

function showComingSoon(roomName) {
  popupTitle.textContent = roomName;
  popupDescription.textContent = `${roomName} products are still being added. Check back soon for more series details.`;
  popupPersonality.textContent = "Mysterious";
  popupOverlay.hidden = false;
}

function closeInfoCard() {
  popupOverlay.hidden = true;
}

function migrateSavedProducts(savedIds) {
  let changed = false;
  const migratedIds = savedIds.map((id) => {
    const migratedId = legacyProductIds[id] || id;
    changed = changed || migratedId !== id;
    return migratedId;
  });
  const uniqueIds = [...new Set(migratedIds)];

  if (changed || uniqueIds.length !== savedIds.length) {
    localStorage.setItem("savedSmiskis", JSON.stringify(uniqueIds));
  }

  return uniqueIds;
}

startButton.addEventListener("click", () => {
  document.body.classList.add("has-started");
  homeScreen.classList.remove("intro-mode");
  homeScreen.classList.add("house-mode");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

roomHomeButton.addEventListener("click", showHome);
previousRoomButton.addEventListener("click", () => showAdjacentRoom(-1));
nextRoomButton.addEventListener("click", () => showAdjacentRoom(1));
navLogo.addEventListener("click", (event) => {
  event.preventDefault();
  showCover();
});
closePopup.addEventListener("click", closeInfoCard);
saveButton.addEventListener("click", toggleSavedProduct);
openSavedButton.addEventListener("click", () => {
  savedDrawerItemIds = [...savedProducts];
  renderSavedList();
  savedDrawer.classList.add("is-open");
});
closeSavedButton.addEventListener("click", () => {
  savedDrawer.classList.remove("is-open");
  savedDrawerItemIds = [];
});

popupOverlay.addEventListener("click", (event) => {
  if (event.target === popupOverlay) {
    closeInfoCard();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeInfoCard();
  }
});

document.querySelectorAll(".house-hotspot").forEach((button) => {
  button.addEventListener("click", () => {
    const roomId = button.dataset.room;

    if (rooms[roomId]) {
      showRoom(roomId);
      return;
    }

    const roomName = button.textContent.trim().toUpperCase();
    showComingSoon(roomName);
  });
});

modeToggle.addEventListener("click", () => {
  applyMode(currentMode === "night" ? "day" : "night");
});

roomStage.addEventListener("pointermove", (event) => {
  const rect = roomStage.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  roomStage.style.setProperty("--flash-x", `${x}%`);
  roomStage.style.setProperty("--flash-y", `${y}%`);
});

roomStage.addEventListener("pointerleave", () => {
  roomStage.style.setProperty("--flash-x", "50%");
  roomStage.style.setProperty("--flash-y", "50%");
});

function toggleSavedProduct() {
  if (!activeProductId) return;

  if (savedProducts.has(activeProductId)) {
    savedProducts.delete(activeProductId);
  } else {
    savedProducts.add(activeProductId);
  }

  persistSavedProducts();
  updateSaveButton();
  renderSavedList();
}

function persistSavedProducts() {
  localStorage.setItem("savedSmiskis", JSON.stringify([...savedProducts]));
}

function updateSaveButton() {
  const isSaved = savedProducts.has(activeProductId);
  saveButton.classList.toggle("is-saved", isSaved);
  saveButton.setAttribute("aria-pressed", isSaved);
  saveButton.innerHTML = `<img src="images/${isSaved ? "filled-heart" : "unfilled-heart"}.png" alt="" aria-hidden="true" />${isSaved ? "Saved" : "Save"}`;
}

function buildProductIndex() {
  const index = {};

  Object.entries(rooms).forEach(([roomId, room]) => {
    room.hotspots.forEach((hotspot) => {
      index[hotspot.id] = {
        ...hotspot,
        roomId,
        roomTitle: room.title,
        roomLabel: toTitleCase(room.title),
        roomImage: room.image,
        thumbnail: getProductThumbnail(hotspot.id, room.image),
        seriesName: room.seriesName,
        seriesUrl: room.seriesUrl,
      };
    });
  });

  return index;
}

function toTitleCase(text) {
  return text.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getProductThumbnail(productId, fallbackImage) {
  const thumbnails = {
    "before-rest": "images/smiski-before-rest.png",
    "co-sleeping": "images/smiski-co-sleeping.png",
    reading: "images/smiski-reading.png",
    fussing: "images/smiski-fussing.png",
    sleepy: "images/smiski-sleepy.png",
    "at-sleep": "images/smiski-at-sleep.png",
    shampooing: "images/smiski-shampooing.png",
    "not-looking": "images/smiski-not-looking.png",
    dazed: "images/smiski-dazed.png",
    scrubbing: "images/smiski-scrubbing.png",
    "with-duck": "images/smiski-with-duck.png",
    looking: "images/smiski-looking.png",
    hoop: "images/smiski-hoop.png",
    aerobics: "images/smiski-aerobics.png",
    "doing-crunches": "images/smiski-doing-crunches.png",
    dumbbell: "images/smiski-dumbbell.png",
    balance: "images/little-smiski-balance.png",
    stretch: "images/smiski-stretch.png",
    underpants: "images/smiski-underpants.png",
    struggling: "images/smiski-struggling.png",
    "loose-pants": "images/smiski-loose-pants.png",
    "putting-on-socks": "images/smiski-putting-on-socks.png",
    sweater: "images/smiski-sweater.png",
    "tight-pants": "images/smiski-tight-pants.png",
    "group-think": "images/little-smiski-group-think.png",
    approving: "images/smiski-approving.png",
    researching: "images/smiski-researching.png",
    "good-idea": "images/smiski-good-idea.png",
    "on-the-rord": "images/smiski-on-the-rord.png",
    presenting: "images/smiski-presenting.png",
  };

  return thumbnails[productId] || fallbackImage;
}

function renderSavedList() {
  const savedItemIds = savedDrawerItemIds.length > 0 ? savedDrawerItemIds : [...savedProducts];
  const savedItems = savedItemIds.map((id) => productsById[id]).filter(Boolean);

  if (savedItems.length === 0) {
    savedList.innerHTML = '<p class="saved-empty">No saved Smiskis yet. Open a product card and tap the heart to add one.</p>';
    return;
  }

  savedList.innerHTML = savedItems
    .map(
      (item) => {
        const isSaved = savedProducts.has(item.id);
        return `
        <article class="saved-item" data-product="${item.id}" data-room="${item.roomId}" draggable="true">
          <button class="saved-favorite-button${isSaved ? " is-saved" : ""}" type="button" aria-label="${isSaved ? "Remove" : "Add"} ${item.name} ${isSaved ? "from" : "to"} saved Smiskis">
            <img src="images/${isSaved ? "filled-heart" : "green-heart"}.png" alt="" aria-hidden="true" />
          </button>
          <img
            class="saved-thumb"
            src="${item.thumbnail}"
            alt="${item.name}"
            tabindex="0"
            role="button"
            aria-label="Open ${item.roomTitle} room"
          />
          <div>
            <h3>${item.name}</h3>
            <p>${item.seriesName} · ${item.roomLabel}</p>
            <a href="${item.seriesUrl}" target="_blank" rel="noopener">View Series</a>
          </div>
        </article>
      `;
      },
    )
    .join("");
}

function syncSavedOrderToDrawer() {
  const orderedSavedIds = savedDrawerItemIds.filter((id) => savedProducts.has(id));
  savedProducts.clear();
  orderedSavedIds.forEach((id) => savedProducts.add(id));
  persistSavedProducts();
}

function clearSavedDropMarkers() {
  savedList.querySelectorAll(".saved-item.is-drop-before, .saved-item.is-drop-after").forEach((item) => {
    item.classList.remove("is-drop-before", "is-drop-after");
  });
}

function reorderSavedProducts(productId, targetProductId, placement = "before") {
  if (!productId || !targetProductId || productId === targetProductId) return;

  const orderedIds = savedDrawerItemIds.length > 0 ? [...savedDrawerItemIds] : [...savedProducts];
  const fromIndex = orderedIds.indexOf(productId);
  let toIndex = orderedIds.indexOf(targetProductId);

  if (fromIndex === -1 || toIndex === -1) return;

  orderedIds.splice(fromIndex, 1);
  if (fromIndex < toIndex) {
    toIndex -= 1;
  }
  if (placement === "after") {
    toIndex += 1;
  }
  orderedIds.splice(toIndex, 0, productId);
  savedDrawerItemIds = orderedIds;
  syncSavedOrderToDrawer();
  renderSavedList();
}

savedList.addEventListener("click", (event) => {
  if (didDragSavedItem) {
    didDragSavedItem = false;
    return;
  }

  const favoriteButton = event.target.closest(".saved-favorite-button");
  if (favoriteButton) {
    const savedItem = favoriteButton.closest(".saved-item");
    if (!savedItem) return;

    const productId = savedItem.dataset.product;
    if (savedProducts.has(productId)) {
      savedProducts.delete(productId);
    } else {
      savedProducts.add(productId);
    }
    syncSavedOrderToDrawer();
    updateSaveButton();
    renderSavedList();
    return;
  }

  if (!event.target.closest(".saved-thumb")) return;

  const savedItem = event.target.closest(".saved-item");
  if (!savedItem) return;

  savedDrawer.classList.remove("is-open");
  savedDrawerItemIds = [];
  showRoom(savedItem.dataset.room);
});

savedList.addEventListener("dragstart", (event) => {
  if (event.target.closest(".saved-favorite-button")) {
    event.preventDefault();
    return;
  }

  const savedItem = event.target.closest(".saved-item");
  if (!savedItem) return;

  draggedSavedItem = savedItem;
  didDragSavedItem = true;
  savedItem.classList.add("is-dragging");
  savedList.classList.add("is-reordering");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", savedItem.dataset.product);
});

savedList.addEventListener("dragover", (event) => {
  const savedItem = event.target.closest(".saved-item");
  if (!savedItem || savedItem === draggedSavedItem) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  clearSavedDropMarkers();

  const itemRect = savedItem.getBoundingClientRect();
  const placement = event.clientY > itemRect.top + itemRect.height / 2 ? "after" : "before";
  savedItem.classList.add(placement === "after" ? "is-drop-after" : "is-drop-before");
});

savedList.addEventListener("dragleave", (event) => {
  const savedItem = event.target.closest(".saved-item");
  if (!savedItem || savedItem.contains(event.relatedTarget)) return;

  savedItem.classList.remove("is-drop-before", "is-drop-after");
});

savedList.addEventListener("drop", (event) => {
  const savedItem = event.target.closest(".saved-item");
  if (!savedItem) return;

  event.preventDefault();
  const placement = savedItem.classList.contains("is-drop-after") ? "after" : "before";
  savedList.classList.remove("is-reordering");
  clearSavedDropMarkers();
  reorderSavedProducts(event.dataTransfer.getData("text/plain"), savedItem.dataset.product, placement);
});

savedList.addEventListener("dragend", () => {
  draggedSavedItem = null;
  savedList.classList.remove("is-reordering");
  savedList.querySelectorAll(".saved-item.is-dragging, .saved-item.is-drop-before, .saved-item.is-drop-after").forEach((item) => {
    item.classList.remove("is-dragging", "is-drop-before", "is-drop-after");
  });
  window.setTimeout(() => {
    didDragSavedItem = false;
  }, 200);
});

savedList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (!event.target.classList.contains("saved-thumb")) return;

  const savedItem = event.target.closest(".saved-item");
  if (!savedItem) return;

  event.preventDefault();
  savedDrawer.classList.remove("is-open");
  showRoom(savedItem.dataset.room);
});

applyMode(currentMode);
updateCurrentTime();
window.setInterval(updateCurrentTime, 60000);
updateModeFromSunriseSunset();
window.setInterval(updateModeFromSunriseSunset, DAYLIGHT_REFRESH_MS);
renderSavedList();
