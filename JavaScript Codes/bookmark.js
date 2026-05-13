let count = 0;

function changeType() {
  let type = document.getElementById("bookmarkType").value;
  let linkInput = document.getElementById("bookmarkLink");
  let notesDropdown = document.getElementById("notesDropdown");

  if (type == "link") {
    linkInput.style.display = "block";
    notesDropdown.style.display = "none";
  }
}

function addBookmark() {
  let type = document.getElementById("bookmarkType").value;
  let title = document.getElementById("bookmarkTitle").value;
  let link = document.getElementById("bookmarkLink").value;

  if (type == "" || title == "" || link == "") {
    alert("Please fill all fields");
    return;
  }

  let card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${title}</h3>

    <a href="${link}" target="_blank">
      Open Link
    </a>

    <br>

    <button class="delete" onclick="deleteBookmark(this)">
      Delete
    </button>
  `;

  document.getElementById("bookmarkList").appendChild(card);

  count++;
  document.getElementById("bookmarkCount").innerText = count;

  document.getElementById("bookmarkType").value = "";
  document.getElementById("bookmarkTitle").value = "";
  document.getElementById("bookmarkLink").value = "";
}

function deleteBookmark(button) {
  button.parentElement.remove();

  count--;
  document.getElementById("bookmarkCount").innerText = count;
}
