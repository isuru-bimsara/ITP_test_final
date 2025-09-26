//frontend/src/pages/financialmanager/dashboardPdfGenerator.jsx
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateDashboardPDF = async (kpis, summary, monthlyData, dateRange) => {
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
    const startDate = dateRange.startDate ? new Date(dateRange.startDate).toLocaleDateString() : 'N/A';
    const endDate = dateRange.endDate ? new Date(dateRange.endDate).toLocaleDateString() : 'N/A';

    pdfContent.innerHTML = `
      <div style="border: 2px solid #1e40af; padding: 20px; border-radius: 10px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
          <h1 style="color: #1e40af; margin: 0; font-size: 28px;">Financial Dashboard Report</h1>
          <p style="color: #6b7280; margin: 5px 0;">FabricLK Finance Management</p>
          <p style="color: #6b7280; margin: 0;">Generated on: ${currentDate}</p>
          <p style="color: #6b7280; margin: 5px 0;">Period: ${startDate} to ${endDate}</p>
        </div>

        <!-- Executive Summary -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">Executive Summary</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
              <h3 style="color: #16a34a; margin: 0 0 10px 0; font-size: 16px;">Total Revenue</h3>
              <p style="color: #16a34a; margin: 0; font-size: 24px; font-weight: bold;">
                Rs ${summary?.totalIncomes?.toLocaleString() || '0'}
              </p>
            </div>
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">Total Expenses</h3>
              <p style="color: #dc2626; margin: 0; font-size: 24px; font-weight: bold;">
                Rs ${summary?.totalExpenses?.toLocaleString() || '0'}
              </p>
            </div>
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">Net Profit</h3>
              <p style="color: #2563eb; margin: 0; font-size: 24px; font-weight: bold;">
                Rs ${summary?.netProfit?.toLocaleString() || '0'}
              </p>
            </div>
            <div style="background: #faf5ff; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed;">
              <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 16px;">Profit Margin</h3>
              <p style="color: #7c3aed; margin: 0; font-size: 24px; font-weight: bold;">
                ${kpis?.profitMargin || '0'}%
              </p>
            </div>
          </div>
        </div>

        <!-- Key Performance Indicators -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">Key Performance Indicators</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Metric</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">Current Value</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: right;">Growth Rate</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: bold;">Revenue</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right;">Rs ${kpis?.revenue?.toLocaleString() || '0'}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right; color: ${kpis?.revenueGrowth >= 0 ? '#16a34a' : '#dc2626'};">
                  ${kpis?.revenueGrowth >= 0 ? '+' : ''}${kpis?.revenueGrowth || '0'}%
                </td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; color: ${kpis?.revenueGrowth >= 0 ? '#16a34a' : '#dc2626'};">
                  ${kpis?.revenueGrowth >= 0 ? '↑' : '↓'}
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: bold;">Expenses</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right;">Rs ${kpis?.expenses?.toLocaleString() || '0'}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right; color: ${kpis?.expensesGrowth >= 0 ? '#dc2626' : '#16a34a'};">
                  ${kpis?.expensesGrowth >= 0 ? '+' : ''}${kpis?.expensesGrowth || '0'}%
                </td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; color: ${kpis?.expensesGrowth >= 0 ? '#dc2626' : '#16a34a'};">
                  ${kpis?.expensesGrowth >= 0 ? '↑' : '↓'}
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: bold;">Net Profit</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right;">Rs ${kpis?.profit?.toLocaleString() || '0'}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right; color: ${kpis?.profit >= 0 ? '#16a34a' : '#dc2626'};">
                  ${kpis?.profit >= 0 ? 'Positive' : 'Negative'}
                </td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; color: ${kpis?.profit >= 0 ? '#16a34a' : '#dc2626'};">
                  ${kpis?.profit >= 0 ? '↑' : '↓'}
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: bold;">Employees</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right;">${kpis?.employees || '0'}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right;">-</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Monthly Trend Analysis -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">Monthly Trend Analysis (Last 12 Months)</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Month</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Revenue</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Expenses</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Profit/Loss</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Margin</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyData.map(month => {
                const profit = month.revenue - month.expenses;
                const margin = month.revenue > 0 ? ((profit / month.revenue) * 100).toFixed(1) : 0;
                return `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 6px;">${month.month}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; text-align: right;">Rs ${month.revenue.toLocaleString()}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; text-align: right;">Rs ${month.expenses.toLocaleString()}</td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; text-align: right; color: ${profit >= 0 ? '#16a34a' : '#dc2626'};">
                      Rs ${profit.toLocaleString()}
                    </td>
                    <td style="border: 1px solid #d1d5db; padding: 6px; text-align: center; color: ${margin >= 0 ? '#16a34a' : '#dc2626'};">
                      ${margin}%
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Financial Health Indicators -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">Financial Health Indicators</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div style="text-align: center; padding: 15px; background: #f0fdf4; border-radius: 8px;">
              <h3 style="color: #16a34a; margin: 0 0 10px 0; font-size: 14px;">Profitability</h3>
              <div style="font-size: 18px; font-weight: bold; color: #16a34a;">
                ${kpis?.profitMargin >= 0 ? 'Healthy' : 'Concerning'}
              </div>
              <div style="font-size: 12px; color: #6b7280;">Margin: ${kpis?.profitMargin || '0'}%</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #eff6ff; border-radius: 8px;">
              <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 14px;">Revenue Growth</h3>
              <div style="font-size: 18px; font-weight: bold; color: ${kpis?.revenueGrowth >= 0 ? '#16a34a' : '#dc2626'};">
                ${kpis?.revenueGrowth >= 0 ? 'Growing' : 'Declining'}
              </div>
              <div style="font-size: 12px; color: #6b7280;">Rate: ${kpis?.revenueGrowth || '0'}%</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #fefce8; border-radius: 8px;">
              <h3 style="color: #ca8a04; margin: 0 0 10px 0; font-size: 14px;">Expense Control</h3>
              <div style="font-size: 18px; font-weight: bold; color: ${kpis?.expensesGrowth <= 10 ? '#16a34a' : '#dc2626'};">
                ${kpis?.expensesGrowth <= 10 ? 'Controlled' : 'High'}
              </div>
              <div style="font-size: 12px; color: #6b7280;">Growth: ${kpis?.expensesGrowth || '0'}%</div>
            </div>
          </div>
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
    const filename = `Financial_Dashboard_Report_${timestamp}.pdf`;
    
    pdf.save(filename);

    // Clean up
    document.body.removeChild(pdfContent);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};