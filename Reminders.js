const addBtn = document.getElementById("addBtn");
const reminderInput = document.getElementById("reminderInput");
const reminderList = document.getElementById("reminderList");

addBtn.addEventListener("click", addReminder);

reminderInput.addEventListener("keydown",function(event){
    if(event.key === "Enter"){
        addReminder();
    }
})

function addReminder(){
    const reminderText = reminderInput.value.trim();
    if (reminderText == ""){
        alert("Please enter a reminder");
        return
    }
    const li = document.createElement("li");
    const taskLeft = document.createElement("div");
    taskLeft.classList.add("task-left");
    const checkbox = document.createElement("input");
    checkbox.type="checkbox";
    const span = document.createElement("span");
    span.textContent = reminderText;
    checkbox.addEventListener("change",function(){
        span.classList.toggle("completed");
    });
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click",function(){
        li.remove();
    });
    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(span);
    li.appendChild(taskLeft);
    li.appendChild(deleteBtn);
    reminderList.appendChild(li);
    reminderInput.value = "";
}
