let notes = [];

function displayNotes() {

  let notesGrid =
    document.getElementById("notesGrid");

  notesGrid.innerHTML = "";

  for(let i = 0; i < notes.length; i++) {

    let card = document.createElement("div");

    card.className = "note-card";

    card.innerHTML = `
      <h4>${notes[i].title}</h4>

      <span>${notes[i].subject}</span>

      <br><br>

      <a href="${notes[i].fileURL}" target="_blank">
        📎 Open ${notes[i].fileName}
      </a>

      <br><br>

      <button onclick="openNote(${i})">
        Open Note
      </button>

      <button onclick="deleteNote(${i})">
        Delete
      </button>
    `;

    notesGrid.appendChild(card);
  }

  document.getElementById("noteCount").innerText =
    notes.length;
}

function addNote() {

  let title =
    document.getElementById("noteTitle").value;

  let subject =
    document.getElementById("noteSubject").value;

  let text =
    document.getElementById("noteText").value;

  let file =
    document.getElementById("noteFile").files[0];

  if(title == "" || subject == "" || text == "" || !file){

    alert("Fill all fields");

    return;
  }

  let fileURL =
    URL.createObjectURL(file);

  let note = {

    title: title,

    subject: subject,

    text: text,

    fileName: file.name,

    fileURL: fileURL
  };

  notes.push(note);

  displayNotes();

  document.getElementById("noteTitle").value = "";

  document.getElementById("noteSubject").value = "";

  document.getElementById("noteText").value = "";

  document.getElementById("noteFile").value = "";
}

function openNote(i){

  localStorage.setItem(
    "currentNote",
    JSON.stringify(notes[i])
  );

  window.open(
    "innernotes.html",
    "_blank"
  );
}

function deleteNote(i){

  notes.splice(i,1);

  displayNotes();
}
