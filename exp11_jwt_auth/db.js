const sqlite3 = require('sqlite3').verbose();

// Function to initialize the database schema
function initializeDatabase() {
  const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the SQLite database.');
      createStudentsTable(db);
    }
  });

  // Close the database connection when the Node process exits
  process.on('exit', () => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Disconnected from the SQLite database.');
      }
    });
  });
}

// Function to create the 'students' table if it doesn't exist
function createStudentsTable(db) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      grade TEXT
    );
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('The students table has been created or already exists.');
    }
  });
}

module.exports = { initializeDatabase };

// Running "node db.js" directly creates mydatabase.db with the students table
if (require.main === module) {
  initializeDatabase();
}
