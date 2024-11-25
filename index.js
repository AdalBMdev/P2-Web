let allHabits = [];
const storageKey = 'completedHabits';

if ("Notification" in window) {
    Notification.requestPermission()
        .then(permission => {
            if (permission === "granted") {
                console.log("Permiso de notificaciones concedido.");
            } else if (permission === "denied") {
                alert("Has denegado las notificaciones. No recibirás recordatorios.");
            } else {
                alert("No has respondido al permiso de notificaciones.");
            }
        })
        .catch(err => console.error("Error al solicitar permiso de notificaciones:", err));
}

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

// Función para mostrar notificaciones en la página
function showOnPageNotification(title, message) {
    const notificationsContainer = document.getElementById('notifications');

    const notification = document.createElement('div');
    notification.classList.add('notification-item');

    const notificationTitle = document.createElement('h4');
    notificationTitle.textContent = title;

    const notificationMessage = document.createElement('p');
    notificationMessage.textContent = message;

    notification.appendChild(notificationTitle);
    notification.appendChild(notificationMessage);

    
    notification.style.opacity = 0;
    notificationsContainer.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = 1;
    }, 10);

    
    setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

function showNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body });
    }
    showOnPageNotification(title, body);
}

const frequencySelect = document.getElementById("habitFrequency");
const daysSelectionContainer = document.getElementById("daysSelection");

frequencySelect.addEventListener("change", (e) => {
    const selectedFrequency = e.target.value;

    if (selectedFrequency === "Personalizado") {
        daysSelectionContainer.style.display = "block";
    } else {
        daysSelectionContainer.style.display = "none";
    }
});

function loadCompletedHabits() {
    const storedData = JSON.parse(localStorage.getItem(storageKey));
    const today = new Date().toISOString().split('T')[0];

    if (storedData && storedData.date === today) {
        return new Set(storedData.habits.map(h => h.name));
    } else {
        localStorage.setItem(storageKey, JSON.stringify({ date: today, habits: [] }));
        return new Set();
    }
}

function saveCompletedHabit(habitName) {
    const today = new Date().toISOString().split('T')[0];
    let completedHabitsData = JSON.parse(localStorage.getItem(storageKey)) || { date: today, habits: [] };

    if (completedHabitsData.date !== today) {
        completedHabitsData = { date: today, habits: [] };
    }

    const habitIndex = completedHabitsData.habits.findIndex(h => h.name === habitName);
    if (habitIndex > -1) {
        completedHabitsData.habits[habitIndex].completedCount += 1;
    } else {
        completedHabitsData.habits.push({ name: habitName, completedCount: 1 });
    }

    localStorage.setItem(storageKey, JSON.stringify(completedHabitsData));
}

let completedHabits = loadCompletedHabits();

function loadHabits() {
    fetch('http://localhost:3000/api/habits')
        .then(response => response.json())
        .then(data => {
            allHabits = data;
            displayHabits();
        })
        .catch(error => console.error('Error:', error));
}

function displayHabits() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    allHabits.forEach(habit => {
        if (!completedHabits.has(habit.name)) {
            const li = document.createElement('li');
            li.classList.add('habit-card');
            li.innerHTML = `
                <input type="checkbox" onchange="completeHabit('${habit.name}')"> 
                ${habit.name} 
                <button class="btn-delete" onclick="deleteHabit('${habit._id}')">🗑️</button>
            `;
            habitList.appendChild(li);
        }
    });
}

function completeHabit(habitName) {
    completedHabits.add(habitName);
    saveCompletedHabit(habitName);
    displayHabits();
}

function addHabit() {
    const name = document.getElementById('habitName').value.trim();
    const frequency = document.getElementById('habitFrequency').value;
    const startTime = document.getElementById('habitStartTime').value;
    const endTime = document.getElementById('habitEndTime').value;

    if (!name || !startTime || !endTime) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    const habit = {
        name,
        frequency,
        startTime,
        endTime,
        days: []
    };

    if (frequency === "Personalizado") {
        habit.days = Array.from(document.querySelectorAll('#daysSelection input:checked')).map(day => day.value);
        if (habit.days.length === 0) {
            alert("Selecciona al menos un día para el hábito personalizado.");
            return;
        }
    }

    fetch('http://localhost:3000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit)
    })
    .then(response => response.json())
    .then(data => {
        loadHabits();
        // Limpiar los campos después de agregar
        document.getElementById('habitName').value = '';
        document.getElementById('habitStartTime').value = '';
        document.getElementById('habitEndTime').value = '';
        if (frequency === "Personalizado") {
            document.querySelectorAll('#daysSelection input:checked').forEach(checkbox => checkbox.checked = false);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Eliminar un hábito completamente de la base de datos
function deleteHabit(id) {
    fetch(`http://localhost:3000/api/habits/${id}`, { method: 'DELETE' })
        .then(() => loadHabits())
        .catch(error => console.error('Error:', error));
}

// Formatear hora a HH:MM
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Verificar si el hábito está programado para hoy
function isHabitScheduledForToday(habit) {
    const today = new Date();
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const todayName = dayNames[today.getDay()];

    if (habit.frequency === "Diario") {
        return true;
    } else if (habit.frequency === "Semanal") {
        // Puedes ajustar el día específico si es necesario
        return todayName === "Lunes";
    } else if (habit.frequency === "Personalizado") {
        return habit.days.includes(todayName);
    }
    return false;
}

let notifiedHabits = new Set();
let currentDay = new Date().getDate();

// Verificar horarios de hábitos para notificaciones
function checkHabitNotifications() {
    const now = new Date();
    const currentTime = formatTime(now);

    allHabits.forEach(habit => {
        if (isHabitScheduledForToday(habit)) {
            const habitStartTime = formatTime(new Date(`1970-01-01T${habit.startTime}`));

            // Notificación 15 minutos antes
            const notificationTime = new Date(`1970-01-01T${habit.startTime}`);
            notificationTime.setMinutes(notificationTime.getMinutes() - 15);

            const formattedNotificationTime = formatTime(notificationTime);

            if (currentTime === formattedNotificationTime && !notifiedHabits.has(`${habit.name}-before`)) {
                showNotification("Próximo hábito", `Tu hábito '${habit.name}' comienza en 15 minutos.`);
                notifiedHabits.add(`${habit.name}-before`);
            }

            // Notificación en el momento exacto
            if (currentTime === habitStartTime && !notifiedHabits.has(habit.name)) {
                showNotification("¡Es hora del hábito!", `Es momento de realizar '${habit.name}'.`);
                notifiedHabits.add(habit.name);
            }
        }
    });
}

// Iniciar el comprobador de notificaciones al inicio del minuto
function startNotificationChecker() {
    const now = new Date();
    const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    setTimeout(function() {
        checkHabitNotifications();
        setInterval(checkHabitNotifications, 60000);
    }, delay);
}

// Verificar cambio de día
function checkDayChange() {
    const now = new Date();
    if (now.getDate() !== currentDay) {
        currentDay = now.getDate();
        notifiedHabits.clear();
        completedHabits = loadCompletedHabits();
    }
}

setInterval(checkDayChange, 60000); // Verificar cambio de día cada minuto

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadHabits();
    startNotificationChecker();
});
