const express = require('express');
const router = express.Router();
const { mongoClient, mongoDbName } = require('../db');

// Lecturer Routes

router.get('/', async (req, res) => {
  try {
    const db = mongoClient.db(mongoDbName);
    const lecturers = await db.collection('lecturers')
      .find()
      .sort({ _id: 1 })
      .toArray();

    let lecturerList = lecturers.map(lecturer => {
      return `
        <tr>
          <td>${lecturer._id}</td>
          <td>${lecturer.name}</td>
          <td>${lecturer.did}</td>
          <td><a href="/lecturers/delete/${lecturer._id}">Delete</a></td>
        </tr>
      `;
    }).join('');

    res.send(`
      <h1>Lecturers Page</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Lecturer ID</th>
            <th>Name</th>
            <th>Department ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${lecturerList}
        </tbody>
      </table>
      <br>
      <a href="/">Home</a>
    `);
  } catch (err) {
    console.error('Error fetching lecturers:', err);
    res.send('Error fetching lecturers');
  }
});

router.get('/delete/:id', async (req, res) => {
  const lecturerId = req.params.id;

  try {
    const db = mongoClient.db(mongoDbName);
    const moduleCollection = db.collection('module');

    // Check if the lecturer teaches any modules
    const modules = await moduleCollection.find({ lecturer: lecturerId }).toArray();

    if (modules.length > 0) {
      return res.send(`
        <p>Cannot delete lecturer as he/she has associated modules.</p>
        <a href="/lecturers">Back to Lecturers List</a>
      `);
    }

    const lecturerCollection = db.collection('lecturers');
    const result = await lecturerCollection.deleteOne({ _id: lecturerId });

    if (result.deletedCount === 0) {
      return res.send('Lecturer not found');
    }

    res.redirect('/lecturers');
  } catch (err) {
    console.error('Error deleting lecturer:', err);
    res.send('Error deleting lecturer');
  }
});

module.exports = router;
