document.addEventListener("DOMContentLoaded", () => {
    console.log("TaskPlanner initialized");
    loadTasks();
    loadEvents();
    document.getElementById("task-form").addEventListener("submit", addTask);
    document.getElementById("event-form").addEventListener("submit", addEvent);
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

// Función para agregar una tarea
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

    console.log("Nueva tarea creada: ", newTask);

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    document.getElementById("task-form").reset();
}

// Cargar tareas del localStorage
function loadTasks() {
    renderTasks();
}

function renderTasks(filter = "all") {
    const pendingList = document.getElementById("pending-tasks");
    const inProgressList = document.getElementById("inprogress-tasks");
    const completedList = document.getElementById("completed-tasks");

    const pendingColumn = document.getElementById("pending-column");
    const inProgressColumn = document.getElementById("inprogress-column");
    const completedColumn = document.getElementById("completed-column");
    const taskContainer = document.querySelector(".task-columns");

    pendingList.innerHTML = "";
    inProgressList.innerHTML = "";
    completedList.innerHTML = "";

    let filteredTasks = tasks;
    if (filter !== "all") {
        filteredTasks = tasks.filter(task => task.status === filter);
    }

    pendingColumn.classList.add("hidden");
    inProgressColumn.classList.add("hidden");
    completedColumn.classList.add("hidden");

    if (filter === "all" || filter === "pending") {
        pendingColumn.classList.remove("hidden");
        filteredTasks
            .filter(task => task.status === "pending")
            .forEach(task => appendTaskToColumn(pendingList, task));
    }
    if (filter === "all" || filter === "inprogress") {
        inProgressColumn.classList.remove("hidden");
        filteredTasks
            .filter(task => task.status === "inprogress")
            .forEach(task => appendTaskToColumn(inProgressList, task));
    }
    if (filter === "all" || filter === "completed") {
        completedColumn.classList.remove("hidden");
        filteredTasks
            .filter(task => task.status === "completed")
            .forEach(task => appendTaskToColumn(completedList, task));
    }

    // Centrar la columna si solo hay una visible
    const visibleColumns = document.querySelectorAll(".task-column:not(.hidden)");
    if (visibleColumns.length === 1) {
        visibleColumns[0].classList.add("centered");
    } else {
        document.querySelectorAll(".task-column").forEach(col => col.classList.remove("centered"));
    }
}


function filterTasks() {
    const filterValue = document.getElementById("task-filter").value;
    renderTasks(filterValue);
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
        renderTasks(document.getElementById("task-filter").value);
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(document.getElementById("task-filter").value);
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

// Función para agregar un evento
function addEvent(event) {
    event.preventDefault();

    const title = document.getElementById("event-title").value.trim();
    const description = document.getElementById("event-desc").value.trim();
    const eventDate = document.getElementById("event-date").value;
    const eventTime = document.getElementById("event-time").value;

    if (!title || !eventDate || !eventTime) {
        alert("Title, date, and time are required for events!");
        return;
    }

    const eventDateTime = new Date(`${eventDate}T${eventTime}`);

    const newEvent = {
        id: Date.now(),
        title,
        description,
        eventDateTime,
        eventDate,
        eventTime
    };

    console.log("Nuevo evento creado: ", newEvent);

    events.push(newEvent);

    localStorage.setItem("events", JSON.stringify(events));

    renderEvents();

    document.getElementById("event-form").reset();
}

// Cargar eventos del localStorage
function loadEvents() {
    renderEvents();
}

// Renderizar eventos
function renderEvents() {
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = ""; // Limpiar la lista de eventos antes de renderizarla

    // Ordenar los eventos por fecha y hora
    events.sort((a, b) => a.eventDateTime - b.eventDateTime);

    events.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-item");

        // Crear el contenido HTML para cada evento
        eventItem.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Event Time:</strong> ${event.eventDate} ${event.eventTime}</p>
            <!-- Contenedor para los botones -->
            <div class="button-container">
                <button onclick="editEvent(${event.id})">Edit</button>
                <button onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        `;
        
        // Agregar el evento a la lista de eventos
        eventList.appendChild(eventItem);
    });
}


function deleteEvent(id) {
    events = events.filter(event => event.id !== id);
    localStorage.setItem("events", JSON.stringify(events));
    renderEvents();
}

function editEvent(id) {
    const event = events.find(event => event.id === id);
    if (event) {
        document.getElementById("event-title").value = event.title;
        document.getElementById("event-desc").value = event.description;
        document.getElementById("event-date").value = event.eventDate;
        document.getElementById("event-time").value = event.eventTime;

        // Cambiar el texto del botón a "Update Event"
        const eventForm = document.getElementById("event-form");
        const submitButton = eventForm.querySelector("button");
        submitButton.textContent = "Update Event";

        // Manejar el envío para actualizar el evento
        eventForm.onsubmit = function(e) {
            e.preventDefault();

            event.title = document.getElementById("event-title").value.trim();
            event.description = document.getElementById("event-desc").value.trim();
            event.eventDate = document.getElementById("event-date").value;
            event.eventTime = document.getElementById("event-time").value;

            // Actualizar el evento en el array
            localStorage.setItem("events", JSON.stringify(events));

            // Volver a renderizar la lista de eventos
            renderEvents();

            // Resetear el formulario y el texto del botón
            eventForm.reset();
            submitButton.textContent = "Add Event";
        };

        // Eliminar el evento cuando se edite
        deleteEvent(id);
    }
}
