// // const mongoose = require("mongoose");

// // const employeeSchema = new mongoose.Schema({
// //   employeeID: { type: String, required: true, unique: true }, // Unique Employee ID (EID-YYYY-MM-XXXX)
// //   name: { type: String, required: true },
// //   contactNumber: { type: String, required: true },
// //   address: { type: String, required: true },
// //   position: { type: String, required: true },
// //   addedByHR: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     required: true,
// //   }, // HR manager who added
// // });

// // module.exports = mongoose.model("Employee", employeeSchema);


// const mongoose = require("mongoose");

// const employeeSchema = new mongoose.Schema({
//   employeeID: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   position: { type: String, required: true },
//   department: { type: String, required: true },
//   contactNumber: { type: String, required: true },
//   address: { type: String, required: true },
  
//   addedByHR: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   createdAt: { type: Date, default: Date.now } // <-- Add this for time
// });

// module.exports = mongoose.model("Employee", employeeSchema);

// backend/models/employee.model.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  addedByHR: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);