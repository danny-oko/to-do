const input = document.querySelector(".text-input");
const addBtn = document.querySelector(".add-btn");
const tasksContainer = document.querySelector(".tasks");

const allFilter = document.querySelector(".all-text");
const activeFilter = document.querySelector(".active-text");
const completedFilter = document.querySelector(".completed-text");

const counterContainer = document.querySelector(".counter-container");
const taskCounter = document.querySelector(".task-counter");
const clearCompleted = document.querySelector(".clear-completed");

let tasks = [];
let currentFilter = "all";

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

allFilter.addEventListener("click", () => changeFilter("all"));
activeFilter.addEventListener("click", () => changeFilter("active"));
completedFilter.addEventListener("click", () => changeFilter("completed"));

clearCompleted.addEventListener("click", deleteCompletedItems);

function addTask() {
  const txt = input.value.trim();
  if (!txt) return;

  tasks.push({ id: Date.now(), text: txt, isCompleted: false });
  input.value = "";
  render();
}

function changeFilter(type) {
  currentFilter = type;
  highlightFilter(type);
  render();
}

function highlightFilter(type) {
  [allFilter, activeFilter, completedFilter].forEach((el) =>
    el.classList.remove("selected")
  );
  document.querySelector(`.${type}-text`).classList.add("selected");
}

function render() {
  let list = tasks;

  if (currentFilter === "active") list = tasks.filter((t) => !t.isCompleted);
  if (currentFilter === "completed") list = tasks.filter((t) => t.isCompleted);

  tasksContainer.innerHTML = "";

  if (list.length === 0) {
    tasksContainer.innerHTML =
      '<div class="no-tasks"><p>No tasks found.</p></div>';
  } else {
    list.forEach((t) => {
      const div = document.createElement("div");
      div.className = "task-item";
      div.dataset.id = t.id;

      div.innerHTML = `
        <div class="checkbox-container">
          <input class="checkbox" type="checkbox" ${
            t.isCompleted ? "checked" : ""
          }
                 onchange="toggle(${t.id})">
          <p class="task-text ${t.isCompleted ? "completed-item" : ""}"
             ondblclick="edit(${t.id})">
            ${escape(t.text)}
          </p>
        </div>
        <div class="task-buttons-container">
          <button class="edit-btn"   onclick="edit(${t.id})">Edit</button>
          <button class="delete-btn" onclick="del(${t.id})">Delete</button>
        </div>
      `;
      tasksContainer.appendChild(div);
    });
  }

  updateFooter();
}

function toggle(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) {
    t.isCompleted = !t.isCompleted;
    render();
  }
}

function del(id) {
  if (confirm("Delete this task?")) {
    tasks = tasks.filter((t) => t.id !== id);
    render();
  }
}

function edit(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task || task.isCompleted) return;

  const item = document.querySelector(`.task-item[data-id="${id}"]`);
  const p = item.querySelector(".task-text");

  const inp = document.createElement("input");
  inp.type = "text";
  inp.value = task.text;
  inp.className = "edit-input";

  const finish = () => {
    const txt = inp.value.trim();
    if (!txt) {
      del(id);
      return;
    }
    task.text = txt;
    render();
  };

  inp.addEventListener("blur", finish);
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish();
    if (e.key === "Escape") render();
  });

  p.replaceWith(inp);
  inp.focus();
  inp.select();
}

function deleteCompletedItems() {
  const cnt = tasks.filter((t) => t.isCompleted).length;
  if (!cnt) return;
  if (confirm(`Delete ${cnt} completed task(s)?`)) {
    tasks = tasks.filter((t) => !t.isCompleted);
    render();
  }
}

function updateFooter() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const active = total - completed;

  taskCounter.textContent = `${active} / ${total} completed`;

  // show whole footer when there is at least one task
  counterContainer.style.display = total ? "flex" : "none";

  // show Clear button only when there are completed tasks
  clearCompleted.style.display = completed ? "block" : "none";
}

function escape(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

highlightFilter("all");
render();
