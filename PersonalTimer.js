const start = document.getElementById("Start2");
const stop = document.getElementById("Stop2");
const reset = document.getElementById("Reset2");
const timer = document.getElementById("Timer2");

const minutesInput = document.getElementById("TimerMin");
let timeLeft = 0;
let interval = null;

function updateTimer(){
    const minutes = Math.floor(timeLeft/60);
    const seconds = timeLeft % 60;

    timer.innerHTML=`${minutes.toString().padStart(2,"0")} : ${seconds.toString().padStart(2,"0")}`;
}

function startTimer(){
    if(interval) return;
    if (timeLeft === 0){
        const userMinutes = parseInt(minutesInput.value);

        if (isNaN(userMinutes) || userMinutes < 1 || userMinutes > 60){
            alert("Enter a valid number between 1 and 60");
            return;
        }
        timeLeft = userMinutes*60;
    }
    updateTimer();
    interval = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft===0){
            clearInterval(interval);
            interval=null;
            alert("Time's up! Hope you used your time effectively :)");
        }
    },1000)
}

const stopTimer = () => {
    clearInterval(interval);
    interval = null;
};
const resetTimer = () => {
    clearInterval(interval);
    timeLeft = 0;
    updateTimer();
};

start.addEventListener("click",startTimer);
stop.addEventListener("click",stopTimer);
reset.addEventListener("click",resetTimer);

updateTimer();