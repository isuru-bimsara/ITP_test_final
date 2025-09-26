import React, { useState, useEffect } from 'react';
import { View, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


const ManageContacts = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch contacts from backend
    const fetchContacts = async () => {
        if (!user?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/contacts', config);
            setContacts(res.data);
        } catch (error) {
            console.error("Failed to fetch contacts:", error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [user]);

    // Delete contact
    const handleDelete = async (contact) => {
        if (!user?.token) return;
        if (window.confirm(`Are you sure you want to delete the message from ${contact.fullName}?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/contacts/${contact._id}`, config);
                fetchContacts();
            } catch (error) {
                console.error("Failed to delete contact:", error);
            }
        }
    };

    // Open modal to view contact
    const handleEdit = (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    // Filter contacts based on search
    const filteredContacts = contacts.filter(contact =>
        contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generate PDF report with enhanced visual appeal
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Define colors - Blue Theme
        const primaryColor = [59, 130, 246]; // Blue-500
        const secondaryColor = [75, 85, 99]; // Gray-600
        const lightBlue = [239, 246, 255]; // Blue-50
        const darkBlue = [30, 58, 138]; // Blue-800
        const darkGray = [17, 24, 39]; // Gray-900
        
        // Current date and time
        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const timeStr = now.toLocaleTimeString();
        
        // Add colored header background
        doc.setFillColor(...lightBlue);
        doc.rect(0, 0, 210, 35, 'F');
        
        // Company logo area (colored rectangle as placeholder)
        doc.setFillColor(...darkBlue);
        doc.rect(14, 8, 6, 6, 'F');
        
        // Header text
        doc.setTextColor(...darkGray);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("SHOPEE", 25, 13);
        
        // Subtitle
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...secondaryColor);
        doc.text("Contact Messages Report", 25, 18);
        
        // Date and time in top right
        doc.setFontSize(9);
        doc.text(`Generated: ${dateStr} at ${timeStr}`, 140, 13);
        doc.text(`Total Records: ${contacts.length}`, 140, 18);
        
        // Add a thin line separator
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(14, 25, 196, 25);
        
        // Summary section
        doc.setTextColor(...darkGray);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Report Summary", 14, 45);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...secondaryColor);
        doc.text(`This report contains ${contacts.length} contact messages from customers.`, 14, 52);
        doc.text("All contact information is confidential and should be handled accordingly.", 14, 58);
        
        // Table data
        const tableColumn = ["Full Name", "Email", "Phone", "Subject", "Message"];
        const tableRows = contacts.map(contact => [
            contact.fullName || 'N/A',
            contact.email || 'N/A',
            contact.phoneNumber || 'N/A',
            contact.subject || 'N/A',
            // Truncate long messages for better table layout
            contact.message ? (contact.message.length > 60 ? contact.message.substring(0, 60) + '...' : contact.message) : 'N/A'
        ]);
        
        // Enhanced AutoTable styling
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 70,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 3,
                textColor: darkGray,
                lineColor: [209, 213, 219], // Gray-300
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9,
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251], // Gray-50
            },
            columnStyles: {
                0: { cellWidth: 30 }, // Full Name
                1: { cellWidth: 40 }, // Email
                2: { cellWidth: 25 }, // Phone
                3: { cellWidth: 35 }, // Subject
                4: { cellWidth: 60 }, // Message
            },
            margin: { left: 14, right: 14 },
            didDrawPage: function (data) {
                // Footer background
                const pageHeight = doc.internal.pageSize.getHeight();
                doc.setFillColor(...lightBlue);
                doc.rect(0, pageHeight - 20, 210, 20, 'F');
                
                // Footer content
                const pageCount = doc.getNumberOfPages();
                const pageNumber = doc.getCurrentPageInfo().pageNumber;
                
                // Company info in footer
                doc.setTextColor(...secondaryColor);
                doc.setFontSize(8);
                doc.text("© 2024 Shopee - Customer Contact Management System", 14, pageHeight - 12);
                
                // Page number
                doc.setTextColor(...darkGray);
                doc.setFont("helvetica", "bold");
                doc.text(
                    `Page ${pageNumber} of ${pageCount}`,
                    196 - doc.getTextWidth(`Page ${pageNumber} of ${pageCount}`),
                    pageHeight - 12
                );
                
                // Add a thin line above footer
                doc.setDrawColor(...primaryColor);
                doc.setLineWidth(0.3);
                doc.line(14, pageHeight - 18, 196, pageHeight - 18);
            },
            didDrawCell: function(data) {
                // Add subtle borders to cells
                if (data.section === 'body') {
                    doc.setDrawColor(229, 231, 235); // Gray-200
                }
            }
        });
        
        // Add final page info if multiple pages
        const finalY = doc.lastAutoTable.finalY || 70;
        if (finalY < 250) { // If there's space on the last page
            doc.setTextColor(...secondaryColor);
            doc.setFontSize(8);
            doc.text("End of Report", 14, finalY + 20);
            doc.setTextColor(...primaryColor);
            doc.text("━━━━━━━━━━━━", 14, finalY + 25);
        }
        
        // Save the PDF
        doc.save(`Shopee_Contacts_Report_${dateStr.replace(/\//g, '-')}.pdf`);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Manage Contact Messages</h1>
                <Button onClick={generatePDF} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Download PDF
                </Button>
            </div>

            {/* Enhanced Search Input with Blue Theme */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search contacts by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all duration-200 ease-in-out shadow-sm hover:border-gray-300
                             bg-white text-base font-medium"
                />
                {searchTerm && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Search Results Counter */}
            {searchTerm && (
                <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">{filteredContacts.length}</span> of <span className="font-semibold">{contacts.length}</span> contacts match your search
                        {filteredContacts.length === 0 && (
                            <span className="ml-2 text-blue-600">- Try adjusting your search terms</span>
                        )}
                    </p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredContacts.map(contact => (
                            <tr key={contact._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.phoneNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{contact.message}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(contact)} className="text-blue-600 hover:text-blue-800 mr-4">
                                        <View size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(contact)} className="text-red-600 hover:text-red-800">
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="View Contact Message" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedContact && (
                    <div className="space-y-3">
                        <p><strong>Full Name:</strong> {selectedContact.fullName}</p>
                        <p><strong>Email:</strong> {selectedContact.email}</p>
                        <p><strong>Phone:</strong> {selectedContact.phoneNumber}</p>
                        <p><strong>Subject:</strong> {selectedContact.subject}</p>
                        <p><strong>Message:</strong></p>
                        <p className="bg-gray-100 p-3 rounded-md">{selectedContact.message}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageContacts;