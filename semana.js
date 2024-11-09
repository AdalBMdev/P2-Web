const weeklyCalendar = document.getElementById('weekly-calendar');
const allDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function loadWeeklyHabits() {
    fetch('http://localhost:3000/api/habits')
        .then(response => response.json())
        .then(data => {
            weeklyCalendar.innerHTML = ''; // Limpiar el contenido del calendario
            allDays.forEach(day => {
                const dayColumn = document.createElement('div');
                dayColumn.classList.add('day-column');
                dayColumn.innerHTML = `<h3>${day}</h3>`;

                // Filtrar hábitos que se deben realizar en este día
                const habitsForDay = data.filter(habit => habit.days.includes(day) || habit.frequency === "Diario");

                habitsForDay.forEach(habit => {
                    const habitBlock = document.createElement('div');
                    habitBlock.classList.add('habit-block');
                    habitBlock.innerHTML = `
                        <p><strong>${habit.name}</strong></p>
                        <p>${habit.startTime} - ${habit.endTime}</p>
                    `;
                    dayColumn.appendChild(habitBlock);
                });

                weeklyCalendar.appendChild(dayColumn);
            });
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', loadWeeklyHabits);
