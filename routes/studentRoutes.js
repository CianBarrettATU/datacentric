const express = require('express');
const router = express.Router();
const { mysqlDb } = require('../db');

// Student Routes

router.get('/', (req, res) => {
  const query = 'SELECT sid, name, age FROM student ORDER BY sid ASC';
  mysqlDb.query(query, (err, results) => {
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
      <a href="/students/add">Add Student</a><br>
      <a href="/">Home</a>
    `);
  });
});

// Edit, Add, and Update routes for students
// Similarly, you can break them into their own methods like above

module.exports = router;
