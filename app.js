// variables
const todoInput = document.querySelector("input[type='text']");
const todoListUlEl = document.querySelector(".todo-list ul");
const clearBtn = document.querySelector(".clear");
const heroEl = document.querySelector(".hero");
const modeToggleBtn = document.querySelector(".modeToggle-btn");
const moonIcon = document.querySelector(".moon");
const sunIcon = document.querySelector(".sun");
const bodyClass = document.body;
let todos = JSON.parse(localStorage.getItem("todo-list"));
let bgMode = JSON.parse(localStorage.getItem("bg-mode"));
let mode;
let setBackgroundMode;
let storeMode;

// event listener
addEventListener("DOMContentLoaded", () => {
  setBackground();
  renderPendingTodoNumber();
  toggleDarkAndLightModeBg();
  renderTodoList();
  displayTodoOnUi();
  filterByTodoCategories();
});

// clear complected todo
clearBtn.addEventListener("click", clearComplectedTodo);

// set input value to empty string if user clicked outside the input
document.addEventListener("click", (e) => {
  if (e.target !== todoInput) {
    todoInput.value = "";
  }
});

// functions
function toggleDarkAndLightModeBg() {
  modeToggleBtn.addEventListener("click", () => {
    // store background color on local storage

    if (bgMode) {
      storeMode = bgMode[0].mode == "dark-mode" ? "" : "dark-mode";
      icon = bgMode[0].showIcon == "show" ? "" : "show";
    } else {
      storeMode = "dark-mode";
      icon = "show";
      bgMode = [];
    }

    bgMode[0] = {
      mode: storeMode,
      showIcon: icon,
    };

    // store current background to local storage
    localStorage.setItem("bg-mode", JSON.stringify(bgMode));
    setBackground();
  });
}

function setBackground() {
  if (bgMode) {
    let windowsWidth = window.innerWidth;
    mode = windowsWidth > 648 ? "desktop" : "mobile";

    bodyClass.classList = bgMode[0].mode;
    sunIcon.className = `sun ${bgMode[0].showIcon}`;
    moonIcon.classList = `moon ${bgMode[0].showIcon}`;

    setBackgroundMode = bodyClass.classList.contains("dark-mode")
      ? ` url(/images/bg-${mode}-dark.jpg)`
      : ` url(/images/bg-${mode}-light.jpg)`;

    heroEl.style.backgroundImage = setBackgroundMode;
  }
}

function updateStat(inputEl) {
  let paragraphEl = inputEl.parentNode.querySelector("p");
  const inputId = inputEl.id;

  if (inputEl.checked) {
    paragraphEl.classList.add("done");
    // change status on todo array
    todos[inputId].status = "done";
  } else {
    paragraphEl.classList.remove("done");
    // change status on todo array
    todos[inputId].status = "pending";
  }

  // store status update on local storage
  localStorage.setItem("todo-list", JSON.stringify(todos));

  // display the total number of pending todos
  renderPendingTodoNumber();
}

function deleteTodo(delItem) {
  todos.splice(delItem, 1);

  // store todos to local storage
  localStorage.setItem("todo-list", JSON.stringify(todos));
  // display remaining todo list
  displayTodoOnUi();
  // display the total number of pending todos
  renderPendingTodoNumber();
}

function displayTodoOnUi(todoArray = todos) {
  if (todos) {
    todoListUlEl.innerHTML = todoArray
      .map((item, index) => {
        let todoStat = item.status === "done" ? "checked" : "";
        return `<li class="flex">
            <label for=${index} class="flex">
              <input onclick="updateStat(this)" type="checkbox" id=${index} ${todoStat}>
              <p class =${item.status}>${item.task}</p>
            </label>
            <button onclick = deleteTodo(${index})>
            <img src="/images/icon-cross.svg" alt="delete todo">
            </button>
          </li>`;
      })
      .join("");
  }
}

function renderTodoList() {
  todoInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && todoInput.value) {
      if (!todos) {
        todos = [];
      }

      const taskInfo = {
        task: todoInput.value,
        status: "pending",
      };

      todos.push(taskInfo);

      localStorage.setItem("todo-list", JSON.stringify(todos));
      todoInput.value = "";

      displayTodoOnUi();

      // display the total number of pending todos
      renderPendingTodoNumber();
    }
  });
}

function clearComplectedTodo() {
  if (todos) {
    const fliteredTodo = todos.filter((item) => item.status == "pending");

    todos = fliteredTodo;
    localStorage.setItem("todo-list", JSON.stringify(todos));

    displayTodoOnUi();
  }
}

function filterByTodoCategories() {
  if (todos) {
    const catBtn = document.querySelectorAll(".categories-box button");

    catBtn.forEach((btns) => {
      btns.addEventListener("click", (e) => {
        // remove theclass "active" from previously selected btn
        const activeEl = document.querySelector(".active");
        activeEl.classList.remove("active");

        //  add the class "active" to currently selected btn
        e.currentTarget.classList.add("active");

        // filter todo by selected category
        const todosCategories = e.currentTarget.dataset.category;
        let category;

        console.log(todosCategories);
        if (todosCategories === "all") {
          displayTodoOnUi();
        } else if (todosCategories === "active") {
          category = todos.filter((item) => item.status == "pending");
          displayTodoOnUi(category);
        } else {
          category = todos.filter((item) => item.status == "done");
          displayTodoOnUi(category);
        }
      });
    });
  }
}

function renderPendingTodoNumber() {
  if (todos) {
    const pendingTodo = document.querySelector(".undone-total");
    const pendingTodoNumber = todos.filter((list) => list.status == "pending");
    pendingTodo.textContent = pendingTodoNumber.length;
  }
}
