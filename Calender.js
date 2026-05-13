const monthYear = document.getElementById("MonthYear");
const daysContainer = document.getElementById("days");
const prevBtn = document.getElementById("Prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();
function renderCalendar(){
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const months = [
        "January", "February", "March","April",
        "May","June","July","August","September",
        "October","November", "December"
    ];
    monthYear.textContent=`${months[month]} ${year}`;
    daysContainer.innerHTML="";
    const firstDay = new Date(year,month,1).getDay();
    const totalDays = new Date(year,month+1,0).getDate();
    for (let i = 0; i < firstDay; i++){
        const emptyDiv = document.createElement("div");
        daysContainer.appendChild(emptyDiv);
    }
    for (let day=1; day<= totalDays; day++){
        const dayDiv = document.createElement("div");
        dayDiv.textContent=day;
        dayDiv.classList.add("day");
        const today = new Date();
        if(
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ){
            dayDiv.classList.add("today");
        }
        dayDiv.addEventListener("click", function(){
        dayDiv.classList.toggle("clicked");
        });
        daysContainer.appendChild(dayDiv);
    }
}
prevBtn.addEventListener("click",function(){
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
nextBtn.addEventListener("click",function(){
    currentDate.setMonth(currentDate.getMonth()+1);
    renderCalendar();
});
renderCalendar();