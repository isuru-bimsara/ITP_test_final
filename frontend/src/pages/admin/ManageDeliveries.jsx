import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ManageDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]); // State to hold order IDs
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    const initialFormState = { orderId: '', pickupAddress: '', deliveryAddress: '', customerId: '' };
    const [newDelivery, setNewDelivery] = useState(initialFormState);

    const statusClasses = {
        'Processing': 'bg-yellow-100 text-yellow-800',
        'Started': 'bg-blue-100 text-blue-800',
        'On the Way': 'bg-indigo-100 text-indigo-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800',
    };

    const fetchData = async () => {
        if (!user?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [delRes, driRes, vehRes, custRes, ordRes] = await Promise.all([
                fetch('/api/deliveries', config),
                fetch('/api/drivers', config),
                fetch('/api/vehicles', config),
                fetch('/api/users', config),
                fetch('/api/orders/ids', config), 
            ]);

            if (!delRes.ok || !driRes.ok || !vehRes.ok || !custRes.ok || !ordRes.ok) {
                throw new Error('Failed to fetch all necessary data.');
            }

            const deliveriesData = await delRes.json();
            const driversData = await driRes.json();
            const vehiclesData = await vehRes.json();
            const customersData = await custRes.json();
            const ordersData = await ordRes.json(); 

            setDeliveries(deliveriesData);
            setDrivers(driversData);
            setVehicles(vehiclesData);
            setCustomers(customersData.filter(u => u.role === 'Customer'));
            setOrders(ordersData); 

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load dashboard data.');
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleUpdate = async (id, field, value) => {
        try {
            const res = await fetch(`/api/deliveries/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ [field]: value })
            });
            if (res.ok) fetchData();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDelivery({ ...newDelivery, [name]: value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!newDelivery.customerId || !newDelivery.pickupAddress || !newDelivery.deliveryAddress || !newDelivery.orderId) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            const payload = {
                orderId: newDelivery.orderId,
                pickupAddress: newDelivery.pickupAddress,
                deliveryAddress: newDelivery.deliveryAddress,
                customer: newDelivery.customerId
            };
            const response = await fetch('/api/deliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errData.message || 'Failed to create delivery');
            }

            fetchData();
            setIsModalOpen(false);
            setNewDelivery(initialFormState);

        } catch (err) {
            setError(err.message);
        }
    };

    // Filter deliveries based on search term
    const filteredDeliveries = deliveries.filter(delivery =>
        delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.vehicle?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generate PDF report with blue theme
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
        doc.text("Deliveries Management Report", 25, 18);
        
        // Date and time in top right
        doc.setFontSize(9);
        doc.text(`Generated: ${dateStr} at ${timeStr}`, 140, 13);
        doc.text(`Total Deliveries: ${filteredDeliveries.length}`, 140, 18);
        
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
        doc.text(`This report contains ${filteredDeliveries.length} delivery records with current status and assignments.`, 14, 52);
        
        // Status breakdown
        const statusCounts = filteredDeliveries.reduce((acc, delivery) => {
            acc[delivery.status] = (acc[delivery.status] || 0) + 1;
            return acc;
        }, {});
        
        let yPosition = 58;
        doc.text("Status Breakdown:", 14, yPosition);
        yPosition += 6;
        
        Object.entries(statusCounts).forEach(([status, count]) => {
            doc.text(`• ${status}: ${count}`, 20, yPosition);
            yPosition += 5;
        });
        
        // Table data
        const tableColumn = ["Order ID", "Customer", "Pickup Address", "Delivery Address", "Driver", "Vehicle", "Status"];
        const tableRows = filteredDeliveries.map(delivery => [
            delivery.orderId || 'N/A',
            delivery.customer?.username || 'N/A',
            delivery.pickupAddress ? (delivery.pickupAddress.length > 30 ? delivery.pickupAddress.substring(0, 30) + '...' : delivery.pickupAddress) : 'N/A',
            delivery.deliveryAddress ? (delivery.deliveryAddress.length > 30 ? delivery.deliveryAddress.substring(0, 30) + '...' : delivery.deliveryAddress) : 'N/A',
            delivery.driver?.name || 'Unassigned',
            delivery.vehicle?.plateNumber || 'Unassigned',
            delivery.status || 'N/A'
        ]);
        
        // Enhanced AutoTable styling
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: yPosition + 10,
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
                0: { cellWidth: 20 }, // Order ID
                1: { cellWidth: 25 }, // Customer
                2: { cellWidth: 35 }, // Pickup Address
                3: { cellWidth: 35 }, // Delivery Address
                4: { cellWidth: 25 }, // Driver
                5: { cellWidth: 20 }, // Vehicle
                6: { cellWidth: 20 }, // Status
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
                doc.text("© 2024 Shopee - Delivery Management System", 14, pageHeight - 12);
                
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
        const finalY = doc.lastAutoTable.finalY || yPosition + 10;
        if (finalY < 250) { // If there's space on the last page
            doc.setTextColor(...secondaryColor);
            doc.setFontSize(8);
            doc.text("End of Report", 14, finalY + 20);
            doc.setTextColor(...primaryColor);
            doc.text("━━━━━━━━━━━━", 14, finalY + 25);
        }
        
        // Save the PDF
        doc.save(`Shopee_Deliveries_Report_${dateStr.replace(/\//g, '-')}.pdf`);
    };

    // Filter out orders that already have a delivery
    const assignedOrderIds = new Set(deliveries.map(d => d.orderId));
    const availableOrders = orders.filter(order => !assignedOrderIds.has(order._id));

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Deliveries</h1>
                <div className="flex gap-3">
                    <Button onClick={generatePDF} className="bg-blue-500 hover:bg-blue-600 text-white">
                        Download PDF
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <PlusCircle size={20} /> Add Delivery
                    </Button>
                </div>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{`Error: ${error}`}</p>}

            {/* Enhanced Search Input with Blue Theme */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search deliveries by Order ID, Customer, Address, Driver, Vehicle, or Status..."
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
                        <span className="font-semibold">{filteredDeliveries.length}</span> of <span className="font-semibold">{deliveries.length}</span> deliveries match your search
                        {filteredDeliveries.length === 0 && (
                            <span className="ml-2 text-blue-600">- Try adjusting your search terms</span>
                        )}
                    </p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDeliveries.map(d => (
                            <tr key={d._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.orderId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.customer?.username || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.pickupAddress}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.deliveryAddress}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <select
                                        value={d.driver?._id || ''}
                                        onChange={(e) => handleUpdate(d._id, 'driverId', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
                                        disabled={d.status !== 'Processing'}>
                                        <option value="">Assign Driver</option>
                                        {drivers.filter(dr => dr.isAvailable || dr._id === d.driver?._id).map(dr => (
                                            <option key={dr._id} value={dr._id}>{dr.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <select
                                        value={d.vehicle?._id || ''}
                                        onChange={(e) => handleUpdate(d._id, 'vehicleId', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
                                        disabled={d.status !== 'Processing'}>
                                        <option value="">Assign Vehicle</option>
                                        {vehicles.filter(v => v.isAvailable || v._id === d.vehicle?._id).map(v => (
                                            <option key={v._id} value={v._id}>{v.plateNumber}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                    <select
                                        value={d.status}
                                        onChange={(e) => handleUpdate(d._id, 'status', e.target.value)}
                                        className={`w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-semibold ${statusClasses[d.status]}`}>
                                        {['Processing', 'Started', 'On the Way', 'Delivered', 'Cancelled'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Delivery Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Delivery">
                <form onSubmit={handleAddSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderId">Order ID</label>
                        <select
                            name="orderId"
                            id="orderId"
                            value={newDelivery.orderId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select an Order</option>
                            {availableOrders.map(order => (
                                <option key={order._id} value={order._id}>
                                    {order._id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerId">Customer</label>
                        <select name="customerId" id="customerId" value={newDelivery.customerId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                            <option value="">Select a Customer</option>
                            {customers.map(c => (
                                <option key={c._id} value={c._id}>{c.username}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupAddress">Pickup Address</label>
                        <textarea name="pickupAddress" id="pickupAddress" value={newDelivery.pickupAddress} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryAddress">Delivery Address</label>
                        <textarea name="deliveryAddress" id="deliveryAddress" value={newDelivery.deliveryAddress} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</Button>
                        <Button type="submit">Create Delivery</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageDeliveries;