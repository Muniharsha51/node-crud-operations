
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/employees', async (req, res) => {
  try {
    const { name, position, department, email, password } = req.body;

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = new Employee({ name, position, department, email, password: hashedPassword });
    await employee.save();

   
    const token = employee.generateAuthToken();

    res.status(201).send({ employee, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = employee.generateAuthToken();
    res.send({ token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.get('/employees/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) return res.status(404).send('Employee not found');

    res.send(employee);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.put('/employees/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    if (!employee) return res.status(404).send('Employee not found');

    res.send(employee);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.delete('/employees/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) return res.status(404).send('Employee not found');

    res.send(employee);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


router.get('/employees', auth, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.send(employees);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
