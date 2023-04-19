const newTaskInfo = document.getElementById("add_new");
const taskInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const addTaskBtn = document.querySelector(".add-task-btn");
const addBtn = document.querySelector(".add");
const cancelBtn = document.querySelector(".cancel");
const list = document.querySelector("ul");

addTaskBtn.addEventListener("click", addNewTask);
function addNewTask() {
  newTaskInfo.classList.add("show");
  addTaskBtn.classList.add("hide");
}

addBtn.addEventListener("click", submitTask);
function submitTask() {
  addTaskHandler();
  if (taskInput.value === "" || dateInput.value === "") return;
  newTaskInfo.classList.remove("show");
  addTaskBtn.classList.remove("hide");
}

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

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTaskHandler();
  }
});

function addTaskHandler() {
  if (taskInput == "") return;
  if (dateInput.value === '') {
    alert('You must select a date!');
    return;
  }
  addTask(taskInput.value, dateInput.value);
  taskInput.value = "";
  dateInput.value = "";
  renderList();
}

function deleteTask(id) {
  let tasks = getAllTasks();
  let length = tasks.length;
  tasks = tasks.filter(function (task) {
    return task.id != id;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  return tasks.length != length;
}

list.addEventListener('click', e => {
  let target = e.target;
  if (target.classList.contains('remove-task-btn')) {
    let id = target.id.substr(11);
    deleteTask(id);
    renderList();
  }
})

renderList();
