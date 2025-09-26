import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const ManageDrivers = () => {
    const { user } = useAuth();
    const [drivers, setDrivers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDriver, setCurrentDriver] = useState(null);
    const [formData, setFormData] = useState({ name: '', contact: '', licenseNumber: '' });
    const [errors, setErrors] = useState({ name: '', contact: '', licenseNumber: '' });

    const fetchDrivers = async () => {
        if (!user?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/drivers', config);
            setDrivers(res.data);
        } catch (error) {
            console.error("Failed to fetch drivers:", error);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, [user]);

    const validateField = (fieldName, value) => {
        let errorMessage = '';

        if (fieldName === 'name') {
            const trimmed = value.trim();
            if (!trimmed) errorMessage = 'Name is required';
            else if (!/^[A-Za-z\s]{2,}$/.test(trimmed)) errorMessage = 'Use letters only, min 2 characters';
        }

        if (fieldName === 'contact') {
            const digits = value.replace(/\D/g, '');
            if (!digits) errorMessage = 'Contact number is required';
            else if (digits.length < 10) errorMessage = 'Enter at least 10 digits';
        }

        if (fieldName === 'licenseNumber') {
            const trimmed = value.trim();
            if (!trimmed) errorMessage = 'License number is required';
            else if (!/^[A-Z0-9-]{5,20}$/i.test(trimmed)) errorMessage = '5-20 chars, letters/numbers/hyphen only';
        }

        return errorMessage;
    };

    const validateForm = (data) => {
        const newErrors = {
            name: validateField('name', data.name),
            contact: validateField('contact', data.contact),
            licenseNumber: validateField('licenseNumber', data.licenseNumber),
        };
        setErrors(newErrors);
        return !newErrors.name && !newErrors.contact && !newErrors.licenseNumber;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleAdd = () => {
        setCurrentDriver(null);
        setFormData({ name: '', contact: '', licenseNumber: '' });
        setErrors({ name: '', contact: '', licenseNumber: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (driver) => {
        setCurrentDriver(driver);
        setFormData({ name: driver.name, contact: driver.contact, licenseNumber: driver.licenseNumber });
        setErrors({ name: '', contact: '', licenseNumber: '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (driver) => {
        if (!user?.token) return;
        if (window.confirm(`Are you sure you want to delete ${driver.name}?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/drivers/${driver._id}`, config);
                fetchDrivers();
            } catch (error) {
                console.error("Failed to delete driver:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.token) return;
        const isValid = validateForm(formData);
        if (!isValid) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (currentDriver) {
                await axios.put(`/api/drivers/${currentDriver._id}`, formData, config);
            } else {
                await axios.post('/api/drivers', formData, config);
            }
            fetchDrivers();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save driver:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Drivers</h1>
                <Button onClick={handleAdd} className="flex items-center gap-2">
                    <PlusCircle size={20} />
                    Add Driver
                </Button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {drivers.map(driver => (
                            <tr key={driver._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.contact}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.licenseNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${driver.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {driver.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(driver)} className="text-blue-600 hover:text-blue-800 mr-4"><Edit size={20} /></button>
                                    <button onClick={() => handleDelete(driver)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title={currentDriver ? "Edit Driver" : "Add Driver"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} required />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Contact</label>
                        <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${errors.contact ? 'border-red-500' : 'border-gray-300'}`} required />
                        {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">License Number</label>
                        <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'}`} required />
                        {errors.licenseNumber && <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>}
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</Button>
                        <Button type="submit">{currentDriver ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageDrivers;
