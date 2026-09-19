const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");

const empty = document.querySelector("#empty-state");

const total = document.querySelector("#total-count");
const completed = document.querySelector("#completed-count");
const pending = document.querySelector("#pending-count");

const percent = document.querySelector("#progress-percent");
const fill = document.querySelector("#progress-fill");

const filters = document.querySelectorAll(".filter");

const clearBtn = document.querySelector("#clear-completed");

const modal = document.querySelector("#edit-modal");

const editInput = document.querySelector("#edit-input");

const saveBtn = document.querySelector("#save-edit");

const cancelBtn = document.querySelector("#cancel-edit");

const closeBtn = document.querySelector("#close-modal");

let todos = [];
let currentFilter = "all";
let editingId = null;

// Date
function showDate() {
  const now = new Date();

  document.querySelector("#day").textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  document.querySelector("#date").textContent = now.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

showDate();

// Add
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  todos.unshift({
    id: Date.now(),
    text: text,
    completed: false,
  });

  input.value = "";

  render();

  input.focus();
});

// Render
function render() {
  list.innerHTML = "";

  let data = todos;

  if (currentFilter === "active") {
    data = todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    data = todos.filter((todo) => todo.completed);
  }

  data.forEach((todo) => {
    const item = document.createElement("div");

    item.className = "todo-item";

    if (todo.completed) {
      item.classList.add("completed");
    }

    item.innerHTML = `

      <button
        class="check-btn"
        onclick="toggleTodo(${todo.id})"
      >
        ${todo.completed ? "✓" : ""}
      </button>

      <div class="task-content">
        <p class="task-text">
          ${escapeHTML(todo.text)}
        </p>
      </div>

      <div class="task-actions">

        <button
          class="task-action"
          onclick="editTodo(${todo.id})"
        >
          ✎
        </button>

        <button
          class="task-action delete"
          onclick="deleteTodo(${todo.id})"
        >
          🗑
        </button>

      </div>
    `;

    list.appendChild(item);
  });

  update(data);
}

// Safe text
function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// Complete
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }

    return todo;
  });

  render();
}

// Delete
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);

  render();
}

// Edit
function editTodo(id) {
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) return;

  editingId = id;

  editInput.value = todo.text;

  modal.classList.add("show");

  editInput.focus();
}

// Save edit
saveBtn.addEventListener("click", function () {
  const text = editInput.value.trim();

  if (!text) return;

  todos = todos.map((todo) => {
    if (todo.id === editingId) {
      return {
        ...todo,
        text: text,
      };
    }

    return todo;
  });

  closeModal();

  render();
});

// Close modal
function closeModal() {
  modal.classList.remove("show");

  editingId = null;

  editInput.value = "";
}

cancelBtn.addEventListener("click", closeModal);

closeBtn.addEventListener("click", closeModal);

// Filters
filters.forEach((button) => {
  button.addEventListener("click", function () {
    filters.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    render();
  });
});

// Clear completed
clearBtn.addEventListener("click", function () {
  todos = todos.filter((todo) => !todo.completed);

  render();
});

// Update
function update(data) {
  const all = todos.length;

  const done = todos.filter((todo) => todo.completed).length;

  const left = all - done;

  const progress = all === 0 ? 0 : Math.round((done / all) * 100);

  total.textContent = all;
  completed.textContent = done;
  pending.textContent = left;

  percent.textContent = progress;
  fill.style.width = `${progress}%`;

  empty.style.display = data.length === 0 ? "block" : "none";
}

render();
