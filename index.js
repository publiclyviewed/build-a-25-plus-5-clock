const breakLengthDisplay = document.getElementById("break-length");
const sessionLengthDisplay = document.getElementById("session-length");
const timerLabel = document.getElementById("timer-label");
const timeLeftDisplay = document.getElementById("time-left");
const startStopBtn = document.getElementById("start_stop");
const resetBtn = document.getElementById("reset");
const breakDecrementBtn = document.getElementById("break-decrement");
const breakIncrementBtn = document.getElementById("break-increment");
const sessionDecrementBtn = document.getElementById("session-decrement");
const sessionIncrementBtn = document.getElementById("session-increment");
const beep = document.getElementById("beep");

let breakLength = 5;
let sessionLength = 25;
let timeLeft = sessionLength * 60;
let isRunning = false;
let isSession = true;
let timerInterval = null;

function updateLengthDisplays() {
  breakLengthDisplay.textContent = breakLength;
  sessionLengthDisplay.textContent = sessionLength;
}

function updateTimeDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const timeString = `${minutes}:${seconds}`;

  timeLeftDisplay.textContent = timeString;
  timerLabel.textContent = isSession ? "Session" : "Break";
  document.title = timeString + " - " + (isSession ? "Session" : "Break");
}

function adjustBreakLength(amount) {
  breakLength = Math.min(60, Math.max(1, breakLength + amount));
  if (!isRunning && !isSession) {
    timeLeft = breakLength * 60;
    updateTimeDisplay();
  }
  updateLengthDisplays();
}

function adjustSessionLength(amount) {
  sessionLength = Math.min(60, Math.max(1, sessionLength + amount));
  if (!isRunning && isSession) {
    timeLeft = sessionLength * 60;
    updateTimeDisplay();
  }
  updateLengthDisplays();
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
  } else {
    isRunning = true;
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1; // Decrement by seconds
        updateTimeDisplay();
      } else {
        beep.currentTime = 0;
        beep.play()
          .then(() => console.log("Audio played successfully"))
          .catch((error) => console.error("Audio playback error:", error));

        isSession = !isSession;
        timeLeft = isSession ? sessionLength * 60 : breakLength * 60;
        updateTimeDisplay();
      }
    }, 1000); // Interval of 1 second
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isSession = true;
  breakLength = 5;
  sessionLength = 25;
  timeLeft = sessionLength * 60;

  beep.pause();
  beep.currentTime = 0;

  updateLengthDisplays();
  updateTimeDisplay();
}

breakDecrementBtn.addEventListener("click", () => adjustBreakLength(-1));
breakIncrementBtn.addEventListener("click", () => adjustBreakLength(1));
sessionDecrementBtn.addEventListener("click", () => adjustSessionLength(-1));
sessionIncrementBtn.addEventListener("click", () => adjustSessionLength(1));
startStopBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);

updateLengthDisplays();
updateTimeDisplay();