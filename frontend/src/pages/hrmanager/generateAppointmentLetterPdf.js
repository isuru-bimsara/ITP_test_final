import jsPDF from "jspdf";


export function generateAppointmentLetterPdf(emp) {
  const doc = new jsPDF();


  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(43, 108, 176); // blue
  doc.text("Fabriclk (PVT) LTD", 105, 25, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("Colombo, Sri Lanka", 105, 32, { align: "center" });

  // --- Line separator
  doc.setDrawColor(43, 108, 176); // blue
  doc.setLineWidth(1.5);
  doc.line(40, 38, 170, 38);

  // --- Title ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 80);
  doc.text("Appointment Letter", 105, 48, { align: "center" });

  let y = 58;

  // --- Date and Recipient Info ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(`Date: ${formatDate(emp.createdAt)}`, 160, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text(emp.name, 20, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(emp.address, 20, y);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.text(`Dear ${emp.name},`, 20, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text(`Subject: Appointment Confirmation for ${emp.position}`, 20, y);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.text(
    doc.splitTextToSize(
      `We are pleased to inform you that you have been appointed as ${emp.position} in our ${emp.department} department at Fabriclk (PVT) LTD. Your extensive experience and exceptional skills make you a valuable addition to our team.`,
      170
    ),
    20,
    y
  );
  y += 16;

  // --- Appointment Details Section ---
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 108, 176); // blue
  doc.text("Appointment Details", 20, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("• Position/Role: ", 22, y);
  doc.setFont("helvetica", "normal");
  doc.text(emp.position, 55, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("• Department: ", 22, y);
  doc.setFont("helvetica", "normal");
  doc.text(emp.department, 55, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("• Employee ID: ", 22, y);
  doc.setFont("helvetica", "normal");
  doc.text(emp.employeeID, 55, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("• Salary: ", 22, y);
  doc.setFont("helvetica", "normal");
  doc.text(
    emp.salary ? `Rs. ${emp.salary} per month` : "Rs. 50,000 per month",
    45,
    y
  );

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 108, 176);
  doc.text("Key Responsibilities", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.text(
    [
      "• Overseeing daily operations of the department",
      "• Managing and training staff",
      "• Ensuring high standards of satisfaction and resolving any issues promptly",
    ],
    22,
    y
  );
  y += 18;

  doc.text(
    doc.splitTextToSize(
      "Please report to HR Manager on your first day. You will receive a detailed orientation about your role and our company policies.\n\nTo confirm your acceptance of this appointment, please sign and return the enclosed copy of this letter.",
      170
    ),
    20,
    y
  );
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.text("Sincerely,", 20, y);
  y += 6;
  doc.text("HR Manager", 20, y);
  doc.text("Fabriclk (PVT) LTD", 20, y + 6);

  doc.save(`${emp.name}_Appointment_Letter.pdf`);
}

// Helper for date formatting
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
