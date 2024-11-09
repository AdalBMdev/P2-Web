let allHabits = []; 
const storageKey = 'completedHabits'; // Clave para localStorage

localStorage.clear();

// Seleccionar elementos del DOM
const frequencySelect = document.getElementById("habitFrequency");
const daysSelectionContainer = document.getElementById("daysSelection");

// Escuchar cambios en el menú de frecuencia
frequencySelect.addEventListener("change", (e) => {
    const selectedFrequency = e.target.value;

    if (selectedFrequency === "Personalizado") {
        daysSelectionContainer.style.display = "block"; // Mostrar la selección de días
    } else {
        daysSelectionContainer.style.display = "none"; // Ocultar la selección de días
    }
});


// Cargar el estado de hábitos completados para el día actual desde localStorage
function loadCompletedHabits() {
    const storedData = JSON.parse(localStorage.getItem(storageKey));
    const today = new Date().toISOString().split('T')[0]; 

    // Si hay datos en localStorage y la fecha es de hoy, cargar los hábitos completados
    if (storedData && storedData.date === today) {
        return new Set(storedData.habits.map(h => h.name));
    } else {
        // Si no, limpiar y crear un nuevo registro para hoy
        localStorage.setItem(storageKey, JSON.stringify({ date: today, habits: [] }));
        return new Set();
    }
}

function saveCompletedHabit(habitName) {
    const today = new Date().toISOString().split('T')[0];
    let completedHabitsData = JSON.parse(localStorage.getItem(storageKey)) || { date: today, habits: [] };

    // Verificar si es el mismo día
    if (completedHabitsData.date !== today) {
        completedHabitsData = { date: today, habits: [] };
    }

    // Buscar el hábito en el array y actualizar el contador
    const habitIndex = completedHabitsData.habits.findIndex(h => h.name === habitName);
    if (habitIndex > -1) {
        completedHabitsData.habits[habitIndex].completedCount += 1;
    } else {
        completedHabitsData.habits.push({ name: habitName, completedCount: 1 });
    }

    localStorage.setItem(storageKey, JSON.stringify(completedHabitsData));
}

// Cargar los hábitos completados desde `localStorage`
let completedHabits = loadCompletedHabits();

// Función para cargar todos los hábitos desde el backend
function loadHabits() {
    fetch('http://localhost:3000/api/habits')
        .then(response => response.json())
        .then(data => {
            allHabits = data;
            displayHabits();
        })
        .catch(error => console.error('Error:', error));
}

// Función para mostrar los hábitos (excluyendo los completados temporalmente)
function displayHabits() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    allHabits.forEach(habit => {
        // Mostrar el hábito solo si no está marcado como completado para el día actual
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

// Marcar un hábito como "hecho" y actualizar el estado en `localStorage`
function completeHabit(habitName) {
    completedHabits.add(habitName);
    saveCompletedHabit(habitName); // Guardar el hábito completado en `localStorage`
    displayHabits(); // Actualizar la lista para ocultar el hábito completado
}

// Agregar un nuevo hábito
function addHabit() {
    const habit = {
        name: document.getElementById('habitName').value,
        frequency: document.getElementById('habitFrequency').value,
        startTime: document.getElementById('habitStartTime').value,
        endTime: document.getElementById('habitEndTime').value,
        days: Array.from(document.querySelectorAll('#daysSelection input:checked')).map(day => day.value)
    };

    fetch('http://localhost:3000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit)
    })
    .then(response => response.json())
    .then(data => {
        loadHabits();
    })
    .catch(error => console.error('Error:', error));
}

// Eliminar un hábito completamente de la base de datos
function deleteHabit(id) {
    fetch(`http://localhost:3000/api/habits/${id}`, { method: 'DELETE' })
        .then(() => loadHabits())
        .catch(error => console.error('Error:', error));
}

// Al cargar la página, verifica y actualiza los hábitos completados
document.addEventListener('DOMContentLoaded', loadHabits);
