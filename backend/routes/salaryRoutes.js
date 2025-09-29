// const express = require("express");
// const router = express.Router();
// const {
//   createSalary,
//   getAllSalaries,
//   getSalary,
//   updateSalaryStatus,
//   deleteSalary,
//   getSalarySummary,
// } = require("../controllers/salaryController");
// const { validateSalary } = require("../middleware/validation");

// // Protected at index.js with `protect`
// router.post("/", validateSalary, createSalary);
// router.get("/", getAllSalaries);
// router.get("/summary", getSalarySummary);
// router.get("/:id", getSalary);
// router.put("/:id/status", updateSalaryStatus);
// router.delete("/:id", deleteSalary);

// module.exports = router;


const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");
const { validateSalary } = require("../middleware/validation");

// Protected at index.js with `protect`
router.post("/", validateSalary, salaryController.createSalary);
router.get("/", salaryController.getAllSalaries);
router.get("/summary", salaryController.getSalarySummary);
router.get("/:id", salaryController.getSalary);
router.put("/:id/status", salaryController.updateSalaryStatus);
router.put("/:id", validateSalary, salaryController.updateSalary);
router.delete("/:id", salaryController.deleteSalary);

module.exports = router;