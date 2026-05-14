// Profile
let editMode = false;

function editProfile() {
  editMode = true;

  document.querySelectorAll('.editable').forEach(element => {
    element.classList.add('editing-enabled');
  });

  const button = document.getElementById('editProfileBtn');
  if (button) {
    button.textContent = 'Done Editing';
    button.onclick = stopEditing;
  }
}

function stopEditing() {
  editMode = false;

  document.querySelectorAll('.editable').forEach(element => {
    element.classList.remove('editing-enabled');
  });

  const activeEditor = document.querySelector(
    '.edit-input, .edit-textarea'
  );
  if (activeEditor) {
    activeEditor.blur();
  }

  const button = document.getElementById('editProfileBtn');
  if (button) {
    button.textContent = 'Edit Profile';
    button.onclick = editProfile;
  }
}

function makeEditable(element, storageKey) {
  if (!editMode) return;

  if (element.querySelector('input, textarea')) return;

  const oldValue = element.textContent.trim();
  const isParagraph = element.tagName.toLowerCase() === 'p';


  const editor = isParagraph
    ? document.createElement('textarea')
    : document.createElement('input');

  editor.value = oldValue;
  editor.className = isParagraph
    ? 'edit-textarea'
    : 'edit-input';

  element.innerHTML = '';
  element.appendChild(editor);

  editor.focus();
  editor.select();

  function saveChanges() {
    const newValue = editor.value.trim() || oldValue;

    element.textContent = newValue;
    localStorage.setItem(storageKey, newValue);

    if (storageKey === 'profileName') {
      updateAvatar(newValue);
    }
  }

  editor.addEventListener('blur', saveChanges);


  editor.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !isParagraph) {
      e.preventDefault();
      editor.blur();
    }
  });
}


function updateAvatar(name) {
  const avatar = document.getElementById('profileAvatar');
  if (!avatar) return;

  const initials = name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .slice(0, 2)
    .join('');

  avatar.textContent = initials || 'U';
}


function loadProfile() {
  const defaultData = {
    profileName: 'Riya',
    profilePlace: 'Kollam, Kerala',
    profileSkills: 'HTML, CSS, JavaScript, C++',
    profileAbout:
      'Passionate student who enjoys coding, mathematics, and sports.'
  };

  for (const key in defaultData) {
    const element = document.getElementById(key);
    if (!element) continue;

    element.textContent =
      localStorage.getItem(key) || defaultData[key];
  }

  updateAvatar(
    localStorage.getItem('profileName') ||
    defaultData.profileName
  );


  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const tasksCount = document.getElementById('tasksCount');
  if (tasksCount) tasksCount.textContent = tasks.length;

 const notes = JSON.parse(localStorage.getItem('notes')) || [];
 const notesCount = document.getElementById('notesCount');

 if (notesCount) {
    notesCount.textContent = notes.length;
 }
}


window.addEventListener('load', loadProfile);



// ------------------------------------------------------------------------------------------------------------------------------

// Progress
// --------------

function loadProgress() {
  const canvas = document.getElementById("progressChart");
  if (!canvas) return;


  if (typeof Chart === "undefined") {
    console.error("Chart.js is not loaded.");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(task => task.completed).length;

  const remainingTasks = totalTasks - completedTasks;

  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const totalTasksEl = document.getElementById("totalTasks");
  const completedTasksEl = document.getElementById("completedTasks");
  const completionRateEl = document.getElementById("completionRate");

  if (totalTasksEl) totalTasksEl.textContent = totalTasks;
  if (completedTasksEl) completedTasksEl.textContent = completedTasks;
  if (completionRateEl) completionRateEl.textContent = completionRate + "%";

  if (window.progressChartInstance) {
    window.progressChartInstance.destroy();
  }

  const chartData =
    totalTasks === 0 ? [1] : [completedTasks, remainingTasks];

  const chartLabels =
    totalTasks === 0
      ? ["No Tasks"]
      : ["Completed", "Remaining"];

  const chartColors =
    totalTasks === 0
      ? ["#EBDCF5"]
      : ["#8E6BBE", "#EBDCF5"];

  window.progressChartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: chartLabels,
      datasets: [
        {
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom"
        },
        title: {
          display: true,
          text: "Task Completion Overview"
        }
      }
    }
  });
}

window.addEventListener("load", loadProgress);

window.onload = function () {
  loadTasks();
  loadNote();
  loadChart();
  loadProfile();
  loadProgress();
};

// --------------------------------------------------------------------------------------------------------------
