const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3004;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024mysql',
})

app.use(bodyParser.urlencoded({extended:true}));

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
                <td><a href="/students/edit/${student.sid}">Update</a></td>
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

app.get('/students/edit/:sid', (req, res) => {
    const studentId = req.params.sid;
    const query = 'SELECT sid, name, age FROM student WHERE sid = ?';
  
    db.query(query, [studentId], (err, result) => {
      if (err) {
        console.error('Error fetching student:', err);
        return res.send('Error fetching student');
      }
  
      if (result.length === 0) {
        return res.send('Student not found');
      }
  
      const student = result[0];
  
      res.send(`
        <h1>Edit Student</h1>
        <form action="/students/edit/${student.sid}" method="POST">
          <label for="sid">Student ID:</label>
          <input type="text" id="sid" name="sid" value="${student.sid}" readonly><br><br>

          <label for="name">Name (min 2 characters):</label>
          <input type="text" id="name" name="name" value="${student.name}" required minlength="2"><br><br>
          
          <label for="age">Age (18 or older):</label>
          <input type="number" id="age" name="age" value="${student.age}" required min="18"><br><br>
          
          <button type="submit">Update Student</button>
        </form>
        <br>
        <a href="/students">Back to Students Page</a>
      `);
    });
});
  
// POST /students/edit/:sid (Update the student)
app.post('/students/edit/:sid', (req, res) => {
    const studentId = req.params.sid;
    const { name, age } = req.body;
  
    let errors = [];
    //doing validation checks
    if (!name || name.length < 2) {
        errors.push("Name must be at least 2 characters long.");
    }
  
    if (!age || age < 18) {
        errors.push("Age must be 18 or older.");
    }

    if (errors.length > 0) {
        return res.send(`
            <h1>Edit Student</h1>
            <form action="/students/edit/${studentId}" method="POST">
              <label for="sid">Student ID:</label>
              <input type="text" id="sid" name="sid" value="${studentId}" readonly><br><br>
  
              <label for="name">Name (min 2 characters):</label>
              <input type="text" id="name" name="name" value="${name}" required minlength="2"><br><br>
  
              <label for="age">Age (18 or older):</label>
              <input type="number" id="age" name="age" value="${age}" required min="18"><br><br>
  
              <button type="submit">Update Student</button>
            </form>
            <br>
            <a href="/students">Back to Students Page</a>
            <div style="color: red;">
                ${errors.map(err => `<p>${err}</p>`).join('')}
            </div>
        `);
    }
  
    const query = 'UPDATE student SET name = ?, age = ? WHERE sid = ?';
  
    db.query(query, [name, age, studentId], (err, result) => {
      if (err) {
        console.error('Error updating student:', err);
        return res.send('Error updating student');
      }
  
      if (result.affectedRows === 0) {
        return res.send('Student not found');
      }
  
      res.send(`
        <h1>Student Updated Successfully</h1>
        <p>Name: ${name}</p>
        <p>Age: ${age}</p>
        <a href="/students">Back to Students Page</a>
      `);
    });
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
