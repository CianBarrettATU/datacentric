const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3004;

const db = require('./db'); // Import database connection
const studentRoutes = require('./routes/studentRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/students', studentRoutes);
app.use('/grades', gradeRoutes);
app.use('/lecturers', lecturerRoutes);

// Root route
//get req at root
app.get('/', (req, res) => {
  res.send(`
    <h1>G00416157</h1>
    <ul>
      <li><a href="/students">Students Page</a></li>
      <li><a href="/grades">Grades Page</a></li>
      <li><a href="/lecturers">Lecturers (MongoDB) Page</a></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
