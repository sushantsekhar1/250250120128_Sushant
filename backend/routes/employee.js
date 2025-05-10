const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all employees with their department name, salary, and address
router.get('/', (_req, res) => {
  const sql = `
    SELECT e.id, e.name, e.dob, e.phone, e.email, e.department_id, d.name AS department_name
    FROM employee e
    JOIN department d ON e.department_id = d.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add employee
router.post('/', (req, res) => {
  const { name, dob, phone, email, department_id } = req.body;

  // Validate all required fields
  if (!name || !dob || !phone || !email || !department_id) {
    return res.status(400).send('All fields (name, dob, phone, email, department_id) are required');
  }

  // Insert employee into the database
  db.query(
    'INSERT INTO employee (name, dob, phone, email, department_id) VALUES (?, ?, ?, ?, ?)',
    [name, dob, phone, email, department_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({
        id: result.insertId,
        name,
        dob,
        phone,
        email,
        department_id,
      });
    }
  );
});

// Update employee
router.put('/:id', (req, res) => {
  const { name, dob, phone, email, department_id } = req.body;
  console.log("Updating employee ID:", req.params.id); 
  console.log("New values:", req.body); 

  // Validate all required fields
  if (!name || !dob || !phone || !email || !department_id) {
    return res.status(400).send('All fields (name, dob, phone, email, department_id) are required');
  }

  // Update employee details in the database
  db.query(
    'UPDATE employee SET name = ?, dob = ?, phone = ?, email = ?, department_id = ? WHERE id = ?',
    [name, dob, phone, email, department_id, req.params.id],
    (err) => {
      if (err) {
        console.error("SQL error:", err); 
        return res.status(500).send(err);

      }
      res.sendStatus(200);
    }
  );
});

// Delete employee
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM employee WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;
