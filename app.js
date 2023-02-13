// variables
const todoInput = document.querySelector("input[type='text']");
const todoListUlEl = document.querySelector(".todo-list ul");
const clearBtn = document.querySelector(".clear");
let todos = JSON.parse(localStorage.getItem("todo-list"));
// event listener
addEventListener("DOMContentLoaded", () => {
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
  const heroEl = document.querySelector(".hero");
  const modeToggleBtn = document.querySelector(".modeToggle-btn");
  const moonIcon = document.querySelector(".moon");
  const sunIcon = document.querySelector(".sun");
  const bodyClass = document.body.classList;
  let mode;

  modeToggleBtn.addEventListener("click", () => {
    const windowsWidth = window.innerWidth;
    mode = windowsWidth > 648 ? "desktop" : "mobile";

    if (!bodyClass.contains("dark-mode")) {
      bodyClass.add("dark-mode");
      sunIcon.classList.add("show");
      moonIcon.classList.add("show");
      heroEl.style.backgroundImage = ` url(/images/bg-${mode}-dark.jpg)`;
    } else {
      bodyClass.remove("dark-mode");
      sunIcon.classList.remove("show");
      moonIcon.classList.remove("show");
      heroEl.style.backgroundImage = ` url(/images/bg-${mode}-light.jpg)`;
    }
  });
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
  const pendingTodo = document.querySelector(".undone-total");
  const pendingTodoNumber = todos.filter((list) => list.status == "pending");
  pendingTodo.textContent = pendingTodoNumber.length;
}
