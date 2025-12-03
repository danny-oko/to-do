const input = document.querySelector(".text-input");
const addBtn = document.querySelector(".add-btn");
const tasksContainer = document.querySelector(".tasks");

const allFilter = document.querySelector(".all-text");
const activeFilter = document.querySelector(".active-text");
const completedFilter = document.querySelector(".completed-text");

const taskCounter = document.querySelector(".counter-container");
const taskCounterText = document.querySelector(".task-counter");

let tasks = [];
let currentFilterType = "all";

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

allFilter.addEventListener("click", () => changeFilter("all"));
activeFilter.addEventListener("click", () => changeFilter("active"));
completedFilter.addEventListener("click", () => changeFilter("completed"));

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
function changeFilter(type) {
  currentFilterType = type;
  highlightFilter(type);
  renderTasks();
}

function highlightFilter(type) {
  allFilter.classList.remove("selected");
  activeFilter.classList.remove("selected");
  completedFilter.classList.remove("selected");

  if (type === "all") allFilter.classList.add("selected");
  if (type === "active") activeFilter.classList.add("selected");
  if (type === "completed") completedFilter.classList.add("selected");
}

function getFilteredTasks() {
  if (currentFilterType === "active") {
    return tasks.filter((t) => !t.isCompleted);
  }
  if (currentFilterType === "completed") {
    return tasks.filter((t) => t.isCompleted);
  }
  return tasks;
}

function updateTaskCounter() {
  const activeTasksCount = tasks.filter((t) => !t.isCompleted).length;
  taskCounterText.textContent =
    activeTasksCount === 1
      ? `${activeTasksCount} task left`
      : `${activeTasksCount} tasks left`;
}

function createTaskHTML(task) {
  return `
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
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  // Update task counter
  updateTaskCounter();

  // Clear container
  tasksContainer.innerHTML = "";

  // Handle empty state
  if (filteredTasks.length === 0) {
    taskCounter.style.display = "none";
    tasksContainer.innerHTML =
      '<div class="no-tasks"><p>No tasks found.</p></div>';
    return;
  }

  // Show counter and render tasks
  taskCounter.style.display = "block";
  const tasksHTML = filteredTasks.map(createTaskHTML).join("");
  tasksContainer.innerHTML = tasksHTML;
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
