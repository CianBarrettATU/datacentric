const express = require('express');
const mysql = require('mysql2');
const app = express();

const PORT = 3004;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024mysql',
})

db.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database');
    }
  });

app.get('/students', (req, res) => {
const query = 'SELECT sid, name, age FROM student ORDER BY sid ASC';

db.query(query, (err, results) => {
    if (err) {
    console.error('Error fetching students:', err);
    return res.send('Error fetching students');
    }

    let studentList = results.map(student => {
    return `
        <tr>
        <td>${student.sid}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td><a href="/update/${student.sid}">Update</a></td>
        </tr>
    `;
    }).join('');

    res.send(`
    <h1>Students Page</h1>
    <table border="1">
        <thead>
        <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        ${studentList}
        </tbody>
    </table>
    <br>
    <a href="/add-student">Add Student</a><br>
    <a href="/">Home</a>
    `);
    });
});

app.use(express.static('public'));

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

app.get('/students', (req, res) => {
  res.send('<h1>Students Page</h1><p>List of students will be here.</p>');
});

app.get('/grades', (req, res) => {
  res.send('<h1>Grades Page</h1><p>Grades information will be displayed here.</p>');
});

app.get('/lecturers', (req, res) => {
  res.send('<h1>Lecturers (MongoDB) Page</h1><p>List of lecturers fetched from MongoDB will be shown here.</p>');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
