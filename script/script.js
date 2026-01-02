let [ms, sec, min, hr] = [0, 0, 0, 0];
let timerRef = document.querySelector('.timedisplayed');
let int = null;
let records = JSON.parse(localStorage.getItem('stopwatchRecords')) || [];

// Start Timer
document.getElementById("start").onclick = () => {
    if(int !== null) clearInterval(int);
    int = setInterval(updateTime, 10);
};

// Stop Timer
document.getElementById("stop").onclick = () => clearInterval(int);

// Reset Timer
document.getElementById("reset").onclick = () => {
    clearInterval(int);
    [ms, sec, min, hr] = [0, 0, 0, 0];
    timerRef.innerText = "00:00:00:000";
};

// Core Timer Logic
function updateTime() {
    ms += 10;
    if(ms == 1000) { ms = 0; sec++; }
    if(sec == 60) { sec = 0; min++; }
    if(min == 60) { min = 0; hr++; }

    let h = hr < 10 ? "0"+hr : hr;
    let m = min < 10 ? "0"+min : min;
    let s = sec < 10 ? "0"+sec : sec;
    let milli = ms < 100 ? (ms < 10 ? "00"+ms : "0"+ms) : ms;

    timerRef.innerText = `${h}:${m}:${s}:${milli}`;
}

// Save Record to LocalStorage
document.getElementById("save-record").onclick = () => {
    const name = prompt("Enter name for record:");
    if (!name) return;

    const newRecord = { name, time: timerRef.innerText };
    records.unshift(newRecord);
    localStorage.setItem('stopwatchRecords', JSON.stringify(records.slice(0, 10)));
    displayRecords();
};

function displayRecords() {
    const list = document.getElementById("records-list");
    list.innerHTML = records.map(r => `<li>${r.name}: ${r.time}</li>`).join('');
}

displayRecords();