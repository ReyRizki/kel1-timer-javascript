var second = 00;
var tens = 00;
var minute = 00;
var hour = 00;
var appendTens = document.getElementById("tens");
var appendSecond = document.getElementById("second");
var appendMinute = document.getElementById("minute");
var appendHour = document.getElementById("hour");
var buttonStart = document.getElementById("start");
var buttonStop = document.getElementById("stop");
var buttonReset = document.getElementById("reset");
var interval;

function startTimer() {
    tens++;
    if (tens < 9) {
        appendTens.innerHTML = "0" + tens;
    }
    if (tens > 9) {
        appendTens.innerHTML = tens;
    }
    if (tens > 99) {
        second++;
        appendSecond.innerHTML = "0" + second;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }
    if (second > 9) {
        appendSecond.innerHTML = second;
    }
    if (second > 60) {
        minute++;
        appendMinute.innerHTML = "0" + minute;
        tens = 0;
        second = 0;
        appendTens.innerHTML = "0" + 0;
        appendSecond.innerHTML = "0" + 0;
    }
    if (minute > 9) {
        appendSecond.innerHTML = minute;
    }
    if (minute > 60) {
        hour++;
        appendHour.innerHTML = "0" + hour;
        tens = 0;
        second = 0;
        minute = 0;
        appendTens.innerHTML = "0" + 0;
        appendSecond.innerHTML = "0" + 0;
        appendMinute.innerHTML = "0" + 0;
    }
}
buttonStart.onclick = function () {
    interval = setInterval(startTimer);
};

buttonStop.onclick = function () {
    clearInterval(interval);
};

buttonReset.onclick = function () {
    clearInterval(interval);
    tens = "00";
    second = "00";
    minute = "00";
    hour = "00";
    appendSecond.innerHTML = second;
    appendTens.innerHTML = tens;
    appendMinute.innerHTML = minute;
    appendHour.innerHTML = hour;
}