const express = require("express");
const router = express.Router();
const {
  createSalary,
  getAllSalaries,
  getSalary,
  updateSalaryStatus,
  deleteSalary,
  getSalarySummary,
} = require("../controllers/salaryController");
const { validateSalary } = require("../middleware/validation");

// Protected at index.js with `protect`
router.post("/", validateSalary, createSalary);
router.get("/", getAllSalaries);
router.get("/summary", getSalarySummary);
router.get("/:id", getSalary);
router.put("/:id/status", updateSalaryStatus);
router.delete("/:id", deleteSalary);

module.exports = router;
