const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all departments
router.get('/', (_req, res) => {
  db.query('SELECT * FROM departments', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;
