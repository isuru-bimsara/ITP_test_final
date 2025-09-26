// //backend/models/salaryModel.js
// const mongoose = require('mongoose');

// const salarySchema = new mongoose.Schema({
//   employeeName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   role: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   basicSalary: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   allowances: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   deductions: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   otHours: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   otRate: {
//     type: Number,
//     default: 1.5
//   },
//   otPay: {
//     type: Number,
//     default: 0
//   },
//   epfRate: {
//     type: Number,
//     default: 8
//   },
//   epfDeduction: {
//     type: Number,
//     default: 0
//   },
//   etfRate: {
//     type: Number,
//     default: 3
//   },
//   etfDeduction: {
//     type: Number,
//     default: 0
//   },
//   netSalary: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   paymentDate: {
//     type: Date,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Paid'],
//     default: 'Pending',
//   },
// }, { 
//   timestamps: true 
// });

// module.exports = mongoose.model('Salary', salarySchema);


const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeName: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  basicSalary: { type: Number, required: true, min: 0 },
  allowances: { type: Number, default: 0, min: 0 },
  deductions: { type: Number, default: 0, min: 0 },
  otHours: { type: Number, default: 0, min: 0 },
  otRate: { type: Number, default: 1.5 },
  otPay: { type: Number, default: 0 },
  epfRate: { type: Number, default: 8 },
  epfDeduction: { type: Number, default: 0 },
  etfRate: { type: Number, default: 3 },
  etfDeduction: { type: Number, default: 0 },
  netSalary: { type: Number, required: true, min: 0 },
  paymentDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);