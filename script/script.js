let [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
let timerRef = document.querySelector('.timedisplayed');
let int = null;
let records = JSON.parse(localStorage.getItem('stopwatchRecords')) || [];

// DOM Elements
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const recordBtn = document.getElementById("record");
const recordsList = document.getElementById("records-list");
const recordModal = document.getElementById("record-modal");
const modalTime = document.getElementById("modal-time");
const recordName = document.getElementById("record-name");
const saveRecordBtn = document.getElementById("save-record");
const cancelRecordBtn = document.getElementById("cancel-record");
const closeModal = document.querySelector(".close");

// Initialize the app
function init() {
    updateRecordsList();
    
    // Event Listeners
    startBtn.addEventListener("click", startTimer);
    stopBtn.addEventListener("click", stopTimer);
    resetBtn.addEventListener("click", resetTimer);
    recordBtn.addEventListener("click", openRecordModal);
    saveRecordBtn.addEventListener("click", saveRecord);
    cancelRecordBtn.addEventListener("click", closeRecordModal);
    closeModal.addEventListener("click", closeRecordModal);
    
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === recordModal) {
            closeRecordModal();
        }
    });
}

// Timer Functions
function startTimer() {
    if(int !== null){
        clearInterval(int);
    }
    int = setInterval(displayTimer, 10);
    startBtn.disabled = true;
    startBtn.style.opacity = "0.7";
    startBtn.style.cursor = "not-allowed";
}

function stopTimer() {
    clearInterval(int);
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.style.cursor = "pointer";
}

function resetTimer() {
    clearInterval(int);
    [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
    timerRef.innerHTML = `
        <span class="time-unit">00</span>
        <span class="time-separator">:</span>
        <span class="time-unit">00</span>
        <span class="time-separator">:</span>
        <span class="time-unit">00</span>
        <span class="time-separator">:</span>
        <span class="time-unit">000</span>
    `;
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.style.cursor = "pointer";
}

function displayTimer() {
    milliseconds += 10;

    if(milliseconds == 1000){
        milliseconds = 0;
        seconds++;

        if(seconds == 60){
            seconds = 0;
            minutes++;  

            if(minutes == 60){
                minutes = 0;
                hours++;
            }
        }    
    }

    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;

    timerRef.innerHTML = `
        <span class="time-unit">${h}</span>
        <span class="time-separator">:</span>
        <span class="time-unit">${m}</span>
        <span class="time-separator">:</span>
        <span class="time-unit">${s}</span>
        <span class="time-separator">:</span>
        <span class="time-unit">${ms}</span>
    `;
}

// Record Functions
function openRecordModal() {
    if (hours === 0 && minutes === 0 && seconds === 0 && milliseconds < 100) {
        alert("Please record a time greater than 0.1 seconds");
        return;
    }
    
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
    
    modalTime.textContent = `${h}:${m}:${s}:${ms}`;
    recordName.value = "";
    recordModal.style.display = "block";
}

function closeRecordModal() {
    recordModal.style.display = "none";
}

function saveRecord() {
    const name = recordName.value.trim();
    if (!name) {
        alert("Please enter a name for this record");
        return;
    }
    
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
    
    const timeString = `${h}:${m}:${s}:${ms}`;
    
    const record = {
        id: Date.now(),
        name: name,
        time: timeString,
        timestamp: new Date().toLocaleString()
    };
    
    records.unshift(record); // Add to beginning of array
    if (records.length > 10) {
        records.pop(); // Keep only the 10 most recent records
    }
    
    localStorage.setItem('stopwatchRecords', JSON.stringify(records));
    updateRecordsList();
    closeRecordModal();
    
    // Show confirmation
    showNotification(`Record "${name}" saved!`);
}

function updateRecordsList() {
    if (records.length === 0) {
        recordsList.innerHTML = '<div class="no-records">No records yet. Click "Record" to save a time.</div>';
        return;
    }
    
    recordsList.innerHTML = records.map(record => `
        <div class="record-item">
            <span class="record-name">${record.name}</span>
            <span class="record-time">${record.time}</span>
        </div>
    `).join('');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: 500;
        animation: slideInRight 0.3s, fadeOut 0.3s 2.7s;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after animation completes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);