"use strict";

const VALID_CATEGORIES = ["Move", "Refresh", "Rest", "Reset", "Reward"];
const THEME_TIMES = ["morning", "afternoon", "evening", "night"];
const THEME_WEATHERS = ["sunny", "cloudy", "rainy", "snowy", "stormy"];
const THEME_CLASS_NAMES = THEME_TIMES.flatMap((time) =>
  THEME_WEATHERS.map((weather) => `bg-${time}-${weather}`)
);
const SUNSET_PRELUDE_CLASS = "bg-sunset-prelude";
const DEFAULT_THEME_WEATHER_BY_TIME = {
  morning: "sunny",
  afternoon: "cloudy",
  evening: "cloudy",
  night: "cloudy",
};
const LAST_COORDS_STORAGE_KEY = "breakwise_last_coords";
const MANUAL_LOCATION_QUERY_STORAGE_KEY = "breakwise_manual_location_query";
const DEFAULT_FALLBACK_COORDS = {
  latitude: 38.6488,
  longitude: -90.3108,
};
const OPENAI_API_KEY = "7unkijylvj5z";

const STICKER_SOURCES = {
  idle: "images/plant.png",
  dolphin: "images/ghost-sleep.png",
  focus: "images/axolotl-computer.png",
  phone: "images/bear-phone.png",
  nap: "images/koala-sleeping.png",
  stretch: "images/rabbit-stretching.png",
  tea: "images/tea-bag.png",
  recharge: "images/watering-can.png",
  sunny: "images/sun.png",
};

const state = {
  mode: "idle",
  timerId: null,
  clockTimerId: null,
  timerEndMs: 0,
  timerTotalSeconds: 0,
  timerPausedSeconds: 0,
  timerOnComplete: null,
  isTimerPaused: false,
  focusLengthMinutes: 25,
  energyLevel: "okay",
  focusSessionsCompleted: 0,
  locationTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Local",
  sunsetMinuteOfDay: null,
  locationRequestInFlight: false,
  weatherContext: getUnknownWeatherContext(),
  weatherFetchPromise: null,
  currentRecommendation: null,
  activeThemeClass: "",
  confettiCleanupId: null,
};

const ui = {
  appShell: document.querySelector(".app-shell"),
  plantCompanion: document.getElementById("plant-companion"),
  plantStickerImg: document.getElementById("plant-sticker-img"),
  sessionForm: document.getElementById("session-form"),
  focusLength: document.getElementById("focus-length"),
  energyInputs: Array.from(document.querySelectorAll('input[name="energy-level"]')),
  startFocusBtn: document.getElementById("start-focus-btn"),
  useLocationBtn: document.getElementById("use-location-btn"),
  manualLocationToggleBtn: document.getElementById("manual-location-toggle-btn"),
  manualLocationGroup: document.getElementById("manual-location-group"),
  manualLocationInput: document.getElementById("manual-location-input"),
  manualLocationApplyBtn: document.getElementById("manual-location-apply-btn"),

  modeLabel: document.getElementById("mode-label"),
  timerDisplay: document.getElementById("timer-display"),
  progressFill: document.getElementById("progress-fill"),
  focusControls: document.getElementById("focus-controls"),
  pauseResumeBtn: document.getElementById("pause-resume-btn"),
  cancelFocusBtn: document.getElementById("cancel-focus-btn"),
  weatherTemp: document.getElementById("weather-temp"),
  weatherCondition: document.getElementById("weather-condition"),
  weatherDetail: document.getElementById("weather-detail"),
  timeLabel: document.getElementById("time-label"),
  clockLine: document.getElementById("clock-line"),
  timezoneDetail: document.getElementById("timezone-detail"),

  recommendationPanel: document.getElementById("recommendation-panel"),
  recommendationCategory: document.getElementById("recommendation-category"),
  recommendationDuration: document.getElementById("recommendation-duration"),
  recommendationTitle: document.getElementById("recommendation-title-text"),
  recommendationDescription: document.getElementById("recommendation-description"),
  recommendationReason: document.getElementById("recommendation-reason"),
  startBreakBtn: document.getElementById("start-break-btn"),

  statusMessage: document.getElementById("status-message"),
  confettiLayer: document.getElementById("confetti-layer"),
};

initializeApp();

function initializeApp() {
  updateTimeOfDayLine();
  updateWeatherLine(state.weatherContext);
  updatePlantCompanion();
  applyModeVisualState();
  updateTimerControls();
  loadSavedManualLocationQuery();
  syncLocationControlsDisabled(false);
  startClockUpdates();

  ui.sessionForm.addEventListener("submit", handleStartFocusSession);
  ui.startBreakBtn.addEventListener("click", handleStartBreakTimer);
  ui.pauseResumeBtn.addEventListener("click", handlePauseResumeTimer);
  ui.cancelFocusBtn.addEventListener("click", handleCancelTimerMode);
  ui.useLocationBtn?.addEventListener("click", handleUseMyLocationClick);
  ui.manualLocationToggleBtn?.addEventListener("click", handleToggleManualLocationInput);
  ui.manualLocationApplyBtn?.addEventListener("click", handleManualLocationApply);
  ui.manualLocationInput?.addEventListener("keydown", handleManualLocationInputKeydown);

  // Ask for location permission on load and populate weather right away.
  loadWeatherOnStartup();
}

function loadWeatherOnStartup() {
  renderStatus("Checking your local weather so your break suggestions feel more personal...", "info");
  setLocationRequestInFlight(true);

  state.weatherFetchPromise = getWeatherContext()
    .then((weatherContext) => {
      state.weatherContext = weatherContext;
      updateWeatherLine(weatherContext);

      if (weatherContext.temperatureF !== null || weatherContext.condition !== "unknown") {
        const usingFallbackSource = weatherContext.source && weatherContext.source !== "live";
        if (usingFallbackSource && isManualLocationVisible()) {
          renderStatus("Weather loaded with a fallback location. Enter a city or ZIP for a precise local match.", "warning");
        } else {
          renderStatus(getSmartWeatherStatusMessage(weatherContext), "success");
        }
      }
    })
    .catch(() => {
      state.weatherContext = getUnknownWeatherContext();
      updateWeatherLine(state.weatherContext);
    })
    .finally(() => {
      setLocationRequestInFlight(false);
    });
}

function getSmartWeatherStatusMessage(weatherContext) {
  const condition = String(weatherContext.condition || "unknown").toLowerCase();
  const temp = Number.isFinite(weatherContext.feelsLikeF) ? weatherContext.feelsLikeF : weatherContext.temperatureF;
  const timeOfDay = getTimeOfDayLabel(new Date(), state.locationTimeZone);

  const clearSkies = /clear|sun|fair|bright/.test(condition);
  const clearOrMild = clearSkies || weatherContext.isMild;
  const rainy = /rain|storm|drizzle|shower|thunder/.test(condition);
  const cold = /snow|ice|sleet|blizzard|freez|frost/.test(condition) || (Number.isFinite(temp) && temp <= 45);
  const coolMorning = timeOfDay === "morning" && Number.isFinite(temp) && temp < 60;

  if (timeOfDay === "night") {
    if (rainy) {
      return "Rainy night right now, so a cozy indoor reset will likely feel best.";
    }

    if (cold) {
      return "Cold night outside, so a warm low-key indoor break is your best move.";
    }

    if (clearSkies) {
      return "Clear night conditions right now, so calm low-stimulation breaks will help you reset.";
    }

    return "Night mode is in, so gentle indoor breaks should feel best for recovery.";
  }

  if (timeOfDay === "evening") {
    if (rainy) {
      return "Rain moving through this evening, so an indoor break plan will feel more comfortable.";
    }

    if (cold) {
      return "Cool evening energy right now, so a warm indoor break will likely feel better.";
    }

    if (clearOrMild) {
      return "Nice evening conditions right now, so a short fresh-air reset could feel great.";
    }
  }

  if (coolMorning) {
    return "Cool morning energy right now, so an indoor focus block may feel better.";
  }

  if (rainy) {
    return "Rainy vibe today, so an indoor break plan will likely feel best.";
  }

  if (cold) {
    return "It is chilly outside, so a warm indoor break will probably feel better.";
  }

  if (clearOrMild && !cold) {
    return "Great weather right now, so a quick outdoor break later could feel refreshing.";
  }

  return "Weather check is in and you are good to start.";
}

function loadSavedManualLocationQuery() {
  if (!ui.manualLocationInput) {
    return;
  }

  try {
    const savedQuery = localStorage.getItem(MANUAL_LOCATION_QUERY_STORAGE_KEY);
    if (typeof savedQuery === "string" && savedQuery.trim()) {
      ui.manualLocationInput.value = savedQuery.trim();
    }
  } catch (error) {
    // Ignore storage failures and continue with live input.
  }
}

function saveManualLocationQuery(query) {
  try {
    localStorage.setItem(MANUAL_LOCATION_QUERY_STORAGE_KEY, String(query || "").trim());
  } catch (error) {
    // Ignore storage failures; manual entry can still be used for this session.
  }
}

function isManualLocationVisible() {
  return Boolean(ui.manualLocationGroup && !ui.manualLocationGroup.classList.contains("hidden"));
}

function toggleManualLocationInput(shouldShow) {
  if (!ui.manualLocationGroup || !ui.manualLocationToggleBtn) {
    return;
  }

  ui.manualLocationGroup.classList.toggle("hidden", !shouldShow);
  ui.manualLocationToggleBtn.textContent = shouldShow ? "Hide Manual Input" : "Enter City / ZIP";
}

function syncLocationControlsDisabled(forceDisabled = false) {
  const disabled = forceDisabled || state.locationRequestInFlight || state.mode !== "idle";

  if (ui.useLocationBtn) {
    ui.useLocationBtn.disabled = disabled;
  }
  if (ui.manualLocationToggleBtn) {
    ui.manualLocationToggleBtn.disabled = disabled;
  }
  if (ui.manualLocationApplyBtn) {
    ui.manualLocationApplyBtn.disabled = disabled;
  }
  if (ui.manualLocationInput) {
    ui.manualLocationInput.disabled = disabled;
  }
}

function setLocationRequestInFlight(isLoading) {
  state.locationRequestInFlight = Boolean(isLoading);
  syncLocationControlsDisabled(false);
}

function isGeolocationPermissionError(error) {
  if (!error) {
    return false;
  }

  if (typeof error.code === "number" && error.code === 1) {
    return true;
  }

  return /denied|permission/i.test(String(error.message || ""));
}

function handleToggleManualLocationInput() {
  const shouldShow = !isManualLocationVisible();
  toggleManualLocationInput(shouldShow);

  if (shouldShow && ui.manualLocationInput) {
    ui.manualLocationInput.focus();
    ui.manualLocationInput.select();
  }
}

function handleManualLocationInputKeydown(event) {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  handleManualLocationApply();
}

async function handleUseMyLocationClick() {
  if (state.locationRequestInFlight) {
    return;
  }

  setLocationRequestInFlight(true);
  renderStatus("Requesting your location so weather can update precisely...", "info");

  try {
    let coords;
    try {
      coords = await getCurrentPositionPromise({ maximumAge: 0 });
    } catch (error) {
      if (isGeolocationPermissionError(error)) {
        renderStatus("Location permission is off. Click Enter City / ZIP if you want to set location manually.", "warning");
      } else {
        renderStatus("Could not access your location. Click Enter City / ZIP to set it manually.", "warning");
      }
      return;
    }

    saveLastCoords(coords);

    try {
      const weatherContext = await buildWeatherContextFromCoords(coords, "current");
      state.weatherContext = weatherContext;
      state.weatherFetchPromise = Promise.resolve(weatherContext);
      updateWeatherLine(weatherContext);
      toggleManualLocationInput(false);
      renderStatus(getSmartWeatherStatusMessage(weatherContext), "success");
    } catch (error) {
      renderStatus("Location found, but weather could not be loaded right now.", "warning");
    }
  } finally {
    setLocationRequestInFlight(false);
  }
}

async function handleManualLocationApply() {
  if (state.locationRequestInFlight || !ui.manualLocationInput) {
    return;
  }

  const manualQuery = ui.manualLocationInput.value.trim();
  if (!manualQuery) {
    renderStatus("Enter a city or ZIP before applying manual location.", "warning");
    ui.manualLocationInput.focus();
    return;
  }

  setLocationRequestInFlight(true);
  renderStatus("Looking up that city/ZIP and loading local weather...", "info");
  saveManualLocationQuery(manualQuery);

  try {
    const coords = await geocodeLocationQuery(manualQuery);
    saveLastCoords(coords);

    const weatherContext = await buildWeatherContextFromCoords(coords, "manual");
    state.weatherContext = weatherContext;
    state.weatherFetchPromise = Promise.resolve(weatherContext);
    updateWeatherLine(weatherContext);
    renderStatus(`Location set to ${manualQuery}. ${getSmartWeatherStatusMessage(weatherContext)}`, "success");
  } catch (error) {
    toggleManualLocationInput(true);
    renderStatus("I could not find that city or ZIP yet. Check it and try again.", "error");
    ui.manualLocationInput.focus();
    ui.manualLocationInput.select();
  } finally {
    setLocationRequestInFlight(false);
  }
}

async function handleStartFocusSession(event) {
  event.preventDefault();

  if (state.mode !== "idle") {
    renderStatus("You already have a timer running. Pause or end it first.", "warning");
    return;
  }

  const requestedFocusMinutes = Number(ui.focusLength.value);
  if (!Number.isFinite(requestedFocusMinutes) || requestedFocusMinutes < 1) {
    renderStatus("Enter a valid focus length in minutes (at least 1).", "warning");
    ui.focusLength.focus();
    return;
  }

  state.focusLengthMinutes = Math.max(1, Math.round(requestedFocusMinutes));
  ui.focusLength.value = String(state.focusLengthMinutes);
  const selectedEnergyInput = ui.energyInputs.find((input) => input.checked);
  if (!selectedEnergyInput) {
    renderStatus("Choose an energy level before starting.", "warning");
    return;
  }

  state.energyLevel = selectedEnergyInput.value;
  state.currentRecommendation = null;

  hideRecommendation();
  setMode("focus");

  ui.modeLabel.textContent = "Focus mode";
  renderStatus("Focus mode is live. You got this.", "info");

  setControlsDisabled(true);

  // Location/weather are loaded once at startup so we do not re-prompt for location here.

  startTimer(state.focusLengthMinutes * 60, async () => {
    setMode("idle");
    await handleFocusComplete();
  });
}

async function handleFocusComplete() {
  state.focusSessionsCompleted += 1;
  triggerFocusCelebration();

  if (state.weatherFetchPromise) {
    try {
      await Promise.race([state.weatherFetchPromise, delay(1500)]);
    } catch (error) {
      // Keep recommendation flow running even if weather was unavailable.
    }
  }

  const context = createRecommendationContext();

  renderStatus("Nice work. Creating a break recommendation for this exact moment...", "info");

  const recommendation = await fetchRecommendation(context);
  state.currentRecommendation = recommendation;

  renderRecommendation(recommendation);
  renderStatus("Focus session complete. Your break recommendation is ready.", "success");

  ui.modeLabel.textContent = "Focus complete";
  setControlsDisabled(false);
}

function createRecommendationContext() {
  return {
    focusLengthMinutes: state.focusLengthMinutes,
    energyLevel: state.energyLevel,
    weather: state.weatherContext,
    timeOfDay: getTimeOfDayLabel(new Date(), state.locationTimeZone),
    focusSessionsCompleted: state.focusSessionsCompleted,
  };
}

function handleStartBreakTimer() {
  if (!state.currentRecommendation) {
    renderStatus("No recommendation yet. Finish a focus session first.", "warning");
    return;
  }

  if (state.mode !== "idle") {
    renderStatus("You already have a timer running. Pause or end it first.", "warning");
    return;
  }

  setMode("break");
  ui.modeLabel.textContent = "Break mode";
  renderStatus("Break mode started. Reset and breathe for a minute.", "info");
  setControlsDisabled(true);

  startTimer(state.currentRecommendation.duration * 60, () => {
    setMode("idle");
    ui.modeLabel.textContent = "Break complete";
    renderStatus("Break complete. You are recharged for the next focus round.", "success");
    setControlsDisabled(false);
  });
}

function startTimer(durationSeconds, onComplete) {
  stopTimer();

  state.timerTotalSeconds = durationSeconds;
  state.timerPausedSeconds = durationSeconds;
  state.isTimerPaused = false;
  state.timerOnComplete = onComplete;
  state.timerEndMs = Date.now() + durationSeconds * 1000;

  updateTimerDisplay();
  startTimerInterval();
  updateTimerControls();
  applyModeVisualState();
}

function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimerInterval() {
  state.timerId = window.setInterval(() => {
    updateTimerDisplay();

    const remainingSeconds = getRemainingSeconds();
    if (remainingSeconds <= 0) {
      stopTimer();
      state.timerPausedSeconds = 0;
      state.isTimerPaused = false;

      const onComplete = state.timerOnComplete;
      state.timerOnComplete = null;

      if (typeof onComplete === "function") {
        onComplete();
      }
    }
  }, 250);
}

function setMode(nextMode) {
  state.mode = nextMode;
  applyModeVisualState();
  updateTimerControls();
  updatePlantCompanion();
}

function applyModeVisualState() {
  if (!ui.appShell) {
    return;
  }

  const isFocusMode = state.mode === "focus";
  const isBreakMode = state.mode === "break";

  ui.appShell.classList.toggle("mode-focus", isFocusMode);
  ui.appShell.classList.toggle("mode-break", isBreakMode);
}

function updateTimerControls() {
  const showTimerControls = state.mode === "focus" || state.mode === "break";
  ui.focusControls.classList.toggle("hidden", !showTimerControls);

  if (!showTimerControls) {
    return;
  }

  const isBreakMode = state.mode === "break";
  const noun = isBreakMode ? "Break" : "Session";
  ui.pauseResumeBtn.textContent = state.isTimerPaused ? `Resume ${noun}` : `Pause ${noun}`;
  ui.cancelFocusBtn.textContent = isBreakMode ? "End Break" : "Cancel Session";
}

function handlePauseResumeTimer() {
  if (state.mode !== "focus" && state.mode !== "break") {
    return;
  }

  if (state.isTimerPaused) {
    resumeActiveTimer();
    return;
  }

  pauseActiveTimer();
}

function pauseActiveTimer() {
  if ((state.mode !== "focus" && state.mode !== "break") || state.timerId === null) {
    return;
  }

  const modeLabel = state.mode === "break" ? "Break" : "Focus";
  state.timerPausedSeconds = getRemainingSeconds();
  state.isTimerPaused = true;
  stopTimer();

  ui.modeLabel.textContent = `${modeLabel} paused`;
  renderStatus(`${modeLabel} paused. Take a breath and resume when you are ready.`, "warning");
  updateTimerDisplay();
  updateTimerControls();
}

function resumeActiveTimer() {
  if ((state.mode !== "focus" && state.mode !== "break") || !state.isTimerPaused) {
    return;
  }

  const modeLabel = state.mode === "break" ? "Break" : "Focus";
  state.isTimerPaused = false;
  state.timerEndMs = Date.now() + state.timerPausedSeconds * 1000;
  startTimerInterval();

  ui.modeLabel.textContent = `${modeLabel} mode`;
  renderStatus(`${modeLabel} resumed. Back in rhythm.`, "info");
  updateTimerControls();
}

function handleCancelTimerMode() {
  if (state.mode !== "focus" && state.mode !== "break") {
    return;
  }

  const wasBreakMode = state.mode === "break";
  stopTimer();

  state.isTimerPaused = false;
  state.timerPausedSeconds = 0;
  state.timerOnComplete = null;
  state.timerTotalSeconds = 0;
  state.timerEndMs = 0;

  setMode("idle");
  setControlsDisabled(false);

  ui.modeLabel.textContent = wasBreakMode ? "Break ended" : "Focus cancelled";
  ui.timerDisplay.textContent = "00:00";
  ui.progressFill.style.width = "0%";

  if (wasBreakMode) {
    renderStatus("Break ended early. No stress, you can jump back into focus anytime.", "warning");
    return;
  }

  renderStatus("Focus session cancelled. Ready when you are.", "warning");
}

function updateTimerDisplay() {
  const remainingSeconds = getRemainingSeconds();
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  ui.timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progress =
    state.timerTotalSeconds > 0
      ? ((state.timerTotalSeconds - remainingSeconds) / state.timerTotalSeconds) * 100
      : 0;

  ui.progressFill.style.width = `${Math.max(0, Math.min(100, progress)).toFixed(1)}%`;
}

function getRemainingSeconds() {
  if (state.isTimerPaused) {
    return state.timerPausedSeconds;
  }

  return Math.max(0, Math.ceil((state.timerEndMs - Date.now()) / 1000));
}

function updateTimeOfDayLine() {
  const now = new Date();
  const timezone = state.locationTimeZone || "Local";
  const label = getTimeOfDayLabel(now, timezone);
  const timeText = formatTimeForZone(now, timezone);

  ui.timeLabel.textContent = label;
  ui.clockLine.textContent = timeText;
  ui.timezoneDetail.textContent = `Timezone: ${formatTimeZoneLabel(timezone, now)}`;
  applyTheme(state.weatherContext?.condition || "unknown", now);
  updatePlantCompanion();
}

function startClockUpdates() {
  if (state.clockTimerId !== null) {
    clearTimeout(state.clockTimerId);
    state.clockTimerId = null;
  }

  // Align updates to minute boundaries so the clock changes exactly on the minute.
  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

  state.clockTimerId = window.setTimeout(() => {
    updateTimeOfDayLine();
    setInterval(updateTimeOfDayLine, 60_000);
  }, msUntilNextMinute);
}

function getTimeOfDayLabel(date = new Date(), timeZone = "") {
  const hour = getHourForZone(date, timeZone);
  return getTimeOfDay(hour, {
    date,
    timeZone,
    sunsetMinuteOfDay: state.sunsetMinuteOfDay,
  });
}

function formatTimeForZone(date, timeZone) {
  try {
    return new Intl.DateTimeFormat([], {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    }).format(date);
  } catch (error) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
}

function formatTimeZoneLabel(timeZone, referenceDate = new Date()) {
  const normalizedTimeZone = String(timeZone || "").trim();
  if (!isValidTimeZone(normalizedTimeZone)) {
    return normalizedTimeZone || "Local";
  }

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: normalizedTimeZone,
      timeZoneName: "short",
    }).formatToParts(referenceDate);
    const shortName = parts.find((part) => part.type === "timeZoneName")?.value;

    if (typeof shortName === "string" && shortName.trim()) {
      return `${shortName} (${normalizedTimeZone})`;
    }
  } catch (error) {
    // Fall back to the raw timezone identifier below.
  }

  return normalizedTimeZone;
}

function isValidTimeZone(timeZone) {
  const value = String(timeZone || "").trim();
  if (!value || value.toLowerCase() === "local") {
    return false;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch (error) {
    return false;
  }
}

function getHourForZone(date, timeZone) {
  try {
    const hourText = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone,
    }).format(date);
    return Number(hourText);
  } catch (error) {
    return date.getHours();
  }
}

function getMinutesForZone(date, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone,
    }).formatToParts(date);

    const hourValue = Number(parts.find((part) => part.type === "hour")?.value);
    const minuteValue = Number(parts.find((part) => part.type === "minute")?.value);

    if (Number.isFinite(hourValue) && Number.isFinite(minuteValue)) {
      return hourValue * 60 + minuteValue;
    }
  } catch (error) {
    // Fallback to local clock when timezone conversion fails.
  }

  return date.getHours() * 60 + date.getMinutes();
}

function getTimeOfDay(hour, options = {}) {
  const {
    date = new Date(),
    timeZone = state.locationTimeZone || "Local",
    sunsetMinuteOfDay = state.sunsetMinuteOfDay,
  } = options;

  const minutesNow = getMinutesForZone(date, timeZone);
  const eveningStartMinute = 18 * 60;

  if (minutesNow >= 6 * 60 && minutesNow < 12 * 60) {
    return "morning";
  }

  const hasUsableSunset =
    Number.isFinite(sunsetMinuteOfDay) &&
    sunsetMinuteOfDay > 12 * 60 &&
    sunsetMinuteOfDay <= 23 * 60 + 59;

  // Night starts when the sun sets; if unavailable, fall back to 8:00 PM.
  const nightStartMinute = hasUsableSunset ? sunsetMinuteOfDay : 20 * 60;

  if (minutesNow >= nightStartMinute || minutesNow < 6 * 60) {
    return "night";
  }

  // Evening begins at a fixed 6:00 PM.
  if (minutesNow >= eveningStartMinute) {
    return "evening";
  }

  if (minutesNow >= 12 * 60) {
    return "afternoon";
  }

  return "night";
}

function getWeatherType(condition) {
  const text = String(condition || "")
    .toLowerCase()
    .trim();

  if (!text || text === "unknown") {
    return "default";
  }

  if (/thunder|lightning|storm|squall|hail/.test(text)) {
    return "stormy";
  }

  if (/snow|sleet|blizzard|flurr|ice|freez|frost|wintry/.test(text)) {
    return "snowy";
  }

  if (/rain|drizzle|shower|downpour|precip|wet/.test(text)) {
    return "rainy";
  }

  if (/cloud|overcast|fog|mist|haze|smoke/.test(text)) {
    return "cloudy";
  }

  if (/sun|clear|fair|bright/.test(text)) {
    return "sunny";
  }

  return "default";
}

function applyTheme(weatherCondition, referenceDate = new Date()) {
  const timeZone = state.locationTimeZone || "Local";
  const hour = getHourForZone(referenceDate, timeZone);
  const timeBucket = getTimeOfDay(hour, {
    date: referenceDate,
    timeZone,
    sunsetMinuteOfDay: state.sunsetMinuteOfDay,
  });
  const weatherBucket = getWeatherType(weatherCondition);
  const resolvedWeather =
    weatherBucket === "default" ? DEFAULT_THEME_WEATHER_BY_TIME[timeBucket] : weatherBucket;

  const nextThemeClass = `bg-${timeBucket}-${resolvedWeather}`;

  if (state.activeThemeClass === nextThemeClass) {
    applySunsetPreludeClass(referenceDate, timeZone);
    return;
  }

  if (state.activeThemeClass) {
    document.body.classList.remove(state.activeThemeClass);
  } else {
    document.body.classList.remove(...THEME_CLASS_NAMES);
  }

  document.body.classList.add(nextThemeClass);
  state.activeThemeClass = nextThemeClass;
  applySunsetPreludeClass(referenceDate, timeZone);
}

function applySunsetPreludeClass(referenceDate, timeZone) {
  const minutesNow = getMinutesForZone(referenceDate, timeZone);
  const sunsetMinute = state.sunsetMinuteOfDay;
  const hasSunsetMinute = Number.isFinite(sunsetMinute);

  const shouldShowSunsetPrelude =
    hasSunsetMinute && minutesNow >= sunsetMinute - 30 && minutesNow < sunsetMinute;

  document.body.classList.toggle(SUNSET_PRELUDE_CLASS, shouldShowSunsetPrelude);
}

function getCurrentPositionPromise(options = {}) {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 20_000,
        maximumAge: 300_000,
        ...options,
      }
    );
  });
}

function saveLastCoords(coords) {
  if (!coords) {
    return;
  }

  try {
    const payload = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      savedAt: Date.now(),
    };
    localStorage.setItem(LAST_COORDS_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    // Ignore storage failures; weather fetching can continue.
  }
}

function loadLastCoords() {
  try {
    const raw = localStorage.getItem(LAST_COORDS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    const latitude = toNumber(parsed?.latitude);
    const longitude = toNumber(parsed?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return { latitude, longitude };
  } catch (error) {
    return null;
  }
}

async function getApproximateCoordsFromIP() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const latitude = toNumber(data?.latitude ?? data?.lat);
    const longitude = toNumber(data?.longitude ?? data?.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return { latitude, longitude };
  } catch (error) {
    return null;
  }
}

function getWeatherApiEndpoints(latitude, longitude) {
  const query = `latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
  const endpoints = [];

  if (window.location.hostname.endsWith("cse2004.com")) {
    endpoints.push(`/api/weather?${query}`);
  }

  endpoints.push(`https://cse2004.com/api/weather?${query}`);
  return endpoints;
}

async function fetchJSONWithRetry(url, attempts = 2, retryDelayMs = 500) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await delay(retryDelayMs);
      }
    }
  }

  throw lastError || new Error("Request failed");
}

async function fetchWeatherByCoordinates(latitude, longitude) {
  const endpoints = getWeatherApiEndpoints(latitude, longitude);
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      return await fetchJSONWithRetry(endpoint, 2, 500);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Weather API request failed");
}

function extractTimeZoneFromWeatherData(weatherData) {
  const candidates = [
    weatherData?.timeZone,
    weatherData?.timezone,
    weatherData?.location?.timeZone,
    weatherData?.location?.timezone,
    weatherData?.current?.timeZone,
    weatherData?.current?.timezone,
    weatherData?.current_weather?.timeZone,
    weatherData?.current_weather?.timezone,
    weatherData?.metadata?.timeZone,
    weatherData?.metadata?.timezone,
  ];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (isValidTimeZone(value)) {
      return value;
    }
  }

  return null;
}

function guessUsTimeZoneFromCoordinates(latitude, longitude) {
  const lat = toNumber(latitude);
  const lng = toNumber(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (lat >= 18 && lat <= 23.5 && lng >= -161.5 && lng <= -154.5) {
    return "Pacific/Honolulu";
  }

  if (lat >= 51 && lng <= -130 && lng >= -180) {
    return "America/Anchorage";
  }

  if (lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66) {
    if (lng > -85) {
      return "America/New_York";
    }
    if (lng > -100) {
      return "America/Chicago";
    }
    if (lng > -115) {
      return "America/Denver";
    }
    return "America/Los_Angeles";
  }

  return null;
}

async function resolveTimeZoneFromCoordinates(latitude, longitude, weatherData = null) {
  const fromWeather = extractTimeZoneFromWeatherData(weatherData);
  if (fromWeather) {
    return fromWeather;
  }

  const fromReverseGeocode = await getTimeZoneFromGeocode(latitude, longitude);
  if (fromReverseGeocode) {
    return fromReverseGeocode;
  }

  const guessedUsZone = guessUsTimeZoneFromCoordinates(latitude, longitude);
  if (isValidTimeZone(guessedUsZone)) {
    return guessedUsZone;
  }

  return null;
}

async function geocodeLocationQuery(address) {
  const normalizedAddress = String(address || "").trim();
  if (!normalizedAddress) {
    throw new Error("Manual location query is empty");
  }

  const endpoint = `https://cse2004.com/api/geocode?address=${encodeURIComponent(normalizedAddress)}`;
  const data = await fetchJSONWithRetry(endpoint, 2, 500);
  const firstResult = Array.isArray(data?.results)
    ? data.results[0]
    : Array.isArray(data?.data?.results)
      ? data.data.results[0]
      : null;

  const latitude = toNumber(
    firstResult?.geometry?.location?.lat ??
      firstResult?.lat ??
      firstResult?.latitude
  );
  const longitude = toNumber(
    firstResult?.geometry?.location?.lng ??
      firstResult?.lng ??
      firstResult?.lon ??
      firstResult?.longitude
  );

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Could not geocode manual location input");
  }

  return { latitude, longitude };
}

async function buildWeatherContextFromCoords(coords, locationSource = "current") {
  const { latitude, longitude } = coords;
  const weather = await fetchWeatherByCoordinates(latitude, longitude);
  const resolvedTimeZone = await resolveTimeZoneFromCoordinates(latitude, longitude, weather);
  if (resolvedTimeZone) {
    state.locationTimeZone = resolvedTimeZone;
  }
  updateTimeOfDayLine();

  state.sunsetMinuteOfDay = await resolveSunsetMinuteOfDay({
    weatherData: weather,
    latitude,
    longitude,
    timeZone: state.locationTimeZone,
  });
  updateTimeOfDayLine();

  const parsed = parseWeatherContext(weather);
  if (locationSource !== "current") {
    parsed.source = locationSource;
  }

  return parsed;
}

async function getWeatherContext() {
  let coords = null;
  let locationSource = "current";
  let geolocationError = null;

  try {
    coords = await getCurrentPositionPromise();
    saveLastCoords(coords);
  } catch (error) {
    geolocationError = error;
    coords = loadLastCoords();
    if (coords) {
      locationSource = "saved";
    }
  }

  if (!coords) {
    coords = await getApproximateCoordsFromIP();
    if (coords) {
      locationSource = "approximate";
    }
  }

  if (!coords) {
    coords = { ...DEFAULT_FALLBACK_COORDS };
    locationSource = "fallback";
  }

  const geolocationFailed = geolocationError !== null;
  const geolocationDenied = isGeolocationPermissionError(geolocationError);
  if (geolocationFailed) {
    if (geolocationDenied && locationSource === "saved") {
      renderStatus("Location permission is off. Using your saved location for now. Click Enter City / ZIP to change it.", "warning");
    } else if (geolocationDenied && locationSource === "approximate") {
      renderStatus("Location permission is off. Using an approximate location for now. Click Enter City / ZIP to change it.", "warning");
    } else if (geolocationDenied && locationSource === "fallback") {
      renderStatus("Location permission is off. Click Enter City / ZIP to set weather for your area.", "warning");
    } else if (locationSource === "saved") {
      renderStatus("Could not access live location. Using your saved location. Click Enter City / ZIP to change it.", "warning");
    } else if (locationSource === "approximate") {
      renderStatus("Could not access live location. Using an approximate location. Click Enter City / ZIP to change it.", "warning");
    } else if (locationSource === "fallback") {
      renderStatus("Could not access live location. Click Enter City / ZIP to set weather for your area.", "warning");
    }
  } else if (locationSource === "saved") {
    renderStatus("Using your last known location to load weather.", "warning");
  } else if (locationSource === "approximate") {
    renderStatus("Using an approximate location to load weather.", "warning");
  } else if (locationSource === "fallback") {
    renderStatus("Using fallback location weather for now.", "warning");
  }

  try {
    return await buildWeatherContextFromCoords(coords, locationSource);
  } catch (error) {
    renderStatus("Weather did not load, so I will use a general recommendation.", "warning");
    state.sunsetMinuteOfDay = null;
    return getUnknownWeatherContext();
  }
}

async function getTimeZoneFromGeocode(latitude, longitude) {
  try {
    const geocodeUrl =
      `https://geocoding-api.open-meteo.com/v1/reverse?` +
      `latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}` +
      `&count=1&language=en&format=json`;
    const data = await fetchJSONWithRetry(geocodeUrl, 2, 350);
    const candidates = [
      data?.results?.[0]?.timezone,
      data?.results?.[0]?.time_zone,
      data?.timezone,
      data?.timeZone,
    ];

    for (const candidate of candidates) {
      const value = String(candidate || "").trim();
      if (isValidTimeZone(value)) {
        return value;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function resolveSunsetMinuteOfDay({ weatherData, latitude, longitude, timeZone }) {
  const sunsetFromWeather = getSunsetMinuteFromWeatherData(weatherData, timeZone);
  if (Number.isFinite(sunsetFromWeather)) {
    return sunsetFromWeather;
  }

  const sunsetFromLookup = await fetchSunsetMinuteFromCoordinates(latitude, longitude, timeZone);
  if (Number.isFinite(sunsetFromLookup)) {
    return sunsetFromLookup;
  }

  return null;
}

function getSunsetMinuteFromWeatherData(weatherData, timeZone) {
  const sunsetCandidate =
    weatherData?.sunset ??
    weatherData?.sun?.sunset ??
    weatherData?.sunTimes?.sunset ??
    weatherData?.astronomy?.sunset ??
    weatherData?.daily?.sunset?.[0] ??
    weatherData?.forecast?.daily?.[0]?.sunset ??
    weatherData?.current?.sunset ??
    weatherData?.current_weather?.sunset;

  return parseSunTimeToMinutes(sunsetCandidate, timeZone);
}

async function fetchSunsetMinuteFromCoordinates(latitude, longitude, timeZone) {
  try {
    const endpoint = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return parseSunTimeToMinutes(data?.results?.sunset, timeZone);
  } catch (error) {
    return null;
  }
}

function parseSunTimeToMinutes(value, timeZone) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const timestampMs = value > 1e12 ? value : value * 1000;
    return getMinutesForZone(new Date(timestampMs), timeZone);
  }

  if (typeof value !== "string") {
    return null;
  }

  const parsedAsDate = new Date(value);
  if (!Number.isNaN(parsedAsDate.getTime())) {
    return getMinutesForZone(parsedAsDate, timeZone);
  }

  return parseClockTextToMinutes(value);
}

function parseClockTextToMinutes(text) {
  const cleaned = String(text || "").trim().toLowerCase();
  if (!cleaned) {
    return null;
  }

  const meridiemMatch = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (meridiemMatch) {
    let hour = Number(meridiemMatch[1]);
    const minute = Number(meridiemMatch[2] || "0");

    if (!Number.isFinite(hour) || !Number.isFinite(minute) || minute > 59) {
      return null;
    }

    hour = hour % 12;
    if (meridiemMatch[3] === "pm") {
      hour += 12;
    }

    return hour * 60 + minute;
  }

  const hourMinuteMatch = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (hourMinuteMatch) {
    const hour = Number(hourMinuteMatch[1]);
    const minute = Number(hourMinuteMatch[2]);

    if (
      !Number.isFinite(hour) ||
      !Number.isFinite(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return null;
    }

    return hour * 60 + minute;
  }

  return null;
}

function parseWeatherContext(weather) {
  const degrees = toNumber(
    weather?.temperature?.degrees ??
      weather?.temperature?.fahrenheit ??
      weather?.temperature?.value ??
      weather?.temperature ??
      weather?.current?.temperature ??
      weather?.current_weather?.temperature
  );

  const feelsLike = toNumber(
    weather?.feelsLikeTemperature?.degrees ??
      weather?.feelsLikeTemperature?.value ??
      weather?.apparentTemperature?.degrees ??
    weather?.feels_like?.degrees ??
      weather?.temperature?.feels_like ??
      weather?.feels_like ??
      weather?.apparent_temperature ??
      weather?.current?.feels_like ??
      weather?.current?.apparent_temperature ??
      weather?.current_weather?.apparent_temperature
  );

  const humidity = toNumber(
    weather?.relativeHumidity?.percent ??
      weather?.relativeHumidity?.value ??
    weather?.relativeHumidity ??
    weather?.humidity?.percent ??
      weather?.humidity ??
      weather?.current?.humidity ??
      weather?.current?.relative_humidity_2m ??
      weather?.current_weather?.humidity
  );

  const windSpeed = toNumber(
    weather?.wind?.speed?.value ??
      weather?.wind?.speed ??
      weather?.windSpeed?.value ??
      weather?.windSpeed ??
      weather?.current?.wind_speed ??
      weather?.current?.windSpeed ??
      weather?.current_weather?.windspeed ??
      weather?.current_weather?.wind_speed
  );

  const conditionRaw =
    weather?.weatherCondition?.description?.text ||
    weather?.weatherCondition?.description ||
    weather?.weatherCondition?.text ||
    weather?.condition ||
    weather?.summary ||
    weather?.description ||
    weather?.weather ||
    weather?.current?.condition ||
    weather?.current_weather?.condition ||
    weather?.current_weather?.weather;

  const condition = typeof conditionRaw === "string" && conditionRaw.trim()
    ? conditionRaw.trim().toLowerCase()
    : "unknown";

  const isMild = Number.isFinite(degrees) ? degrees >= 55 && degrees <= 78 : false;

  return {
    condition,
    temperatureF: Number.isFinite(degrees) ? Math.round(degrees) : Number.isFinite(feelsLike) ? Math.round(feelsLike) : null,
    feelsLikeF: Number.isFinite(feelsLike) ? Math.round(feelsLike) : Number.isFinite(degrees) ? Math.round(degrees) : null,
    humidityPercent: Number.isFinite(humidity) ? Math.round(humidity) : null,
    windSpeedMph: Number.isFinite(windSpeed) ? Math.round(windSpeed) : null,
    isMild,
    source: "live",
  };
}

function getUnknownWeatherContext() {
  return {
    condition: "unknown",
    temperatureF: null,
    feelsLikeF: null,
    humidityPercent: null,
    windSpeedMph: null,
    isMild: false,
    source: "fallback",
  };
}

function updateWeatherLine(weatherContext) {
  const temperatureText =
    weatherContext.temperatureF === null ? "--°F" : `${weatherContext.temperatureF}°F`;
  const conditionText =
    weatherContext.condition && weatherContext.condition !== "unknown"
      ? toTitleCase(weatherContext.condition)
      : "Unknown";
  const feelsLikeText =
    weatherContext.feelsLikeF === null ? "--°F" : `${weatherContext.feelsLikeF}°F`;
  const windText =
    weatherContext.windSpeedMph === null ? "-- mph" : `${weatherContext.windSpeedMph} mph`;

  ui.weatherTemp.textContent = temperatureText;
  ui.weatherCondition.textContent = conditionText;
  ui.weatherDetail.textContent = `Feels like ${feelsLikeText} · Wind ${windText}`;
  applyTheme(weatherContext?.condition || "unknown", new Date());
  updatePlantCompanion();
}

function updatePlantCompanion() {
  if (!ui.plantCompanion) {
    return;
  }

  const rainy = isRainyWeather(state.weatherContext);
  const sunny = isSunnyWeather(state.weatherContext);
  const isNight = getTimeOfDayLabel(new Date(), state.locationTimeZone) === "night";

  let modeClass = "mode-idle";
  if (state.mode === "focus") {
    modeClass = "mode-focus";
  } else if (state.mode === "break") {
    modeClass = "mode-break";
  }

  let weatherClass = "weather-none";
  if (rainy) {
    weatherClass = "weather-rainy";
  } else if (sunny) {
    weatherClass = "weather-sunny";
  }

  ui.plantCompanion.classList.remove("mode-focus", "mode-break", "mode-idle", "weather-rainy", "weather-sunny", "weather-none");
  ui.plantCompanion.classList.add(modeClass, weatherClass);

  if (!ui.plantStickerImg) {
    return;
  }

  let stickerSource = getStickerSource({
    mode: state.mode,
    sunny,
    isNight,
    recommendation: state.currentRecommendation,
  });

  if (ui.plantStickerImg.getAttribute("src") !== stickerSource) {
    ui.plantStickerImg.setAttribute("src", stickerSource);
  }
}

function getStickerSource({ mode, sunny, isNight, recommendation }) {
  if (mode === "focus") {
    return STICKER_SOURCES.focus;
  }

  const recommendationSticker = getRecommendationStickerSource(recommendation);
  if (recommendationSticker) {
    return recommendationSticker;
  }

  if (mode === "idle" && isNight) {
    return STICKER_SOURCES.dolphin;
  }

  if (mode === "idle" && sunny) {
    return STICKER_SOURCES.sunny;
  }

  return STICKER_SOURCES.idle;
}

function getRecommendationStickerSource(recommendation) {
  if (!recommendation) {
    return "";
  }

  const category = String(recommendation.category || "").toLowerCase();
  const text = [
    recommendation.title,
    recommendation.description,
    recommendation.reason,
  ]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");

  if (/\b(glass of water|drink water|sip water|hydration|hydrate|water break|water reset|drink a full glass of water|water)\b/.test(text)) {
    return STICKER_SOURCES.recharge;
  }

  if (/coffee|tea/.test(text)) {
    return STICKER_SOURCES.tea;
  }

  if (/phone|call|text|scroll/.test(text)) {
    return STICKER_SOURCES.phone;
  }

  if (/recharge/.test(text)) {
    return STICKER_SOURCES.recharge;
  }

  if (/stretch|yoga|mobility/.test(text)) {
    return STICKER_SOURCES.stretch;
  }

  if (/nap|sleep|rest|eye rest/.test(text) || category === "rest") {
    return STICKER_SOURCES.nap;
  }

  return "";
}

function isSunnyWeather(weatherContext) {
  const condition = String(weatherContext?.condition || "unknown").toLowerCase();
  return /\bsunny\b/.test(condition);
}

function isRainyWeather(weatherContext) {
  const condition = String(weatherContext?.condition || "unknown").toLowerCase();
  return /rain|storm|drizzle|shower|thunder/.test(condition);
}

async function fetchRecommendation(context) {
  const prompt = buildRecommendationPrompt(context);

  try {
    const aiResponse = await askAI(prompt);
    const parsed = parseAIRecommendation(aiResponse);
    return sanitizeRecommendation(parsed);
  } catch (error) {
    return getFallbackRecommendation(context);
  }
}

async function askAI(prompt) {
  const response = await fetch("https://cse2004.com/api/openai/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error("OpenAI request failed");
  }

  return response.json();
}

function buildRecommendationPrompt(context) {
  return [
    "You are a smart study break coach.",
    "Recommendations should be practical, short, and realistic.",
    "Use warm, encouraging language with a little personality.",
    "Use the user's energy level, focus length, current weather, and time of day.",
    "Provide one strong recommendation.",
    "Avoid generic advice like 'just take a break'.",
    "Output valid JSON only.",
    "Return JSON in exactly this shape:",
    '{"title":"string","description":"string","category":"Move | Refresh | Rest | Reset | Reward","duration":8,"reason":"string"}',
    "Context:",
    JSON.stringify(context),
  ].join("\n");
}

function parseAIRecommendation(aiResponse) {
  if (isRecommendationShape(aiResponse)) {
    return aiResponse;
  }

  if (typeof aiResponse?.output_text === "string") {
    return parseRecommendationFromText(aiResponse.output_text);
  }

  if (Array.isArray(aiResponse?.output)) {
    for (const outputItem of aiResponse.output) {
      if (!Array.isArray(outputItem?.content)) {
        continue;
      }

      for (const piece of outputItem.content) {
        if (piece?.json && isRecommendationShape(piece.json)) {
          return piece.json;
        }

        if (typeof piece?.text === "string") {
          return parseRecommendationFromText(piece.text);
        }
      }
    }
  }

  throw new Error("Could not parse AI response");
}

function parseRecommendationFromText(text) {
  const trimmed = text.trim();

  const codeMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  const jsonCandidate = codeMatch ? codeMatch[1].trim() : extractJSONObjectSubstring(trimmed);

  const parsed = JSON.parse(jsonCandidate);
  if (!isRecommendationShape(parsed)) {
    throw new Error("AI JSON shape invalid");
  }

  return parsed;
}

function extractJSONObjectSubstring(text) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found");
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function sanitizeRecommendation(recommendation) {
  const title = String(recommendation.title || "Quick reset").trim();
  const description = String(recommendation.description || "Take a short break and reset.").trim();
  const category = VALID_CATEGORIES.includes(recommendation.category) ? recommendation.category : "Reset";
  const reason = String(recommendation.reason || "This matches your current focus context.").trim();

  let duration = toNumber(recommendation.duration);
  if (!Number.isFinite(duration)) {
    duration = 8;
  }

  duration = Math.max(3, Math.min(20, Math.round(duration)));

  return {
    title,
    description,
    category,
    duration,
    reason,
  };
}

function isRecommendationShape(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    Object.prototype.hasOwnProperty.call(value, "duration") &&
    typeof value.reason === "string"
  );
}

function pickRecommendationVariant(options) {
  if (!Array.isArray(options) || options.length === 0) {
    return sanitizeRecommendation({
      title: "Simple desk reset",
      description: "Stand up, stretch your back and shoulders, and sip water before restarting.",
      category: "Reset",
      duration: 8,
      reason: "A general reset keeps your momentum without overcomplicating your break.",
    });
  }

  const randomIndex = Math.floor(Math.random() * options.length);
  return sanitizeRecommendation(options[randomIndex]);
}

function getFallbackRecommendation(context) {
  const weatherCondition = String(context.weather.condition || "unknown").toLowerCase();
  const temp = context.weather.temperatureF;
  const lowEnergy = context.energyLevel === "low";
  const highEnergy = context.energyLevel === "high";
  const lateEvening = context.timeOfDay === "night" || context.timeOfDay === "late evening";

  const clearOrMild = /clear|sun|fair/.test(weatherCondition) || context.weather.isMild;
  const rainyOrCold = /rain|storm|snow|drizzle|wind/.test(weatherCondition) || (Number.isFinite(temp) && temp < 50);

  if (lateEvening) {
    return pickRecommendationVariant(
      [
        {
          title: "Low-stimulation eye reset",
          description: "Step away from your screen, close your eyes for one minute, then do slow breathing and gentle neck rolls.",
          category: "Rest",
          duration: 8,
          reason: "Late evening focus is best followed by a calm break with low stimulation.",
        },
        {
          title: "Quiet wind-down reset",
          description: "Dim your screen, stand up for gentle shoulder circles, then do a two-minute slow breathing reset.",
          category: "Reset",
          duration: 8,
          reason: "At night, lower stimulation helps your brain recover without feeling wired.",
        },
      ]
    );
  }

  if (lowEnergy) {
    return pickRecommendationVariant(
      [
        {
          title: "Movement and hydration boost",
          description: "Drink a full glass of water, then do two minutes of light movement like marching in place and shoulder rolls.",
          category: "Refresh",
          duration: 9,
          reason: "Low energy responds well to hydration plus gentle movement.",
        },
        {
          title: "Reset with water and steps",
          description: "Refill your water, take a brisk two-minute walk, then stretch your calves and back before returning.",
          category: "Move",
          duration: 8,
          reason: "A quick hydration + movement combo can lift low energy without overloading you.",
        },
      ]
    );
  }

  if (highEnergy) {
    return pickRecommendationVariant(
      [
        {
          title: "Quick active reset",
          description: "Do a short burst of movement like brisk steps, light squats, or stairs, then return with fresh momentum.",
          category: "Move",
          duration: 7,
          reason: "You have high energy, so a short active break helps release extra momentum.",
        },
        {
          title: "Fast momentum break",
          description: "Try one minute of fast marching, one minute of arm swings, and one minute of deep breaths to reset.",
          category: "Move",
          duration: 6,
          reason: "Channeling high energy into a short sequence helps you come back focused.",
        },
      ]
    );
  }

  if (rainyOrCold) {
    return pickRecommendationVariant(
      [
        {
          title: "Indoor stretch and warm reset",
          description: "Do a brief full-body stretch indoors and make tea or water before your next study block.",
          category: "Reset",
          duration: 10,
          reason: "Rainy or cold conditions make an indoor reset more practical.",
        },
        {
          title: "Cozy mobility break",
          description: "Stay inside and do a quick mobility flow: neck rolls, hip circles, and hamstring stretch, then warm up with tea.",
          category: "Rest",
          duration: 9,
          reason: "Indoor comfort works better when weather outside is cold, rainy, or windy.",
        },
      ]
    );
  }

  if (clearOrMild) {
    return pickRecommendationVariant(
      [
        {
          title: "Fresh air walk",
          description: "Take a short outdoor walk and hydrate when you come back.",
          category: "Move",
          duration: 10,
          reason: "Clear or mild weather is ideal for a quick outside refresh.",
        },
        {
          title: "Sunlight reset lap",
          description: "Step outside for a quick lap around your building, then return and drink water before restarting.",
          category: "Refresh",
          duration: 8,
          reason: "Mild outdoor conditions make a fast sunlight break both practical and energizing.",
        },
      ]
    );
  }

  return pickRecommendationVariant(
    [
      {
        title: "Simple desk reset",
        description: "Stand up, stretch your back and shoulders, and sip water before restarting.",
        category: "Reset",
        duration: 8,
        reason: "A general reset keeps your momentum without overcomplicating your break.",
      },
      {
        title: "Posture and breath break",
        description: "Unclench your jaw, roll your shoulders, and take six slow breaths before you sit back down.",
        category: "Reset",
        duration: 7,
        reason: "A brief posture-and-breath reset helps you restart with less tension.",
      },
    ]
  );
}

function renderRecommendation(data) {
  ui.recommendationCategory.textContent = data.category;
  ui.recommendationDuration.textContent = `${data.duration} min`;
  ui.recommendationTitle.textContent = data.title;
  ui.recommendationDescription.textContent = data.description;
  ui.recommendationReason.textContent = `Why this fits now: ${data.reason}`;

  ui.recommendationPanel.classList.remove("hidden");
  updatePlantCompanion();
}

function hideRecommendation() {
  ui.recommendationPanel.classList.add("hidden");
}

function renderStatus(message, type = "info") {
  ui.statusMessage.textContent = message;
  ui.statusMessage.className = `status-message ${type}`;
}

function triggerFocusCelebration() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const confettiLayer = getConfettiLayer();
  if (!confettiLayer) {
    return;
  }

  if (state.confettiCleanupId !== null) {
    clearTimeout(state.confettiCleanupId);
    state.confettiCleanupId = null;
  }

  confettiLayer.replaceChildren();
  confettiLayer.classList.add("active");

  const colors = ["#f6d365", "#ffd166", "#95d5b2", "#a0c4ff", "#ffadad", "#cdb4db"];
  const pieceCount = 120;

  for (let i = 0; i < pieceCount; i += 1) {
    const fromLeft = i % 2 === 0;
    const startX = fromLeft ? Math.random() * 8 : 92 + Math.random() * 8;
    const targetAcrossX = 35 + Math.random() * 30;
    const acrossDriftAmount = targetAcrossX - startX;
    const startY = Math.random() * 92;
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${startX}vw`;
    piece.style.top = `${startY}vh`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${6 + Math.random() * 7}px`;
    piece.style.height = `${8 + Math.random() * 8}px`;
    piece.style.setProperty("--from-x", fromLeft ? "-48px" : "48px");
    piece.style.setProperty("--to-x", `${acrossDriftAmount}vw`);
    piece.style.setProperty("--to-y", `${12 + Math.random() * 78}vh`);
    piece.style.setProperty("--rot", `${-540 + Math.random() * 1080}deg`);
    piece.style.setProperty("--delay", `${(Math.random() * 0.42).toFixed(2)}s`);
    piece.style.setProperty("--dur", `${(3 + Math.random() * 2.2).toFixed(2)}s`);
    confettiLayer.appendChild(piece);
  }

  state.confettiCleanupId = window.setTimeout(() => {
    confettiLayer.classList.remove("active");
    confettiLayer.replaceChildren();
    state.confettiCleanupId = null;
  }, 7000);
}

function getConfettiLayer() {
  if (ui.confettiLayer) {
    return ui.confettiLayer;
  }

  const existingLayer = document.getElementById("confetti-layer");
  if (existingLayer) {
    ui.confettiLayer = existingLayer;
    return existingLayer;
  }

  const layer = document.createElement("div");
  layer.id = "confetti-layer";
  layer.className = "confetti-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  ui.confettiLayer = layer;
  return layer;
}

function setControlsDisabled(disabled) {
  ui.focusLength.disabled = disabled;
  ui.energyInputs.forEach((input) => {
    input.disabled = disabled;
  });
  ui.startFocusBtn.disabled = disabled;
  ui.startBreakBtn.disabled = disabled;
  syncLocationControlsDisabled(disabled);
}

function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function toTitleCase(text) {
  return String(text)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
