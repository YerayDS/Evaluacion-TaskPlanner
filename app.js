document.addEventListener("DOMContentLoaded", () => {
    console.log("TaskPlanner initialized");
    loadTasks();
    document.getElementById("task-form").addEventListener("submit", addTask);
    document.getElementById("event-form").addEventListener("submit", addEvent);
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

function addTask(event) {
    event.preventDefault(); 

    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-desc").value.trim();
    const dueDate = document.getElementById("task-date").value;
    const status = document.getElementById("task-status").value;

    if (!title || !dueDate) {
        alert("Title and due date are required!");
        return;
    }

    const taskDate = new Date(dueDate); 

    const newTask = { 
        id: Date.now(), 
        title, 
        description, 
        dueDate, 
        status, 
        taskDate 
    };

    console.log("Nueva tarea creada: ", newTask); // Depuración

    // Agregar la tarea al arreglo de tareas
    tasks.push(newTask);

    // Guardar las tareas en el localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Volver a renderizar las tareas
    renderTasks();

    // Limpiar el formulario
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

    // Ordenar las tareas por fecha (de más antiguo a más reciente)
    pending.sort((a, b) => a.taskDate - b.taskDate);
    inProgress.sort((a, b) => a.taskDate - b.taskDate);
    completed.sort((a, b) => a.taskDate - b.taskDate);

    // Renderizar las tareas en las columnas correspondientes
    pending.forEach(task => appendTaskToColumn(pendingList, task));
    inProgress.forEach(task => appendTaskToColumn(inProgressList, task));
    completed.forEach(task => appendTaskToColumn(completedList, task));
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
        document.getElementById("task-date").value = task.dueDate; // Solo fecha
        document.getElementById("task-status").value = task.status;
        deleteTask(id);
    }
}

function addEvent(event) {
    event.preventDefault();

    const title = document.getElementById("event-title").value.trim();
    const description = document.getElementById("event-desc").value.trim();
    const eventDate = document.getElementById("event-date").value;
    const eventTime = document.getElementById("event-time").value; // Aquí está la hora del evento

    if (!title || !eventDate || !eventTime) {
        alert("Title, date, and time are required for events!");
        return;
    }

    // Convertir la fecha y hora a un objeto Date
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);

    const newEvent = {
        id: Date.now(),
        title,
        description,
        eventDateTime,
        eventDate,
        eventTime
    };

    console.log("Nuevo evento creado: ", newEvent); // Depuración

    // Agregar el evento al arreglo de eventos
    events.push(newEvent);

    // Guardar los eventos en localStorage
    localStorage.setItem("events", JSON.stringify(events));

    // Volver a renderizar los eventos
    renderEvents();

    // Limpiar el formulario
    document.getElementById("event-form").reset();
}

function renderEvents() {
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = "";

    // Ordenar eventos por fecha y hora
    events.sort((a, b) => a.eventDateTime - b.eventDateTime);

    events.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-item");
        eventItem.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Event Time:</strong> ${event.eventDate} ${event.eventTime}</p>
            <button onclick="deleteEvent(${event.id})">Delete</button>
        `;
        eventList.appendChild(eventItem);
    });
}

function deleteEvent(id) {
    events = events.filter(event => event.id !== id);
    localStorage.setItem("events", JSON.stringify(events));
    renderEvents();
}
