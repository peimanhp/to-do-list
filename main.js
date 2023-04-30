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

let selectedProjectId = 0;
let projectsFocused = 'inbox';
  
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

function getAllTimeTasks() {
  let projects = getAllProjects();
  let tasks = [];
  for (const project of projects) {
    let projectId = project.id;
    projectArray = JSON.parse(localStorage.getItem(projectId));
    for (let i = 0; i < projectArray.length; i++) {
      tasks.push(projectArray[i]);
    }
  }
  tasks.sort((a, b) => {
    const dateA = a.date;
    const dateB = b.date;
    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;
    return 0;
  });
  if (!tasks) return (tasks = []);
  else return tasks;
}

function getAllTasks() {
  let projectId;
  if (selectedProjectId === undefined) projectId = 0;
  else projectId = selectedProjectId;
  let projects = getAllProjects();
  folderTitle.innerText = projects[selectedProjectId].title;
  let tasks = JSON.parse(localStorage.getItem(projectId));
  if (!tasks) return (tasks = []);
  else return tasks;
}

function addTaskHandler() {
  addTask(taskInput.value, dateInput.value);
  taskInput.value = "";
  dateInput.value = "";
  renderList(getAllTasks());
}

function addTask(title, date) {
  let tasks = getAllTasks();  
  let taskId = JSON.parse(localStorage.getItem('taskId'));
  if (!taskId) taskId = [0];
  else taskId[0] = taskId[0] + 1;
  localStorage.setItem('taskId', JSON.stringify(taskId));
  let id = taskId[0];
  tasks.push({ id, title, date });
  localStorage.setItem(selectedProjectId, JSON.stringify(tasks));
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

function deleteTask(id, title) {
  let projects = getAllProjects();
  let stopFinding = false;
  for (let i = 0; i < projects.length; i++) {
    if (stopFinding === true) break;
    let projectTasks = JSON.parse(localStorage.getItem(projects[i].id));
    for (let j = 0; j < projectTasks.length; j++) {
      if (projectTasks[j].id == id && projectTasks[j].title == title) {
        projectTasks.splice(j, 1);
        localStorage.setItem(i, JSON.stringify(projectTasks));
        stopFinding = true;
        selectedProjectId = i;
        break;
      }
    }
  }
}

list.addEventListener("click", (e) => {
  let target = e.target;
  if (target.classList.contains("remove-task-btn")) {
    let id = target.id.substr(11);
    let title = target.parentNode.parentNode.parentNode.children[0].innerText;
    deleteTask(id, title); 
    if (projectsFocused === "inbox") renderList(getAllTimeTasks());
    else if (projectsFocused === "today") todayTasks();
    else if (projectsFocused === "thisWeek") thisWeekTasks();
    else renderList(getAllTasks());
  }
});

inboxBtn.addEventListener("click", () => {
  folderTitle.innerText = "Inbox";
  projectsFocused = 'inbox';
  renderList(getAllTimeTasks());
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
  projectsFocused = 'today';
  let todayDate = getTodayDate();
  let allTasks = getAllTimeTasks();
  let todayTasks = allTasks.filter(function (task) {
    return task.date == todayDate;
  });
  renderList(todayTasks);
  folderTitle.innerText = "Today";
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
  projectsFocused = 'thisWeek';
  let lastWeek = lastWeekDate();
  let allTasks = getAllTimeTasks();
  let thisWeekTasks = allTasks.filter(function (task) {
    return task.date >= lastWeek;
  });
  renderList(thisWeekTasks);
  folderTitle.innerText = "This Week";
}

// projects

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

cancelTyping.onclick = () => {
  addProjectBtn.classList.remove("hide");
  projectInputBtn.classList.remove("show");
};

function renderProjects() {
  let projects = getAllProjects();
  let html = "";
  for (const project of projects) {
    html += `
      <div id="${project.id}" class="projects">
          <p class="projects-title">${project.title}</p>
          <button id="delete_pro${project.id}" class="delete_projects">X</button>
      </div>
    `;
  }
  projectWrapper.innerHTML = html;
}

function getAllProjects() {
  let projects = JSON.parse(localStorage.getItem("projects"));
  if (!projects || projects.length == 0) {
    projects = [];
    projects.push({ id: 0, title: "Default" });
    localStorage.setItem("projects", JSON.stringify(projects));
    let projectTasks = [];
    localStorage.setItem(0, JSON.stringify(projectTasks));
    selectedProjectId = 0;
    return projects;
  } else return projects;
}

function addProjectHandler() {
  addProject(projectTitle.value);
  projectTitle.value = "";
  renderProjects();
  renderList(getAllTasks());
}

function addProject(title) {
  let id;
  let projects = getAllProjects();
  id = projects[projects.length - 1].id + 1;
  selectedProjectId = id;
  projects.push({ id, title });
  localStorage.setItem("projects", JSON.stringify(projects));

  let projectTasks = [];
  localStorage.setItem(id, JSON.stringify(projectTasks));
}

function deleteProject(id) {
  let projects = getAllProjects();
  let length = projects.length;
  projects = projects.filter(function (project) {
    return project.id != id;
  });
  localStorage.setItem("projects", JSON.stringify(projects));

  localStorage.removeItem(id);
  selectedProjectId = 0;
  folderTitle.innerText = "Inbox";
  renderList(getAllTimeTasks());

  return projects.length != length;
}

projectWrapper.addEventListener("click", (e) => {
  let target = e.target;
  if (target.classList.contains("delete_projects")) {
    let id = target.id.substr(10);
    deleteProject(id);
    renderProjects();
  } else if (target.classList.contains("projects")) {
    selectedProjectId = target.id;
    folderTitle.innerText = target.children[0].innerText;
    projectsFocused = 'projects';
    renderList(getAllTasks());
  } else if (target.classList.contains("projects-title")) {
    selectedProjectId = target.parentNode.id;
    folderTitle.innerText = target.innerText;
    projectsFocused = 'projects';
    renderList(getAllTasks());
  }
});

renderProjects();
renderList(getAllTimeTasks());
