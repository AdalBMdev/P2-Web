function loadProgress() {
    const habitProgressList = document.getElementById('habit-progress-list');
    habitProgressList.innerHTML = ''; // Limpia el contenido

    // Obtener datos de progreso de localStorage
    const completedHabitsData = JSON.parse(localStorage.getItem('completedHabits')) || { date: "", habits: [] };

    // Verificar si hay datos de hábitos completados
    if (!completedHabitsData.habits || completedHabitsData.habits.length === 0) {
        habitProgressList.innerHTML = "<p>No hay hábitos completados aún.</p>";
        return;
    }

    // Mostrar los hábitos completados con su progreso
    completedHabitsData.habits.forEach(habit => {
        const habitItem = document.createElement('div');
        habitItem.classList.add('progress-item');
        
        // Verificar que existan los campos necesarios en el objeto
        const habitName = habit.name || "Sin nombre";
        const completedCount = habit.completedCount || 0;

        habitItem.innerHTML = `<strong>${habitName}</strong> - Completado ${completedCount} veces`;
        habitProgressList.appendChild(habitItem);
    });
}

// Cargar el progreso cuando se cargue la página
document.addEventListener('DOMContentLoaded', loadProgress);
