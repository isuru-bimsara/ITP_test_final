// // backend/routes/employee.route.js
// const express = require("express");
// const router = express.Router();
// const employeeController = require("../controllers/employee.controller");
// const authMiddleware = require("../middlewares/auth.middleware"); // JWT auth, must set req.user._id
// const hrOnly = require("../middlewares/hrOnly.middleware");

// // router.post("/add", authMiddleware, employeeController.addEmployee);
// // HR Manager only route
// router.post(
//   "/add",
//   authMiddleware.verifyToken,
//   hrOnly,
//   employeeController.addEmployee
// );

// router.get(
//   "/list",
//   authMiddleware.verifyToken,
//   hrOnly,
//   employeeController.getEmployees
// );

// // router.get(
// //   "/all",
// //   authMiddleware.verifyToken,
// //   hrOnly,
// //   employeeController.getAllEmployees
// // );

// router.put(
//   "/update/:id",
//   authMiddleware.verifyToken,
//   hrOnly,
//   employeeController.updateEmployee
// );

// router.get(
//   "/all",
//   authMiddleware.verifyToken,
//   employeeController.getAllEmployees
// );

// router.delete(
//   "/delete/:id",
//   authMiddleware.verifyToken,
//   hrOnly,
//   employeeController.deleteEmployee
// );

// router.get(
//   "/department-counts",
//   authMiddleware.verifyToken,
//   employeeController.getEmployeeCountsByDepartment
// );

// module.exports = router;


// backend/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { protect } = require('../middleware/authMiddleware'); // use friend's middleware

// Create employee (authenticated users)
router.post('/add', protect, employeeController.addEmployee);

// List employees added by the logged-in user (authenticated users)
router.get('/list', protect, employeeController.getEmployees);

// Update employee (authenticated users)
router.put('/update/:id', protect, employeeController.updateEmployee);

// Get all employees (authenticated users)
router.get('/all', protect, employeeController.getAllEmployees);

// Delete employee (authenticated users)
router.delete('/delete/:id', protect, employeeController.deleteEmployee);

// Aggregation: counts by department (authenticated users)
router.get('/department-counts', protect, employeeController.getEmployeeCountsByDepartment);

module.exports = router;