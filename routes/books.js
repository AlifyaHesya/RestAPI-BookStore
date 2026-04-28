const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL BOOKS
router.get('/', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// GET BOOK BY ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    res.json(results[0]);
  });
});

// POST BOOK
router.post('/', (req, res) => {
  const { title, author, price, stock } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title dan author wajib' });
  }

  const sql = 'INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)';

  db.query(sql, [title, author, price, stock], (err, result) => {
    if (err) return res.status(500).send(err);

    res.status(201).json({
      message: 'Buku berhasil ditambahkan',
      id: result.insertId
    });
  });
});

// UPDATE BOOK
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, price, stock } = req.body;

  const sql = 'UPDATE books SET title=?, author=?, price=?, stock=? WHERE id=?';

  db.query(sql, [title, author, price, stock, id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    res.json({ message: 'Buku berhasil diperbarui' });
  });
});

// DELETE BOOK
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM books WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    res.json({ message: 'Buku berhasil dihapus' });
  });
});

module.exports = router;
