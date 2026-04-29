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
        id: "sleepy-reader",
        x: 30.2,
        y: 52.1,
        width: 9,
        height: 19,
        name: "Sleepy Reader",
        description: "This Smiski likes quiet nights, soft pillows, and books with tiny mysteries.",
        personality: "Calm, thoughtful, and a little shy",
        favoriteSpot: "On the left side of the bed",
      },
      {
        id: "pillow-napper",
        x: 48.6,
        y: 45.9,
        width: 14,
        height: 10,
        name: "Pillow Napper",
        description: "A dreamy Smiski who believes every blanket is a perfect hiding place.",
        personality: "Sleepy, sweet, and gentle",
        favoriteSpot: "Between the bedroom pillows",
      },
      {
        id: "rug-reader",
        x: 47.2,
        y: 74.2,
        width: 9,
        height: 16,
        name: "Rug Reader",
        description: "This little friend studies picture books while guarding the softest rug.",
        personality: "Curious, focused, and loyal",
        favoriteSpot: "The round rug by the bed",
      },
      {
        id: "shoe-hider",
        x: 14.3,
        y: 77.3,
        width: 10,
        height: 20,
        name: "Shoe Hider",
        description: "A bashful Smiski who hides near slippers whenever the room gets busy.",
        personality: "Nervous, tender, and observant",
        favoriteSpot: "Beside the tiny house shoes",
      },
      {
        id: "door-dreamer",
        x: 72.2,
        y: 48.5,
        width: 8,
        height: 22,
        name: "Door Dreamer",
        description: "This Smiski waits by the doorway, wondering what adventure comes next.",
        personality: "Hopeful, dramatic, and patient",
        favoriteSpot: "Near the closet doorway",
      },
      {
        id: "floor-lounger",
        x: 67,
        y: 77,
        width: 14,
        height: 11,
        name: "Floor Lounger",
        description: "A relaxed Smiski who turns every floorboard into a vacation spot.",
        personality: "Easygoing, playful, and mellow",
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
        id: "shower-thinker",
        x: 14,
        y: 53,
        width: 10,
        height: 21,
        name: "Shower Thinker",
        description: "This Smiski gets its best ideas while listening to gentle water sounds.",
        personality: "Puzzled, poetic, and careful",
        favoriteSpot: "Inside the glass shower",
      },
      {
        id: "glass-peeker",
        x: 39,
        y: 54,
        width: 9,
        height: 22,
        name: "Glass Peeker",
        description: "A shy Smiski who checks whether bath time is safe before stepping out.",
        personality: "Timid, watchful, and polite",
        favoriteSpot: "Behind the shower door",
      },
      {
        id: "bath-mat-buddy",
        x: 50,
        y: 68,
        width: 12,
        height: 17,
        name: "Bath Mat Buddy",
        description: "This Smiski sits exactly where the floor is warmest and refuses to move.",
        personality: "Steady, cozy, and practical",
        favoriteSpot: "The bath mat",
      },
      {
        id: "tiny-helper",
        x: 72,
        y: 73,
        width: 16,
        height: 18,
        name: "Tiny Helper",
        description: "A caring pair that reminds everyone to wash up and slow down.",
        personality: "Helpful, earnest, and kind",
        favoriteSpot: "In front of the vanity",
      },
      {
        id: "toilet-waver",
        x: 84,
        y: 60,
        width: 9,
        height: 18,
        name: "Toilet Waver",
        description: "This Smiski greets visitors from the most unexpected seat in the room.",
        personality: "Friendly, surprised, and bold",
        favoriteSpot: "On top of the toilet",
      },
      {
        id: "corner-peeker",
        x: 98,
        y: 67,
        width: 5,
        height: 19,
        name: "Corner Peeker",
        description: "Only half visible, this Smiski specializes in dramatic entrances.",
        personality: "Secretive, silly, and theatrical",
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
        id: "hula-hero",
        x: 10,
        y: 65,
        width: 12,
        height: 22,
        name: "Hula Hero",
        description: "This Smiski treats cardio like a dance party and never misses a spin.",
        personality: "Energetic, cheerful, and determined",
        favoriteSpot: "Beside the leafy plant",
      },
      {
        id: "treadmill-tumbler",
        x: 28,
        y: 58,
        width: 11,
        height: 18,
        name: "Treadmill Tumbler",
        description: "A brave Smiski who prefers sitting on treadmills to running on them.",
        personality: "Optimistic, wobbly, and brave",
        favoriteSpot: "The treadmill belt",
      },
      {
        id: "bench-star",
        x: 45,
        y: 65,
        width: 17,
        height: 16,
        name: "Bench Star",
        description: "This Smiski has perfected one very dramatic crunch and is proud of it.",
        personality: "Confident, goofy, and theatrical",
        favoriteSpot: "The workout bench",
      },
      {
        id: "barbell-buddy",
        x: 64,
        y: 64,
        width: 10,
        height: 18,
        name: "Barbell Buddy",
        description: "A tiny lifter with huge ambition and very careful form.",
        personality: "Focused, serious, and encouraging",
        favoriteSpot: "Near the green barbell",
      },
      {
        id: "balance-ball",
        x: 88,
        y: 64,
        width: 11,
        height: 17,
        name: "Balance Ball",
        description: "This Smiski has found the roundest throne in the entire gym.",
        personality: "Proud, balanced, and quietly funny",
        favoriteSpot: "On the exercise ball",
      },
      {
        id: "mat-meditator",
        x: 75,
        y: 82,
        width: 12,
        height: 15,
        name: "Mat Meditator",
        description: "A peaceful Smiski who believes stretching counts as an adventure.",
        personality: "Gentle, patient, and reflective",
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
        id: "shelf-scout",
        x: 16.5,
        y: 72,
        width: 10,
        height: 22,
        name: "Shelf Scout",
        description: "This Smiski quietly patrols the folded sweaters and checks every shoe twice.",
        personality: "Careful, neat, and watchful",
        favoriteSpot: "Beside the low shoe shelf",
      },
      {
        id: "hoodie-hideout",
        x: 39.5,
        y: 65,
        width: 15,
        height: 17,
        name: "Hoodie Hideout",
        description: "A cozy Smiski who believes oversized hoodies are basically portable bedrooms.",
        personality: "Snuggly, dramatic, and warm-hearted",
        favoriteSpot: "Inside the green hoodie",
      },
      {
        id: "pants-planner",
        x: 52.5,
        y: 62,
        width: 10,
        height: 22,
        name: "Pants Planner",
        description: "This Smiski takes outfit choices very seriously and always stands ready.",
        personality: "Organized, serious, and quietly proud",
        favoriteSpot: "In front of the shoe cubbies",
      },
      {
        id: "sock-sitter",
        x: 72,
        y: 68,
        width: 12,
        height: 18,
        name: "Sock Sitter",
        description: "A patient Smiski who can spend an entire afternoon matching one perfect sock.",
        personality: "Patient, practical, and a little puzzled",
        favoriteSpot: "By the closet door",
      },
      {
        id: "hanger-hugger",
        x: 87.5,
        y: 70,
        width: 11,
        height: 22,
        name: "Hanger Hugger",
        description: "This Smiski clings to soft clothes and keeps the hangers company.",
        personality: "Affectionate, shy, and loyal",
        favoriteSpot: "Under the hanging shirts",
      },
      {
        id: "rug-recliner",
        x: 74,
        y: 82,
        width: 16,
        height: 13,
        name: "Rug Recliner",
        description: "A relaxed Smiski who turns the closet rug into a tiny lounge.",
        personality: "Mellow, silly, and unbothered",
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
        id: "plant-meeting",
        x: 6.5,
        y: 79,
        width: 8,
        height: 18,
        name: "Plant Meeting",
        description: "This serious Smiski attends every office meeting from beside the plant.",
        personality: "Focused, quiet, and dependable",
        favoriteSpot: "The left corner by the plant",
      },
      {
        id: "team-listener",
        x: 14,
        y: 80,
        width: 8,
        height: 18,
        name: "Team Listener",
        description: "A thoughtful Smiski who nods along and remembers every tiny detail.",
        personality: "Attentive, gentle, and supportive",
        favoriteSpot: "With the office floor team",
      },
      {
        id: "idea-keeper",
        x: 20.5,
        y: 80,
        width: 8,
        height: 18,
        name: "Idea Keeper",
        description: "This Smiski guards unfinished ideas until they are ready to become plans.",
        personality: "Patient, clever, and observant",
        favoriteSpot: "Beside the desk cabinet",
      },
      {
        id: "desk-waver",
        x: 28,
        y: 54,
        width: 9,
        height: 18,
        name: "Desk Waver",
        description: "A friendly Smiski who cheers on every email, essay, and late-night project.",
        personality: "Encouraging, bright, and helpful",
        favoriteSpot: "On the desktop",
      },
      {
        id: "laptop-learner",
        x: 61,
        y: 58,
        width: 9,
        height: 15,
        name: "Laptop Learner",
        description: "This Smiski likes sitting near the laptop and pretending to understand spreadsheets.",
        personality: "Curious, studious, and easily distracted",
        favoriteSpot: "Next to the desk organizer",
      },
      {
        id: "shelf-thinker",
        x: 76.5,
        y: 46,
        width: 9,
        height: 16,
        name: "Shelf Thinker",
        description: "A glowing idea bulb helps this Smiski solve very small office mysteries.",
        personality: "Inventive, calm, and philosophical",
        favoriteSpot: "On the bookshelf stack",
      },
      {
        id: "clipboard-runner",
        x: 73,
        y: 73,
        width: 11,
        height: 17,
        name: "Clipboard Runner",
        description: "This Smiski dashes between shelves with urgent notes nobody asked for.",
        personality: "Busy, earnest, and a little chaotic",
        favoriteSpot: "Near the filing drawers",
      },
      {
        id: "corner-presenter",
        x: 84.5,
        y: 87,
        width: 10,
        height: 19,
        name: "Corner Presenter",
        description: "A dramatic Smiski who always has one more point to add before the meeting ends.",
        personality: "Expressive, confident, and playful",
        favoriteSpot: "The right edge of the rug",
      },
    ],
  },
};

const homeScreen = document.querySelector("#home-screen");
const roomScreen = document.querySelector("#room-screen");
const startButton = document.querySelector("#start-button");
const backButton = document.querySelector("#back-button");
const houseStage = document.querySelector("#house-stage");
const roomStage = document.querySelector("#room-stage");
const roomTitle = document.querySelector("#room-title");
const roomImage = document.querySelector("#room-image");
const roomHotspots = document.querySelector("#room-hotspots");
const roomBadge = document.querySelector("#room-badge");
const popupOverlay = document.querySelector("#popup-overlay");
const closePopup = document.querySelector("#close-popup");
const popupKicker = document.querySelector("#popup-kicker");
const popupTitle = document.querySelector("#popup-title");
const popupDescription = document.querySelector("#popup-description");
const popupSeries = document.querySelector("#popup-series");
const popupPersonality = document.querySelector("#popup-personality");
const popupSpot = document.querySelector("#popup-spot");
const popupLink = document.querySelector("#popup-link");
const modeLabel = document.querySelector("#mode-label");
const modeToggle = document.querySelector("#mode-toggle");

let currentMode = getModeFromTime();
let activeRoomId = "bedroom";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function showRoom(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  activeRoomId = roomId;
  roomTitle.textContent = room.title;
  roomImage.src = room.image;
  roomImage.alt = room.alt;
  renderRoomHotspots(room);
  updateRoomBadge(roomId);

  homeScreen.classList.remove("is-active");
  roomScreen.classList.add("is-active");
  roomScreen.classList.remove("is-zooming-in", "is-zooming-out");
  void roomScreen.offsetWidth;
  roomScreen.classList.add("is-zooming-in");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderRoomHotspots(room) {
  roomHotspots.innerHTML = "";

  room.hotspots.forEach((hotspot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "room-hotspot";
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

  updateRoomBadge(activeRoomId);

  popupKicker.textContent = room.seriesName;
  popupTitle.textContent = hotspot.name;
  popupDescription.textContent = hotspot.description;
  popupSeries.textContent = room.seriesName;
  popupPersonality.textContent = hotspot.personality;
  popupSpot.textContent = hotspot.favoriteSpot;
  popupLink.href = room.seriesUrl;
  popupLink.textContent = `View ${room.seriesName}`;
  popupOverlay.hidden = false;
}

function showComingSoon(roomName) {
  popupKicker.textContent = "Coming Soon";
  popupTitle.textContent = roomName;
  popupDescription.textContent = `${roomName} products are still being added. Check back soon for more series details.`;
  popupPersonality.textContent = "Mysterious";
  popupSpot.textContent = "Behind a closed door";
  popupOverlay.hidden = false;
}

function closeInfoCard() {
  popupOverlay.hidden = true;
}

startButton.addEventListener("click", () => {
  document.body.classList.add("has-started");
  homeScreen.classList.remove("intro-mode");
  homeScreen.classList.add("house-mode");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

backButton.addEventListener("click", showHome);
closePopup.addEventListener("click", closeInfoCard);

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

function updateRoomBadge(roomId) {
  const room = rooms[roomId];
  roomBadge.textContent = room.seriesName;
  roomBadge.classList.remove("is-complete");
}

applyMode(currentMode);
