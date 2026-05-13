const start = document.getElementById("Start1");
const stop = document.getElementById("Stop1");
const reset = document.getElementById("Reset1");
const timer = document.getElementById("Timer1");

let timeLeft = 1500;
let interval;

function updateTimer(){
    const minutes = Math.floor(timeLeft/60);
    const seconds = timeLeft % 60;

    timer.innerHTML=`${minutes.toString().padStart(2,"0")} : ${seconds.toString().padStart(2,"0")}`;
}

function startTimer(){
    if(interval) return;
    interval = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft===0){
            clearInterval(interval);
            interval=null;
            alert("Time's up! Hope you used your time effectively :)");
            timeLeft = 1500;
            updateTimer();
        }
    },1000)
}

const stopTimer = () => {
    clearInterval(interval);
    interval = null;
};
const resetTimer = () => {
    clearInterval(interval);
    timeLeft = 1500;
    updateTimer();
};

start.addEventListener("click",startTimer);
stop.addEventListener("click",stopTimer);
reset.addEventListener("click",resetTimer);

updateTimer();