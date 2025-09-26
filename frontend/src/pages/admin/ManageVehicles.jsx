import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

const ManageVehicles = () => {
    const { user } = useAuth(); // Use the Auth context
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [error, setError] = useState(null);

    const initialFormState = { plateNumber: '', type: 'Truck', model: '', specifications: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({ plateNumber: '', type: '', model: '', specifications: '' });

    // Fetch vehicles from server
    const fetchVehicles = async () => {
        if (!user?.token) return; // Ensure token exists
        try {
            const res = await fetch('/api/vehicles', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setVehicles(data);
            } else {
                throw new Error(data.message || 'Failed to fetch vehicles');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [user]); // Run whenever user (and token) changes

    const validateField = (fieldName, value) => {
        let errorMessage = '';

        if (fieldName === 'plateNumber') {
            const trimmed = value.trim();
            if (!trimmed) errorMessage = 'Plate number is required';
            else if (!/^[A-Z0-9-]{5,10}$/i.test(trimmed)) errorMessage = '5-10 chars, letters/numbers/hyphen only';
        }

        if (fieldName === 'type') {
            if (!value) errorMessage = 'Type is required';
        }

        if (fieldName === 'model') {
            const trimmed = value.trim();
            if (!trimmed) errorMessage = 'Model is required';
            else if (trimmed.length < 2) errorMessage = 'Model must be at least 2 characters';
        }

        if (fieldName === 'specifications') {
            // optional, but if provided, limit length
            if (value && value.length > 500) errorMessage = 'Max 500 characters';
        }

        return errorMessage;
    };

    const validateForm = (data) => {
        const newErrors = {
            plateNumber: validateField('plateNumber', data.plateNumber),
            type: validateField('type', data.type),
            model: validateField('model', data.model),
            specifications: validateField('specifications', data.specifications),
        };
        setErrors(newErrors);
        return !newErrors.plateNumber && !newErrors.type && !newErrors.model && !newErrors.specifications;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleAdd = () => {
        setCurrentVehicle(null);
        setFormData(initialFormState);
        setErrors({ plateNumber: '', type: '', model: '', specifications: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (vehicle) => {
        setCurrentVehicle(vehicle);
        setFormData({
            plateNumber: vehicle.plateNumber,
            type: vehicle.type,
            model: vehicle.model,
            specifications: vehicle.specifications || '',
        });
        setErrors({ plateNumber: '', type: '', model: '', specifications: '' });
        setIsModalOpen(true);
    };

    const openDeleteModal = (vehicle) => {
        setVehicleToDelete(vehicle);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!vehicleToDelete || !user?.token) return;
        try {
            const res = await fetch(`/api/vehicles/${vehicleToDelete._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                fetchVehicles();
                setIsDeleteModalOpen(false);
                setVehicleToDelete(null);
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete vehicle');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!user?.token) return;
        const isValid = validateForm(formData);
        if (!isValid) return;

        const url = currentVehicle ? `/api/vehicles/${currentVehicle._id}` : '/api/vehicles';
        const method = currentVehicle ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                fetchVehicles();
                setIsModalOpen(false);
            } else {
                throw new Error(data.message || 'Failed to save vehicle');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Vehicles</h1>
                <Button onClick={handleAdd} className="flex items-center gap-2">
                    <PlusCircle size={20} />
                    Add Vehicle
                </Button>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{`Error: ${error}`}</p>}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map(vehicle => (
                            <tr key={vehicle._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.plateNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${vehicle.isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {vehicle.isAvailable ? 'Available' : 'In Use'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(vehicle)} className="text-blue-600 hover:text-blue-800 mr-4"><Edit size={20} /></button>
                                    <button onClick={() => openDeleteModal(vehicle)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentVehicle ? "Edit Vehicle" : "Add New Vehicle"}>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plateNumber">Plate Number</label>
                        <input type="text" name="plateNumber" id="plateNumber" value={formData.plateNumber} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${errors.plateNumber ? 'border-red-500' : 'border-gray-300'}`} required />
                        {errors.plateNumber && <p className="mt-1 text-sm text-red-600">{errors.plateNumber}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Vehicle Type</label>
                        <select name="type" id="type" value={formData.type} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}>
                            <option>Truck</option>
                            <option>Van</option>
                            <option>Motorcycle</option>
                            <option>Car</option>
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">Model</label>
                        <input type="text" name="model" id="model" value={formData.model} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${errors.model ? 'border-red-500' : 'border-gray-300'}`} required />
                        {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specifications">Specifications</label>
                        <textarea name="specifications" id="specifications" value={formData.specifications} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${errors.specifications ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.specifications && <p className="mt-1 text-sm text-red-600">{errors.specifications}</p>}
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</Button>
                        <Button type="submit">{currentVehicle ? 'Update Vehicle' : 'Add Vehicle'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p className="mb-6">Are you sure you want to delete the vehicle with plate number <span className="font-bold">{vehicleToDelete?.plateNumber}</span>?</p>
                <div className="flex justify-end gap-4">
                    <Button type="button" onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</Button>
                    <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</Button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageVehicles;
