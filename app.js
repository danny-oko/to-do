const taskInput = document.querySelector(".text-input");
const addBtn = document.querySelector(".add-btn");
const tasksContainer = document.querySelector(".tasks");

let tasks = [];

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = { id: Date.now(), text, completed: false };
  tasks.push(newTask);
  taskInput.value = "";
  renderTasks();
}

function renderTasks() {
  tasksContainer.innerHTML = "";
  if (tasks.length === 0) {
    tasksContainer.innerHTML =
      '<div class="no-tasks"><p>No tasks yet. Add one above!</p></div>';
    return;
  }

  tasks.forEach((task) => {
    tasksContainer.innerHTML += `
      <div class="task-item">
        <div class="checkbox-container">
          <input type= "checkbox" onclick="markAsDone()">  
          <p>${task.text}</p>
        </div>
        <div class="btn-container>
          <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
          <button class="edit-btn" onclick="editTask"(${task.id})">Edit</button>
        </div>
      </div>
    `;
  });
}

function deleteTask(taskId) {
  const updatedTasks = tasks.filter((task) => task.id !== taskId);
  tasks = updatedTasks;

  renderTasks();
}

function markAsDone(){
  
}

renderTasks(); // Load saved tasks
