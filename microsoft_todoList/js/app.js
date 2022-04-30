// checking support of  webp ==============================
const isWebp = () => {
  function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRi4AAABXRUJQVlA4ICIAAABQAQCdASoDAAIAAgA2JQBOgC6gAP73M8eLuxHGTv3eIAAA";
  }
  testWebP(function (support) {
    let className = support === true ? "webp" : "no-webp";
    document.documentElement.classList.add(className);
  });
};
isWebp();
// / checking support of  webp ============================//

// <To do - App> ================================================================================================
// <interactive> ===================================================================================
const sidebar = document.querySelector(".sidebar"),
  burger = document.querySelector(".header__burger"),
  searchBlock = document.querySelector(".header__search"),
  searchSubmit = document.querySelector(".header__search--input-submit"),
  searchInput = document.querySelector(".header__search--input-text"),
  searchDel = document.querySelector(".header__search--input-delete");

// <burger>
burger.addEventListener("click", () => {
  sidebar.classList.toggle("_active");
});
// </burger>

// <search>
searchInput.addEventListener("focus", () => {
  searchBlock.classList.add("_active");
});
searchInput.addEventListener("blur", (e) => {
  !e.target.value.length ? searchBlock.classList.remove("_active") : "";
});
searchDel.addEventListener("click", () => {
  searchInput.value = "";
  searchBlock.classList.remove("_active");
});
searchSubmit.addEventListener("click", () => {
  if (searchBlock.classList.contains("_active")) {
    searchInput.blur();
    searchBlock.classList.remove("_active");
  } else {
    searchBlock.classList.add("_active");
    searchInput.focus();
  }
});
// </search>
// </interactive>===================================================================================//

// <functional>===================================================================================
// list menu variables
let activeList;
const listInput = document.querySelector(".tasks-menu__input"),
  listSubmit = document.querySelector(".tasks-menu__submit"),
  listBlock = document.querySelector(".tasks-user"),
  listMainBlock = document.querySelector(".tasks-main");

// tasks menu variables
const taskMainInput = document.querySelector(".app__interface--text"),
  taskMainSubmit = document.querySelector(".app__interface--add"),
  taskMainCheckbox = document.querySelector(".app__interface--checkbox"),
  taskMainTitle = document.querySelector(".tasks__title-noEdit"),
  taskMainTitleEditable = document.querySelector(".tasks__title-input");

// tasks active variables
const tasksBlock = document.querySelector(".app__tasks");
// arrays
let lists = [
  {
    title: "My day",
    active: true,
    main: true,
    tasks: [],
  },
  {
    title: "Important",
    active: false,
    main: true,
    tasks: [],
  },
  {
    title: "Planned",
    active: false,
    main: true,
    tasks: [],
  },
  {
    title: "Completed",
    active: false,
    main: true,
    tasks: [],
  },
];

// <constructor>===================================================================================
// list constructor
function List(title, active, main) {
  this.title = title;
  this.active = active;
  this.main = main;
  this.tasks = [];
}
// task constructor
function Task(todo, done, important) {
  this.todo = todo;
  this.done = done;
  this.important = important;
}
// </constructor> ===================================================================================//

// <functions> ===================================================================================
// list template function
const listTemplate = (item, index) => {
  return `<li onclick="updateActive(${index})" class="tasks-group__item _list row ${item.active ? "_active" : ""}">
  <span class="task-group__item--title">${item.title}</span>     
  <span class="tasks-group__item--count">${item.tasks.length ? item.tasks.length : ""}</span>
  </li>`;
};
// task template function
const taskTemplate = (item, index) => {
  return `<li class="app__tasks--item row">
  <div>
    <input onclick="updateDone(${index})" class="app__tasks--checkbox" type="checkbox" ${item.done ? "checked" : ""}/>
    <span class="app__tasks--title">${item.todo}</span>
  </div>
  isImportant: ${item.important}
</li>`;
};
// Update list function
const updateList = () => {
  let taskMainTitleBlock = document.querySelector(".tasks");
  listBlock.innerHTML = "";
  listMainBlock.innerHTML = "";
  lists.forEach((item, index) => {
    if (item.active) activeList = item;
    if (item.main) {
      listMainBlock.innerHTML += listTemplate(item, index);
      if (item.active) {
        taskMainTitleBlock.classList.add("_main");
        taskMainTitle.innerHTML = `${item.title}`;
      }
    } else {
      listBlock.innerHTML += listTemplate(item, index);
      if (item.active) {
        taskMainTitleBlock.classList.remove("_main");
        taskMainTitleEditable.value = `${item.title}`;
        resizeList(taskMainTitleEditable);
      }
    }
  });
  updateTask();
};
// Rename list and resize input functions
const renameList = (title, isInput = false) => {
  if (title) {
    activeList.title = title;
  } else if (!isInput) {
    activeList.title = "Untitled list";
  } else if (isInput) {
    activeList.title = title;
  }
  updateList();
};
const resizeList = (item) => {
  return item.value ? (item.size = item.value.length) : (item.size = 1);
};
// update the active element function
const updateActive = (id = -1) => {
  lists.forEach((item) => (item.active = false));
  if (id !== -1) {
    lists[id].active = true;
    updateList();
  }
};
// Create list function
const createList = (title, active = true, main = false) => {
  updateActive();
  lists.push(new List(title, active));
  updateList();
};
// Create task function
const createTask = (todo, done = false, important = false) => {
  if (activeList.main && activeList.title === "Completed") {
    activeList.tasks.push(new Task(todo, true, important));
  } else {
    activeList.tasks.push(new Task(todo, done, important));
  }
  updateList();
  taskMainInput.value = "";
  taskMainCheckbox.checked = false;
  taskMainInput.blur();
};
// Update tasks function
const updateTask = () => {
  tasksBlock.innerHTML = "";
  activeList.tasks.forEach((item, index, array) => {
    tasksBlock.innerHTML += taskTemplate(item, index);
    if (item.done) {
      lists[3].tasks.push(item);
      array.splice(index, 1);
    } else if (!item.done && activeList === lists[3]) {
      lists[0].tasks.push(item);
      array.splice(index, 1);
    }
  });
};
const updateDone = (index) => {
  activeList.tasks[index].done = !activeList.tasks[index].done;
  updateList();
};

// </functions> ===================================================================================

// <event listening> ===================================================================================
// Creating new list
listSubmit.addEventListener("click", () => {
  createList(listInput.value);
});
// Renaming list
taskMainTitleEditable.addEventListener("input", () => {
  resizeList(taskMainTitleEditable);
  renameList(taskMainTitleEditable.value, true);
});
taskMainTitleEditable.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    renameList(taskMainTitleEditable.value);
    taskMainTitleEditable.blur();
  }
});
taskMainTitleEditable.addEventListener("blur", () => {
  renameList(taskMainTitleEditable.value);
});

taskMainSubmit.addEventListener("click", () => {
  createTask(taskMainInput.value, taskMainCheckbox.checked);
});
taskMainInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    createTask(taskMainInput.value, taskMainCheckbox.checked);
  }
});
// </event listening> ===================================================================================
// </functional> ================
// </To do - App> ================================================================================================

updateList();
