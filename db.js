const mysql = require('mysql2');
const { MongoClient } = require('mongodb');

//mongo credentials
const mysqlDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proj2024mysql',
});

const mongoUri = 'mongodb://localhost:27017';
const mongoDbName = 'proj2024MongoDB';
const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

//connecting to sql db
mysqlDb.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

//connecting to mongo db
mongoClient.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = {
  mysqlDb,
  mongoClient,
  mongoDbName,
};
