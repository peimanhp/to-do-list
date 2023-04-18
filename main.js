const addTaskBtn = document.querySelector(".add-task-btn");
const newTaskInfo = document.getElementById("add_new");
const taskInput = document.getElementById('title');

addTaskBtn.addEventListener("click", addNewTask);
function addNewTask() {
  newTaskInfo.classList.add("show");
  addTaskBtn.classList.add("hide");
}

const addBtn = document.querySelector(".add");
addBtn.addEventListener("click", submitTask);
function submitTask() {
  newTaskInfo.classList.remove("show");
  addTaskBtn.classList.remove("hide");
}

const cancelBtn = document.querySelector(".cancel");
cancelBtn.addEventListener("click", cancelSubmit);
function cancelSubmit() {
  newTaskInfo.classList.remove("show");
  addTaskBtn.classList.remove("hide");
}

function getAllTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) return (tasks = []);
  else return tasks;
}

function addTask(title, date) {
  let tasks = getAllTasks();
  let id;
  if (tasks.length == 0) id = 1;
  else {
    id = tasks[tasks.length - 1].id + 1;
  }
  tasks.push({ id, title, date });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderList() {
  const list = document.querySelector("ul");
  let tasks = getAllTasks();
  let html = "";
  for (const task of tasks) {
    html += `
      <li id="${task.id}">
          <div class="task">
              <p>${task.title}</p>
              <div>
                  <p>${task.date} <button id="remove_task${task.id}" class="remove-task-btn">X</button></p>
              </div>
          </div>
      </li>
    `;
  }
  list.innerHTML = html;
}

taskInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    addTaskHandler();
  }
})

function addTaskHandler() {
  if (taskInput == '') return;
  addTask(taskInput.value, date);
  taskInput.value = '';
  renderList();
}

renderList();
