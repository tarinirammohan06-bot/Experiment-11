const express = require('express');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const { initializeDatabase } = require('./db');

const app = express();
const port = 3000;

// JWT secret key (keep it secure - use an environment variable in real projects)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Mock user (replace with real user lookup in a real application)
const mockUser = { username: 'admin', password: 'admin123' };

// Make sure the database file and the students table exist
initializeDatabase();

const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

app.use(express.json());

// ---------- JWT authentication middleware ----------
const authenticateJWT = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) {
    return res.status(401).json({ error: 'Unauthorized: token missing' });
  }

  // Accept both "Bearer <token>" and a raw token
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ---------- Public routes ----------
app.get('/', (req, res) => {
  res.send('Welcome to the Student');
});

// Authentication endpoint: generates a JWT token
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username === mockUser.username && password === mockUser.password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ---------- Protected routes (JWT required) ----------
app.use('/students', authenticateJWT);

app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/students/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

app.post('/students', (req, res) => {
  const { name, age, grade } = req.body;
  db.run(
    'INSERT INTO students (name, age, grade) VALUES (?, ?, ?)',
    [name, age, grade],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put('/students/:id', (req, res) => {
  const { name, age, grade } = req.body;
  db.run(
    'UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?',
    [name, age, grade, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updatedID: req.params.id });
    }
  );
});

app.delete('/students/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletedID: req.params.id });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
