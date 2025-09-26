// frontend/src/pages/financialmanager/pdfGenerator.jsx
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateTaxSummaryPDF = async (taxRecords, filters = {}) => {
  try {
    // Create a temporary div to hold the PDF content
    const pdfContent = document.createElement('div');
    pdfContent.style.position = 'absolute';
    pdfContent.style.left = '-9999px';
    pdfContent.style.width = '800px';
    pdfContent.style.padding = '20px';
    pdfContent.style.backgroundColor = 'white';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    
    // Get current date for the report
    const currentDate = new Date().toLocaleDateString();
    
    // Calculate summary data
    const totalAmount = taxRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalPaid = taxRecords.reduce((sum, record) => sum + record.paidAmount, 0);
    const totalRemaining = totalAmount - totalPaid;
    
    // Group by tax type
    const taxByType = taxRecords.reduce((acc, record) => {
      if (!acc[record.taxType]) {
        acc[record.taxType] = { total: 0, paid: 0, count: 0 };
      }
      acc[record.taxType].total += record.amount;
      acc[record.taxType].paid += record.paidAmount;
      acc[record.taxType].count += 1;
      return acc;
    }, {});
    
    // Group by status
    const statusCounts = taxRecords.reduce((counts, record) => {
      counts[record.status] = (counts[record.status] || 0) + 1;
      return counts;
    }, {});

    pdfContent.innerHTML = `
      <div style="border: 2px solid #1e40af; padding: 20px; border-radius: 10px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
          <h1 style="color: #1e40af; margin: 0; font-size: 28px;">Tax Compliance Report</h1>
          <p style="color: #6b7280; margin: 5px 0;">FabricLK Finance Management</p>
          <p style="color: #6b7280; margin: 0;">Generated on: ${currentDate}</p>
          ${filters.period ? `<p style="color: #6b7280; margin: 5px 0;">Period: ${filters.period}</p>` : ''}
          ${filters.taxType ? `<p style="color: #6b7280; margin: 5px 0;">Tax Type: ${filters.taxType}</p>` : ''}
          ${filters.status ? `<p style="color: #6b7280; margin: 5px 0;">Status: ${filters.status}</p>` : ''}
        </div>

        <!-- Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
          <div style="border: 1px solid #dc2626; padding: 15px; border-radius: 8px; text-align: center; background: #fef2f2;">
            <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 14px;">Total Liability</h3>
            <p style="color: #dc2626; margin: 0; font-size: 20px; font-weight: bold;">Rs ${totalAmount.toLocaleString()}</p>
          </div>
          <div style="border: 1px solid #16a34a; padding: 15px; border-radius: 8px; text-align: center; background: #f0fdf4;">
            <h3 style="color: #16a34a; margin: 0 0 10px 0; font-size: 14px;">Total Paid</h3>
            <p style="color: #16a34a; margin: 0; font-size: 20px; font-weight: bold;">Rs ${totalPaid.toLocaleString()}</p>
          </div>
          <div style="border: 1px solid #2563eb; padding: 15px; border-radius: 8px; text-align: center; background: #eff6ff;">
            <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 14px;">Remaining</h3>
            <p style="color: #2563eb; margin: 0; font-size: 20px; font-weight: bold;">Rs ${totalRemaining.toLocaleString()}</p>
          </div>
          <div style="border: 1px solid #7c3aed; padding: 15px; border-radius: 8px; text-align: center; background: #faf5ff;">
            <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 14px;">Total Records</h3>
            <p style="color: #7c3aed; margin: 0; font-size: 20px; font-weight: bold;">${taxRecords.length}</p>
          </div>
        </div>

        <!-- Status Overview -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">Status Overview</h2>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            ${Object.entries(statusCounts).map(([status, count]) => `
              <div style="text-align: center; padding: 10px; background: #f8fafc; border-radius: 5px;">
                <span style="font-weight: bold; color: #374151;">${status}:</span>
                <span style="color: #1e40af; font-weight: bold; margin-left: 5px;">${count}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tax Type Breakdown -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">Tax Type Breakdown</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Tax Type</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">Total Amount</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">Paid Amount</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">Balance</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Records</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(taxByType).map(([type, data]) => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 10px;">${type}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right;">Rs ${data.total.toLocaleString()}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right; color: #16a34a;">Rs ${data.paid.toLocaleString()}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right; color: #dc2626;">Rs ${(data.total - data.paid).toLocaleString()}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${data.count}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Detailed Records -->
        <div>
          <h2 style="color: #1e40af; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">Detailed Tax Records</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Tax Type</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Period</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Due Date</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Amount</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Paid</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Balance</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${taxRecords.map(record => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 6px;">${record.taxType}</td>
                  <td style="border: 1px solid #d1d5db; padding: 6px;">${record.period}</td>
                  <td style="border: 1px solid #d1d5db; padding: 6px;">${new Date(record.dueDate).toLocaleDateString()}</td>
                  <td style="border: 1px solid #d1d5db; padding: 6px; text-align: right;">Rs ${record.amount.toLocaleString()}</td>
                  <td style="border: 1px solid #d1d5db; padding: 6px; text-align: right; color: #16a34a;">Rs ${record.paidAmount.toLocaleString()}</td>
                  <td style="border: 1px solid #d1d5db; padding: 6px; text-align: right; color: #dc2626;">Rs ${(record.amount - record.paidAmount).toLocaleString()}</td>
                  <td style="border: 1px solid #d1d5db; padding: 6px; text-align: center;">
                    <span style="
                      padding: 2px 8px;
                      border-radius: 12px;
                      font-size: 10px;
                      font-weight: bold;
                      ${record.status === 'Paid' ? 'background: #d1fae5; color: #065f46;' : ''}
                      ${record.status === 'Pending' ? 'background: #fef3c7; color: #92400e;' : ''}
                      ${record.status === 'Partially Paid' ? 'background: #fef3c7; color: #92400e;' : ''}
                      ${record.status === 'Overdue' ? 'background: #fee2e2; color: #991b1b;' : ''}
                    ">${record.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.body.appendChild(pdfContent);

    // Generate PDF
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Tax_Report_${timestamp}.pdf`;
    
    pdf.save(filename);

    // Clean up
    document.body.removeChild(pdfContent);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};