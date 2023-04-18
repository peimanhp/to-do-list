const addTaskBtn = document.querySelector(".add-task-btn");
const newTaskInfo = document.getElementById("add_new");
addTaskBtn.addEventListener("click", addNewTask);
function addNewTask() {
  newTaskInfo.classList.add("show");
  addTaskBtn.classList.add("hide");
}

const addBtn = document.querySelector('.add');
addBtn.addEventListener('click', submitTask);
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
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  if (!tasks) return tasks = [];
  else return tasks;
}

function addTask(title) {
  let tasks = getAllTasks();
  let id;
  if (tasks.length == 0) id = 1;
  else {
    id = tasks[tasks.length - 1].id + 1;
  }
  tasks.push({ id, title });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
