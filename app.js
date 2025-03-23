document.addEventListener("DOMContentLoaded", () => {
    console.log("TaskPlanner initialized");
    loadTasks();
    document.getElementById("task-form").addEventListener("submit", addTask);
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask(event) {
    event.preventDefault();
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-desc").value.trim();
    const dueDate = document.getElementById("task-date").value;
    const status = document.getElementById("task-status").value; // Obtener estado

    if (!title || !dueDate) {
        alert("Title and due date are required!");
        return;
    }

    const newTask = { id: Date.now(), title, description, dueDate, status };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    document.getElementById("task-form").reset();
}

function loadTasks() {
    renderTasks();
}

function renderTasks() {
    const pendingList = document.getElementById("pending-tasks");
    const inProgressList = document.getElementById("inprogress-tasks");
    const completedList = document.getElementById("completed-tasks");
    
    pendingList.innerHTML = "";
    inProgressList.innerHTML = "";
    completedList.innerHTML = "";

    // Filtrar tareas por estado
    const pending = tasks.filter(task => task.status === "pending");
    const inProgress = tasks.filter(task => task.status === "inprogress");
    const completed = tasks.filter(task => task.status === "completed");

    // Llamar a la función para verificar si las listas tienen tareas y agregar o quitar el borde
    toggleTaskListBorder(pendingList, pending);
    toggleTaskListBorder(inProgressList, inProgress);
    toggleTaskListBorder(completedList, completed);

    // Renderizar las tareas en las columnas correspondientes
    pending.forEach(task => appendTaskToColumn(pendingList, task));
    inProgress.forEach(task => appendTaskToColumn(inProgressList, task));
    completed.forEach(task => appendTaskToColumn(completedList, task));
}

function toggleTaskListBorder(taskListElement, taskArray) {
    if (taskArray.length > 0) {
        taskListElement.classList.add("task-list-with-border");
    } else {
        taskListElement.classList.remove("task-list-with-border");
    }
}

function appendTaskToColumn(taskListElement, task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p><strong>Due:</strong> ${task.dueDate}</p>
        <select onchange="updateStatus(${task.id}, this.value)">
            <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="inprogress" ${task.status === "inprogress" ? "selected" : ""}>In Progress</option>
            <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
        </select>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskListElement.appendChild(taskItem);
}

function updateStatus(id, newStatus) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-desc").value = task.description;
        document.getElementById("task-date").value = task.dueDate;
        document.getElementById("task-status").value = task.status;
        deleteTask(id);
    }
}
