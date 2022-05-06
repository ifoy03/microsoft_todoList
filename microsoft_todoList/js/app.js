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

// <main>===================================================================================
const listsBlockUser = document.querySelector(".tasks-user");
const listsBlockInput = document.querySelector(".tasks-menu__input");
const listsBlockMain = document.querySelector(".tasks-main");
const activeUserListTitle = document.querySelector(".tasks__title-input");
const listInput = document.querySelector(".app__interface--text");
const listInputCheckbox = document.querySelector(".app__interface--checkbox");
const tasksBlock = document.querySelector(".app__tasks");
let currentList = null;
// constructor
function List(title, active, main) {
  this.title = title;
  this.active = active;
  this.main = main;
  this.tasks = [];
}

function Task(todo, done, important, from, which) {
  this.todo = todo;
  this.done = done;
  this.important = important;
  this.from = from;
  this.which = which;
}

let lists = [
  {
    title: "Главные таски для сайта",
    active: true,
    main: true,
    tasks: [
      {
        todo: "Анализ верстки, обнаружение глобальных блоков, выгрузка фонтов и изображений",
        done: false,
        important: true,
      },
      {
        todo: "Инициализирование проекта, создание структуру файлов, верстка сетки и контейнера",
        done: false,
        important: true,
      },
      {
        todo: "Обнаружение всех разрешений для адаптива и определиться с методом верстки (mobile first или desktop first)",
        done: false,
        important: true,
      },
      {
        todo: "Верстка глобальных элементов, адаптивность и сразу интерактив js (если нужен)",
        done: false,
        important: true,
      },
      {
        todo: "Верстка самого сайта (на этом этапе уже можно создовать групы тасков и конечно таски для проекта",
        done: false,
        important: false,
      },
    ],
  },
  {
    title: "Готовые таски",
    active: false,
    main: true,
    tasks: [],
    completedGr: true,
  },
  {
    title: "Корзина",
    active: false,
    main: true,
    tasks: [],
  },
];
let completedGr = lists.find((item) => item.completedGr);
// </main> ===================================================================================//

// list template function
const listTemplate = (item, index) => {
  return `<li onclick="activeList(${index})" class="tasks-group__item _list row ${
    item.active ? "_active" : ""
  } ">
  <span class="task-group__item--title">${item.title}</span>     
  <span class="tasks-group__item--count">${
    item.tasks.length ? item.tasks.length : ""
  }</span>
  </li>`;
};
// task template function
const taskTemplate = (item, index) => {
  return `<li oncontextmenu="deleteTask(${index})" class="app__tasks--item row ${
    item.done ? "_completed" : ""
  } ${item.important ? "_important" : ""}">
  <div>
    <input onclick="doneTask(${index})" class="app__tasks--checkbox" type="checkbox" ${
    item.done ? "checked" : ""
  }/>
    <span class="app__tasks--title">${item.todo}</span>
  </div>
  isImportant: ${item.important}
</li>`;
};

const updateList = () => {
  listsBlockUser.innerHTML = "";
  listsBlockMain.innerHTML = "";
  lists.forEach((item, index) => {
    if (item.main) {
      listsBlockMain.innerHTML += listTemplate(item, index);
    } else {
      listsBlockUser.innerHTML += listTemplate(item, index);
    }
  });
};
const activeList = (id) => {
  updateActiveStatusList();
  lists[id].active = true;
  activeListDeterminer();
  showActiveList();
  updateList();
};
const updateActiveStatusList = () => {
  lists.forEach((item) => {
    item.active = false;
  });
};
const activeListDeterminer = () => {
  lists.forEach((item) => {
    item.active ? (currentList = item) : null;
  });
};
const createList = (title, active = false, main = false) => {
  if (title) {
    lists.push(new List(title, active, main));
  }
  updateList();
};
const updateTasksList = () => {
  tasksBlock.innerHTML = "";
  currentList.tasks.forEach((item, index) => {
    tasksBlock.innerHTML += taskTemplate(item, index, item.from);
  });
};
const showActiveList = () => {
  activeUserListTitle.value = currentList.title;
  updateTasksList();
};

const createTask = (
  todo,
  done = false,
  important = false,
  from = null,
  which = null
) => {
  if (currentList) {
    if (todo) {
      currentList.tasks.push(
        new Task(todo, done, important, currentList, currentList.tasks.length)
      );
    }
    markAsDoneTask();
    updateTasksList();
  } else if (!lists.length) alert("Создайте список !");
};
const deleteTask = (index) => {
  window.event.preventDefault();
  currentList.tasks.splice(index, 1);
  updateTasksList();
  updateList();
};

const doneTask = (index) => {
  currentList.tasks[index].done = !currentList.tasks[index].done;
  checkSound();
  if (currentList.tasks[index].done) {
    let taskLi = document.querySelectorAll(".app__tasks--item");
    taskLi[index].classList.add("_completedAnim");
  }
  setTimeout(function () {
    markAsDoneTask();
    updateTasksList();
  }, 100);
};
const markAsDoneTask = () => {
  currentList.tasks.forEach((item, index, array) => {
    if (item.done) {
      completedGr.tasks.push(item);
      array.splice(index, 1);
    }
  });
  updateList();
};
const initApp = () => {
  updateList();
  activeListDeterminer();
  showActiveList();
};
const checkSound = () => {
  let audio = new Audio(); // Создаём новый элемент Audio
  audio.src = "../files/audio/checkmark.mp3"; // Указываем путь к звуку "клика"
  audio.autoplay = true; // Автоматически запускаем
};
listInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    createTask(listInput.value, listInputCheckbox.checked);
    listInput.value = "";
    listInputCheckbox.checked = false;
  }
});
listsBlockInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    updateActiveStatusList();
    createList(listsBlockInput.value, true);
    activeListDeterminer();
    showActiveList();
    listsBlockInput.value = "";
  }
});
initApp();
