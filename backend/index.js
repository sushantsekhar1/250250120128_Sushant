const express = require('express');
const cors = require('cors');
const app = express();
const employeeRoutes = require('./routes/employee');
const departmentRoutes = require('./routes/department');

app.use(cors());
app.use(express.json());
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);

app.listen(2000, () => console.log('Server running on port 2000'));
