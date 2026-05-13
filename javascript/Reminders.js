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
        return;
    }
    createReminder(reminderText, false);
    reminderInput.value = "";
    saveTasks();
    
}

function saveTasks() {
  const tasks = [];

  document.querySelectorAll("#reminderList li").forEach(li => {
    const text = li.querySelector("span").textContent;
    const completed = li.querySelector("input[type='checkbox']").checked;

    tasks.push({
      text: text,
      completed: completed
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(task => {
    createReminder(task.text, task.completed);
  });
}


function createReminder(reminderText, isCompleted = false) {
  const li = document.createElement("li");

  const taskLeft = document.createElement("div");
  taskLeft.classList.add("task-left");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;

  const span = document.createElement("span");
  span.textContent = reminderText;

  if (isCompleted) {
    span.classList.add("completed");
  }

  checkbox.addEventListener("change", function () {
    span.classList.toggle("completed");
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("deleteBtn");

  deleteBtn.addEventListener("click", function () {
    li.remove();
    saveTasks();
  });

  taskLeft.appendChild(checkbox);
  taskLeft.appendChild(span);

  li.appendChild(taskLeft);
  li.appendChild(deleteBtn);

  reminderList.appendChild(li);
}

loadTasks();
