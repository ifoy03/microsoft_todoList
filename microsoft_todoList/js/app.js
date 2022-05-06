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

// <constructor>===================================================================================
// list constructor
function List(title, active, main) {
  this.title = title;
  this.active = active;
  this.main = main;
  this.tasks = [];
}
// </constructor> ===================================================================================//

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

const todo = {
  variables() {
    const tasksBlock = document.querySelector(".app__tasks");
    const taskMainCheckbox = document.querySelector(".app__interface--checkbox");
    const taskMainInput = document.querySelector(".app__interface--text");
    let tasks = [];
    return {
      tasksBlock: tasksBlock,
      taskMainCheckbox: taskMainCheckbox,
      taskMainInput: taskMainInput,
      tasks: tasks,
    };
  },
  init() {
    function Task(todo, done, important) {
      this.todo = todo;
      this.done = done;
      this.important = important;
    }
    todo.variables().taskMainInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        todo.createTask(e.target.value, todo.variables().taskMainCheckbox.checked);
      }
    });
  },
  fillHtml(item, index) {
    return `<li class="app__tasks--item row">
    <div>
      <input onclick="updateDone(${index})" class="app__tasks--checkbox" type="checkbox" ${item.done ? "checked" : ""}/>
      <span class="app__tasks--title">${item.todo}</span>
    </div>
    isImportant: ${item.important}
  </li>`;
  },
};
todo.init();
