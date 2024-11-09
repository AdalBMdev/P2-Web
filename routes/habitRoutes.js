const express = require('express');
const habitController = require('../controllers/habitController');

const router = express.Router();

router.post('/habits', habitController.createHabit);
router.get('/habits', habitController.getAllHabits);
router.put('/habits/:id', habitController.updateHabit);
router.delete('/habits/:id', habitController.deleteHabit);

module.exports = router;
