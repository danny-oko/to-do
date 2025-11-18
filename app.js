const input = document.querySelector(".text-input");
const addBtn = document.querySelector(".add-btn");
const tasksContainer = document.querySelector(".tasks");

// filter buttons
const allFilter = document.querySelector(".all-text");
const activeFilter = document.querySelector(".active-text");
const completedFilter = document.querySelector(".completed-text");

// task counter
const taskCounter = document.querySelector(".counter-container");
const taskCounterText = document.querySelector(".task-counter");

// stores tasks in this array:
let tasks = [];
let currentFilterType = "all";

// EVENT LISTENERS
addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

allFilter.addEventListener("click", () => changeFilter("all"));
activeFilter.addEventListener("click", () => changeFilter("active"));
completedFilter.addEventListener("click", () => changeFilter("completed"));

// ADD TASK
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

// CHANGE FILTER
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

function renderTasks() {
  let filteredTasks = tasks;

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
          <button class="delete-btn" onclick="deleteTask(${
            task.id
          })">Delete</button>
        </div>
      </div>
    `;
    taskCounter.style.display = "block";
  });
}

function deleteTask(taskId) {
  if (confirm("Press 'OK' to delete this task.")) {
    tasks = tasks.filter((t) => t.id !== taskId);
    renderTasks();
  }
}

function deleteCompletedItems() {
  if (tasks.filter((t) => t.isCompleted).length === 0) {
    alert("There are no completed tasks to delete.");
    return;
  }
  if (confirm("Press 'OK' to delete all completed tasks.")) {
    tasks = tasks.filter((t) => !t.isCompleted);
    renderTasks();
    return;
  }
}

function markAsDone(taskId, checkbox) {
  const task = tasks.find((t) => t.id === taskId);
  task.isCompleted = checkbox.checked;
  renderTasks();
}

highlightFilter("all");
renderTasks();

// <button class="edit-btn">Edit</button>
// EDIT TASK
