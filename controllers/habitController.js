const db = require('../config/database');

// Crear un nuevo hábito
exports.createHabit = (req, res) => {
  const newHabit = req.body;
  
  db.insert(newHabit, (error, createdHabit) => {
    if (error) {
      return res.status(500).json({ message: 'Error al crear el hábito', error });
    }
    res.status(201).json(createdHabit);
  });
};

// Obtener todos los hábitos
exports.getAllHabits = (req, res) => {
  db.find({}, (error, habits) => {
    if (error) {
      return res.status(500).json({ message: 'Error al obtener los hábitos', error });
    }
    res.status(200).json(habits);
  });
};

// Actualizar un hábito
exports.updateHabit = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  db.update({ _id: id }, { $set: updatedData }, {}, (error, numReplaced) => {
    if (error) {
      return res.status(500).json({ message: 'Error al actualizar el hábito', error });
    }
    if (numReplaced === 0) {
      return res.status(404).json({ message: 'Hábito no encontrado' });
    }
    res.status(200).json({ message: 'Hábito actualizado con éxito' });
  });
};

// Eliminar un hábito
exports.deleteHabit = (req, res) => {
  const { id } = req.params;
  
  db.remove({ _id: id }, {}, (error, numRemoved) => {
    if (error) {
      return res.status(500).json({ message: 'Error al eliminar el hábito', error });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ message: 'Hábito no encontrado' });
    }
    res.status(200).json({ message: 'Hábito eliminado con éxito' });
  });
};
