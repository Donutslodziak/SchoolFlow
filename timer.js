let selectedStudyTime = 25 * 60;
let studyTimeLeft = 25 * 60;

let timerInterval = null;
let isRunning = false;

let breakDuration = 90;
let breakIntervalMinutes = 5;
let breakCountdown = 5 * 60;
let breakTimeLeft = 0;
let isOnBreak = false;

function formatTime(seconds) {
    const minutes = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;

    return String(minutes).padStart(2, "0") + ":" +
        String(secs).padStart(2, "0");
}

function updateDisplay() {
    document.getElementById("timerDisplay").textContent =
        formatTime(studyTimeLeft);

    document.getElementById("breakCountdown").textContent =
        formatTime(isOnBreak ? breakTimeLeft : breakCountdown);
}

function setTimer(minutes) {
    pauseTimer();

    selectedStudyTime = minutes * 60;
    studyTimeLeft = selectedStudyTime;
    breakCountdown = breakIntervalMinutes * 60;
    breakTimeLeft = 0;
    isOnBreak = false;

    updateDisplay();

    document.getElementById("timerMessage").textContent =
        "Ustawiono " + minutes + " minut nauki!";

    document.getElementById("breakStatus").textContent =
        "Przerwa co " + breakIntervalMinutes + " min nauki.";
}

function setBreakDuration(minutes) {
    breakDuration = Math.round(minutes * 60);

    if (isOnBreak) {
        breakTimeLeft = breakDuration;
    }

    document.getElementById("breakStatus").textContent =
        "Długość przerwy: " + minutes + " min.";

    updateDisplay();
}

function setBreakInterval(minutes) {
    breakIntervalMinutes = minutes;
    breakCountdown = minutes * 60;

    updateDisplay();

    document.getElementById("breakStatus").textContent =
        "Przerwa co " + minutes + " min nauki.";
}

function startTimer() {
    if (isRunning) return;

    if (!isOnBreak && studyTimeLeft <= 0) {
        document.getElementById("timerMessage").textContent =
            "Koniec nauki! Kliknij Reset lub wybierz nowy czas.";
        return;
    }

    isRunning = true;

    document.getElementById("timerMessage").textContent =
        isOnBreak ? "Czas na przerwę! ☕" : "Czas na naukę! 💪";

    timerInterval = setInterval(function() {
        if (isOnBreak) {
            breakTimeLeft--;

            if (breakTimeLeft <= 0) {
                isOnBreak = false;
                breakCountdown = breakIntervalMinutes * 60;

                document.getElementById("timerMessage").textContent =
                    "Koniec przerwy! Wracamy do nauki 📚";

                document.getElementById("breakStatus").textContent =
                    "Następna przerwa za " + breakIntervalMinutes + " min nauki.";

                alert("Koniec przerwy! 📚");
            }
        } else {
            studyTimeLeft--;
            breakCountdown--;

            if (studyTimeLeft <= 0) {
                studyTimeLeft = 0;
                clearInterval(timerInterval);
                timerInterval = null;
                isRunning = false;

                document.getElementById("timerMessage").textContent =
                    "Koniec nauki! Dobra robota! 🎉";

                alert("Koniec nauki! 🎉");
            } else if (breakCountdown <= 0) {
                isOnBreak = true;
                breakTimeLeft = breakDuration;

                document.getElementById("timerMessage").textContent =
                    "Czas na przerwę! ☕";

                document.getElementById("breakStatus").textContent =
                    "Odpocznij chwilę!";

                alert("Czas na przerwę! ☕");
            }
        }

        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
}

function resetTimer() {
    pauseTimer();

    studyTimeLeft = selectedStudyTime;
    breakCountdown = breakIntervalMinutes * 60;
    breakTimeLeft = 0;
    isOnBreak = false;

    updateDisplay();

    document.getElementById("timerMessage").textContent =
        "Timer zresetowany. Gotowy do nauki? 💪";

    document.getElementById("breakStatus").textContent =
        "Przerwa co " + breakIntervalMinutes + " min nauki.";
}

updateDisplay();