// app.js
const express = require('express');
const cors = require('cors');
const habitRoutes = require('./routes/habitRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', habitRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
