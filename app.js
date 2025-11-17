const input = document.querySelector(".text-input");
const addBtn = document.querySelector(".add-btn");
const tasksContainer = document.querySelector(".tasks");

// filter buttons
const allFilter = document.querySelector(".all-text");
const activeFilter = document.querySelector(".active-text");
const completedFilter = document.querySelector(".completed-text");

const counterContainer = document.querySelector(".counter-container");
const taskCounter = document.querySelector(".task-counter");
const clearCompleted = document.querySelector(".clear-completed");

/* ------------------- STATE ------------------- */
let tasks = [];
let currentFilterType = "all";

/* ------------------- EVENTS ------------------- */
addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

allFilter.addEventListener("click", () => changeFilter("all"));
activeFilter.addEventListener("click", () => changeFilter("active"));
completedFilter.addEventListener("click", () => changeFilter("completed"));

clearCompleted.addEventListener("click", deleteCompletedItems);

/* ------------------- ADD TASK ------------------- */
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    isCompleted: false,
  });

  input.value = "";
  renderTasks();
}

/* ------------------- FILTER ------------------- */
function changeFilter(type) {
  currentFilterType = type;
  highlightFilter(type);
  renderTasks();
}

// FILTER HIGHLIGHT
function highlightFilter(type) {
  allFilter.classList.remove("selected");
  activeFilter.classList.remove("selected");
  completedFilter.classList.remove("selected");

  if (type === "all") allFilter.classList.add("selected");
  if (type === "active") activeFilter.classList.add("selected");
  if (type === "completed") completedFilter.classList.add("selected");
}

/* ------------------- RENDER ------------------- */
function render() {
  let list = tasks;

  if (currentFilterType === "active") {
    filteredTasks = tasks.filter((t) => !t.isCompleted);
  }

  if (currentFilterType === "completed") {
    filteredTasks = tasks.filter((t) => t.isCompleted);
  }

  // all tasks
  allTasksCount = tasks.length;
  console.log("all tasks: " + allTasksCount);

  // active tasks counter
  const ActiveTasksCount = tasks.filter((t) => !t.isCompleted).length;
  taskCounterText.textContent =
    ActiveTasksCount === 1
      ? `${ActiveTasksCount} task left`
      : `${ActiveTasksCount} tasks left`;
  console.log("active tasks counter:" + ActiveTasksCount);

  // completed tasks counter
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  console.log("completed tasks: " + completedTasksCount);

  tasksContainer.innerHTML = "";

  if (filteredTasks.length === 0) {
    taskCounter.style.display = "none";
    tasksContainer.innerHTML =
      '<div class="no-tasks"><p>No tasks found.</p></div>';
    return;
  }

  filteredTasks.forEach((task) => {
    taskCounterText.innerHTML = `
      <p> ${allTasksCount} of ${completedTasksCount} </p>
    `;
    tasksContainer.innerHTML += `
      <div class="task-item" data-id="${task.id}">
        <div class="checkbox-container">
          <input
            class="checkbox"
            type="checkbox"
            ${task.isCompleted ? "checked" : ""}
            onchange="markAsDone(${task.id}, this)"
          >
          <p class="task-text ${task.isCompleted ? "completed-item" : ""}">
            ${task.text}
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

/* ------------------- TOGGLE ------------------- */
function toggle(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) {
    t.isCompleted = !t.isCompleted;
    render();
  }
}

/* ------------------- DELETE ONE ------------------- */
function del(id) {
  if (confirm("Delete this task?")) {
    tasks = tasks.filter((t) => t.id !== id);
    render();
  }
}

/* ------------------- EDIT ------------------- */
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

/* ------------------- CLEAR COMPLETED ------------------- */
function deleteCompletedItems() {
  if (confirm("Press 'OK' to delete all completed tasks.")) {
    tasks = tasks.filter((t) => !t.isCompleted);
    render();
  }
}

/* ------------------- FOOTER (counter + button) ------------------- */
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

/* ------------------- UTIL ------------------- */
function escape(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

/* ------------------- INIT ------------------- */
highlightFilter("all");
renderTasks();

// <button class="edit-btn">Edit</button>
