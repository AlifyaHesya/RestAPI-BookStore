const express = require('express');
const mysql = require('mysql2');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// KONEKSI DATABASE
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'bookstore'
});

// GET BOOKS
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// GET BOOKS BY ID
app.get('/books/:id', (req, res) => {
  const {id} = req.params;

  db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length == 0) return res.status(404).json({message: 'Buku tidak ditemukan'});
    res.json(results[0]);
  });
});

// POST BOOKS
app.post('/books', (req, res) => {
  const {title, author, price, stock} = req.body;
  const sql = 'INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, author, price, stock], (err, result) => {
    if (err) return res.status(500).send(err);
    if (!title || !author) {
    return res.status(400).json({ message: 'Title dan author wajib' });
    }

    res.status(201).json({
      message: 'Buku berhasil ditambahkan',
      id: result.insertId
    });
  });
});

// UPDATE BOOKS
app.put('/books/:id', (req, res) => {
  const {id} = req.params;
  const {title, author, price, stock} = req.body;
  
  const sql = ' UPDATE books SET title = ?, author = ?, price = ?, stock = ? WHERE id = ?';

  db.query(sql, [title, author, price, stock, id], (err, result) => {  
    if (err) return res.status(500).send(err);
    res.json({message: 'Buku berhasil diperbarui'});
    if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
  });
});

// DELETE BOOKS
app.delete('/books/:id', (req, res) => {
  const {id} = req.params;

  const sql = 'DELETE FROM books WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({message: 'Buku berhasil dihapus'});
  if (result.affectedRows === 0) {
  return res.status(404).json({ message: 'Buku tidak ditemukan' });
  }
  }); 
});


// JALANKAN SERVER
app.listen(3000, () => {
  console.log('Server running on port 3000');
});