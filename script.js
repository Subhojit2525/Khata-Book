
const modal = document.querySelector("#modal");
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskButton = document.querySelector("#add-new-task");



const columns = [
  document.querySelector("#todo"),
  document.querySelector("#progress"),
  document.querySelector("#done")
];

let dragElement = null;
let tasksData = JSON.parse(localStorage.getItem("tasks")) || {
  todo: [],
  progress: [],
  done: []
};

loadAllTasks();
updateCounts();

function createTask(title, desc) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="delete-btn">Delete</button>
  `;

  div.querySelector(".delete-btn").addEventListener("click", () => {
    div.remove();
    saveTasks();
    updateCounts();
  });

  div.addEventListener("drag", () => (dragElement = div));
  return div;
}

function saveTasks() {
  const result = { todo: [], progress: [], done: [] };

  columns.forEach(col => {
    const id = col.id;
    const tasks = col.querySelectorAll(".task");

    result[id] = Array.from(tasks).map(t => ({
      title: t.querySelector("h2").innerText,
      desc: t.querySelector("p").innerText
    }));
  });

  localStorage.setItem("tasks", JSON.stringify(result));
}

function loadAllTasks() {
  for (const col in tasksData) {
    const column = document.querySelector(`#${col}`);
    tasksData[col].forEach(t => {
      column.appendChild(createTask(t.title, t.desc));
    });
  }
}

function updateCounts() {
  columns.forEach(col => {
    const countBox = col.querySelector(".count");
    const count = col.querySelectorAll(".task").length;
    countBox.innerText = count;
  });
}

columns.forEach(column => addDragEvents(column));

function addDragEvents(column) {
  column.addEventListener("dragover", e => e.preventDefault());

  column.addEventListener("drop", () => {
    column.appendChild(dragElement);
    saveTasks();
    updateCounts();
  });
}

toggleModalButton.addEventListener("click", () => modal.classList.add("active"));
modalBg.addEventListener("click", () => modal.classList.remove("active"));

addTaskButton.addEventListener("click", () => {
  const title = document.querySelector("#task-title-input").value;
  const desc = document.querySelector("#task-desc-input").value;

  if (!title.trim()) return;

  const task = createTask(title, desc);
  document.querySelector("#todo").appendChild(task);

  saveTasks();
  updateCounts();
  modal.classList.remove("active");
});







