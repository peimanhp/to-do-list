const newTaskInfo = document.getElementById("add_new");
const taskInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const addTaskBtn = document.querySelector(".add-task-btn");
const addBtn = document.querySelector(".add");
const cancelBtn = document.querySelector(".cancel");
const list = document.querySelector("ul");
const inboxBtn = document.getElementById("inbox");
const todayBtn = document.getElementById("today");
const thisWeekBtn = document.getElementById("this_week");
const folderTitle = document.getElementById("folder_title");
const addProjectBtn = document.getElementById("add_project");
const projectInputBtn = document.getElementById("project_input");
const projectTitle = document.getElementById("project_title");
const projectWrapper = document.querySelector(".project-wrapper");
const cancelTyping = document.querySelector(".cancel-typing");

// Tasks
addTaskBtn.addEventListener("click", addNewTask);
function addNewTask() {
  newTaskInfo.classList.add("show");
  addTaskBtn.classList.add("hide");
}

addBtn.addEventListener("click", submitTask);
function submitTask() {
  if (taskInput.value === "" || dateInput.value === "") {
    alert("You must enter Title and date!");
    return;
  }
  addTaskHandler();
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

function renderList(tasks) {
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
  addTask(taskInput.value, dateInput.value);
  taskInput.value = "";
  dateInput.value = "";
  renderList(getAllTasks());
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

list.addEventListener("click", (e) => {
  let target = e.target;
  if (target.classList.contains("remove-task-btn")) {
    let id = target.id.substr(11);
    deleteTask(id);
    renderList(getAllTasks());
  }
});

inboxBtn.addEventListener("click", () => {
  renderList(getAllTasks());
});

function getTodayDate() {
  let today = new Date();
  let yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  let formattedToday = yyyy + "-" + mm + "-" + dd;
  return formattedToday;
}

todayBtn.addEventListener("click", todayTasks);

function todayTasks() {
  let todayDate = getTodayDate();
  let allTasks = getAllTasks();
  let todayTasks = allTasks.filter(function (task) {
    return task.date == todayDate;
  });
  renderList(todayTasks);
}

function lastWeekDate() {
  let today = new Date();
  let sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
  let yyyy = sevenDaysAgo.getFullYear();
  let mm = sevenDaysAgo.getMonth() + 1;
  let dd = sevenDaysAgo.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  let formattedlastWeek = yyyy + "-" + mm + "-" + dd;
  return formattedlastWeek;
}

thisWeekBtn.addEventListener("click", thisWeekTasks);

function thisWeekTasks() {
  let lastWeek = lastWeekDate();
  let allTasks = getAllTasks();
  let thisWeekTasks = allTasks.filter(function (task) {
    return task.date >= lastWeek;
  });
  renderList(thisWeekTasks);
}

// projects

function getAllProjects() {
  let projects = JSON.parse(localStorage.getItem("projects"));
  if (!projects) return (projects = []);
  else return projects;
}

function addProject(title) {
  let projects = getAllProjects();
  let id;
  if (projects.length == 0) id = 1;
  else {
    id = projects[projects.length - 1].id + 1;
  }
  projects.push({ id, title });
  localStorage.setItem("projects", JSON.stringify(projects));
}

addProjectBtn.addEventListener("click", addNewProject);
function addNewProject() {
  addProjectBtn.classList.add("hide");
  projectInputBtn.classList.add("show");
}

projectInputBtn.addEventListener("keydown", submitNewProject);
function submitNewProject(e) {
  if (e.key === "Enter") {
    addProjectHandler();
    addProjectBtn.classList.remove("hide");
    projectInputBtn.classList.remove("show");
  }
}

cancelTyping.onclick = () =>{
  addProjectBtn.classList.remove("hide");
  projectInputBtn.classList.remove("show");
}

function renderProjects() {
  let projects = getAllProjects();
  let html = "";
  for (const project of projects) {
    html += `
      <div id="${project.id}" class="projects">
          <p>${project.title}</p>
          <button id="delete_pro${project.id}" class="delete_projects">X</button>
      </div>
    `;
  }
  projectWrapper.innerHTML = html;
}

function addProjectHandler() {
  addProject(projectTitle.value);
  projectTitle.value = "";
  renderProjects();
}

function deleteProject(id) {
  let projects = getAllProjects();
  let length = projects.length;
  projects = projects.filter(function (project) {
    return project.id != id;
  });
  localStorage.setItem("projects", JSON.stringify(projects));
  return projects.length != length;
}

projectWrapper.addEventListener("click", (e) => {
  let target = e.target;
  if (target.classList.contains("delete_projects")) {
    let id = target.id.substr(10);
    deleteProject(id);
    renderProjects();
  }
});

renderProjects();
renderList(getAllTasks());
