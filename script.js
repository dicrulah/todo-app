// 1. Find the parts of the page we need to control
const form = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dueInput = document.getElementById("dueInput");
const priorityInput = document.getElementById("priorityInput");
const errorMsg = document.getElementById("error");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
const filterButtons = document.querySelectorAll(".filter");

// 2. Our memory: the list of tasks, which filter is chosen, and which task is being edited
let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (e) {
  tasks = []; // if saved data is broken, start fresh
}
let currentFilter = "all";
let editingId = null;

// 3. Save the tasks in the browser so they survive a refresh
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 4. Add a new task when the form is submitted (Add button or Enter key)
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  const text = taskInput.value.trim();

  // Do not allow empty tasks
  if (text === "") {
    errorMsg.hidden = false;
    return;
  }
  errorMsg.hidden = true;

  tasks.push({
    id: Date.now(), // a unique number for each task
    text: text,
    due: dueInput.value, // empty if no date chosen
    priority: priorityInput.value,
    done: false
  });

  // Clear the form ready for the next task
  taskInput.value = "";
  dueInput.value = "";
  priorityInput.value = "medium";
  saveTasks();
  render();
});

// 5. Save the new text after editing a task
function saveEdit(task, newText) {
  const cleaned = newText.trim();
  if (cleaned !== "") {
    task.text = cleaned; // empty edits are ignored
  }
  editingId = null;
  saveTasks();
  render();
}

// 6. Draw the task list on the screen (runs after every change)
function render() {
  list.innerHTML = "";
  const today = new Date().toLocaleDateString("en-CA"); // today as YYYY-MM-DD

  // Pick which tasks to show based on the filter
  const shown = tasks.filter(function (t) {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  // Friendly message when there is nothing to show
  if (shown.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No tasks here yet. Add one above.";
    list.appendChild(empty);
  }

  shown.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task priority-" + task.priority + (task.done ? " done" : "");

    // Checkbox to mark the task done or not done
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = task.done;
    box.setAttribute("aria-label", "Mark task as done");
    box.addEventListener("change", function () {
      task.done = box.checked;
      saveTasks();
      render();
    });

    const body = document.createElement("div");
    body.className = "body";
    const actions = document.createElement("div");
    actions.className = "actions";
    const editBtn = document.createElement("button");
    editBtn.type = "button";

    if (editingId === task.id) {
      // Edit mode: show a text box instead of the text
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "edit-input";
      editInput.value = task.text;
      editInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") saveEdit(task, editInput.value);
        if (e.key === "Escape") { editingId = null; render(); }
      });
      body.appendChild(editInput);
      editBtn.textContent = "Save";
      editBtn.addEventListener("click", function () { saveEdit(task, editInput.value); });
      setTimeout(function () { editInput.focus(); }, 0);
    } else {
      // Normal mode: show the task text and its details
      const text = document.createElement("div");
      text.className = "text";
      text.textContent = task.text; // textContent keeps typed text safe

      const meta = document.createElement("div");
      meta.className = "meta";
      let info = task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + " priority";
      if (task.due) info += " | Due " + task.due;
      meta.textContent = info;
      if (task.due && task.due < today && !task.done) {
        meta.classList.add("overdue");
        meta.textContent = info + " (overdue)";
      }

      body.appendChild(text);
      body.appendChild(meta);
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", function () { editingId = task.id; render(); });
    }

    // Delete button removes the task
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", function () {
      tasks = tasks.filter(function (t) { return t.id !== task.id; });
      saveTasks();
      render();
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(box);
    li.appendChild(body);
    li.appendChild(actions);
    list.appendChild(li);
  });

  // Update the "X tasks left" counter
  const left = tasks.filter(function (t) { return !t.done; }).length;
  counter.textContent = left + (left === 1 ? " task left" : " tasks left");
}

// 7. Filter buttons: All, Active, Done
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    render();
  });
});

// 8. Clear completed: keep only the tasks that are not done
clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  render();
});

// 9. Dark mode: switch the theme and remember the choice
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "Light" : "Dark";
  localStorage.setItem("theme", theme);
}
themeBtn.addEventListener("click", function () {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
});
// On first visit, follow the phone or computer's own setting
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

// 10. Show the tasks when the page first opens
render();
