const express = require('express');
const router = express.Router();
const { mysqlDb } = require('../db');

// Grade Routes
router.get('/', (req, res) => {
  const query = `
    SELECT student.name AS student_name, module.name AS module_name, grade.grade
    FROM grade
    JOIN student ON grade.sid = student.sid
    JOIN module ON grade.mid = module.mid
    ORDER BY student.name ASC, grade.grade ASC;
  `;

  mysqlDb.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching grades:', err);
      return res.send('Error fetching grades');
    }

    let gradeList = `
      <h1>Grades Page</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Student</th>
            <th>Module</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
    `;

    results.forEach(row => {
      gradeList += `
        <tr>
          <td>${row.student_name}</td>
          <td>${row.module_name}</td>
          <td>${row.grade}</td>
        </tr>
      `;
    });

    gradeList += `
        </tbody>
      </table>
      <br>
      <a href="/">Home</a>
    `;

    res.send(gradeList);
  });
});

module.exports = router;
