let note = JSON.parse(
  localStorage.getItem("currentNote")
);

document.getElementById("title").innerText =
  note.title;

document.getElementById("subject").innerText =
  note.subject;

document.getElementById("text").innerText =
  note.text;

function goBack(){

  window.close();
}
