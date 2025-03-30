
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

const apiKey = '5f4ec6a1f0b745eca5157c7977a45f1a'; 

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
            <p id="weather-info-${event.id}">Cargando clima...</p>  <!-- Aquí se mostrará el clima -->
            <div class="button-container">
                <button onclick="editEvent(${event.id})">Edit</button>
                <button onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        `;

        // Obtener y mostrar el clima para este evento
        getWeatherForEvent(event, (weatherText) => {
            const weatherInfoElement = document.getElementById(`weather-info-${event.id}`);
            weatherInfoElement.textContent = weatherText;
        });

        // Agregar el evento a la lista
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


// Función para obtener el clima para la fecha y hora del evento
function getWeatherForEvent(event, callback) {
    // Ubicación por defecto: Madrid
    const lat = 40.4168;
    const lon = -3.7038;

    // Crear un objeto Date para el evento, obteniendo la fecha y hora
    const eventDate = new Date(`${event.eventDate}T${event.eventTime}`);
    
    // Formatear la fecha en 'YYYY-MM-DD' para la API
    const formattedDate = eventDate.toISOString().split('T')[0];

    // Llamada a la API de Open-Meteo para obtener el clima para esa fecha
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe/Madrid`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.daily && data.daily.time) {
                const index = data.daily.time.indexOf(formattedDate);
                if (index !== -1) {
                    const maxTemp = data.daily.temperature_2m_max[index];
                    const minTemp = data.daily.temperature_2m_min[index];
                    const precipitation = data.daily.precipitation_sum[index];

                    // Crear el texto con la información del clima
                    const weatherText = `Max: ${maxTemp}°C | Min: ${minTemp}°C | Precip: ${precipitation}mm`;
                    callback(weatherText);
                } else {
                    callback("Clima no disponible para esta fecha.");
                }
            } else {
                callback("Error obteniendo clima.");
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            callback("Error en la API del clima.");
        });
}

function getNews() {
    const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=6&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                renderNews(data.articles);  // Llamamos a la función que renderiza las noticias
            } else {
                alert("Error al obtener noticias");
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
}

function renderNews(articles) {
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = ""; // Limpiar antes de renderizar nuevas noticias

    articles.forEach(article => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");

        // Crear el contenido HTML para cada noticia
        newsItem.innerHTML = `
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.description}</p>
            <p><strong>Source:</strong> ${article.source.name}</p>
            <p><strong>Published at:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
        `;

        // Agregar la noticia al contenedor
        newsContainer.appendChild(newsItem);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("TaskPlanner initialized");
    loadTasks();      // Cargar las tareas
    loadEvents();     // Cargar los eventos
    getNews();        // Cargar noticias al inicio
    document.getElementById("task-form").addEventListener("submit", addTask);
    document.getElementById("event-form").addEventListener("submit", addEvent);
});