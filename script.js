const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const resetBtn = document.getElementById('reset-button');
const timeEl = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElinfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

// Units conversion
const second = 1000;
const minute = second*60;
const hour = minute*60;
const day = hour*24;

// Set date input min with today's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate countdown/complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const deltaT = countdownValue - now;

        const days = Math.floor(deltaT/day);
        const hours = Math.floor((deltaT % day)/hour);
        const minutes = Math.floor((deltaT % hour)/minute);
        const seconds = Math.floor((deltaT % minute)/second);
        
        // Hide input
        inputContainer.hidden = true;

        // If the countdown has ended, show complete
        if (deltaT < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElinfo.textContent = `${countdownTitle} finished on ${countdownDate}`
            completeEl.hidden = false;
        } else {
            // else, show that the countdown is in progress
            
            // Populate countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeEl[0].textContent = `${days}`;
            timeEl[1].textContent = `${hours}`;
            timeEl[2].textContent = `${minutes}`;
            timeEl[3].textContent = `${seconds}`;
            // Hide complete, show countdown
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
}

// Take values from form input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate
    }
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    if (countdownDate) {
        // Get number version of current date, and update DOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    } else {
        alert('Please enter a valid date!');
    }
}

// Reset all values
function reset() {
    // Hide countdown, show input
    inputContainer.hidden = false;
    countdownEl.hidden = true;
    completeEl.hidden = true;
    // Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // Get countdown from localStorage (cache) if available
    if(localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event listeners
countdownForm.addEventListener('submit', updateCountdown);
resetBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On load, reset localStorage
restorePreviousCountdown();