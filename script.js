const subjectInput = document.getElementById("subject");
const durationInput = document.getElementById("duration");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const timeDisplay = document.getElementById("time");
const currentSession = document.getElementById("currentSession");
const sessionsCount = document.getElementById("sessionsCount");

let timerId = null;
let remainingSeconds = 0;
let isRunning = false;
let completedSessions = 0;

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingSeconds);
}

function updateSummaryText() {
  if (remainingSeconds > 0 && isRunning) {
    currentSession.textContent = `Current session: ${
      subjectInput.value.trim() || "Unnamed subject"
    } – ${formatTime(remainingSeconds)} left`;
  } else if (remainingSeconds > 0 && !isRunning) {
    currentSession.textContent = `Session paused: ${
      subjectInput.value.trim() || "Unnamed subject"
    } – ${formatTime(remainingSeconds)} left`;
  } else {
    currentSession.textContent = "No session running.";
  }

  sessionsCount.textContent = `Sessions completed today: ${completedSessions}`;
}

function startTimer() {
  if (isRunning) return;

  let durationMinutes = parseInt(durationInput.value, 10);
  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    durationMinutes = 25;
    durationInput.value = "25";
  }

  // si aucun temps en cours, on initialise
  if (remainingSeconds === 0) {
    remainingSeconds = durationMinutes * 60;
  }

  isRunning = true;
  startBtn.textContent = "Running...";
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;

  updateDisplay();
  updateSummaryText();

  timerId = setInterval(() => {
    remainingSeconds--;
    updateDisplay();
    updateSummaryText();

    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      timerId = null;
      isRunning = false;
      remainingSeconds = 0;
      completedSessions++;
      alert("Session finished! Good job 🎓");
      startBtn.textContent = "Start session";
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = false;
      updateDisplay();
      updateSummaryText();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
  startBtn.textContent = "Resume session";
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  updateSummaryText();
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
  remainingSeconds = 0;
  startBtn.textContent = "Start session";
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  updateDisplay();
  updateSummaryText();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// état initial
remainingSeconds = parseInt(durationInput.value, 10) * 60;
updateDisplay();
updateSummaryText();
