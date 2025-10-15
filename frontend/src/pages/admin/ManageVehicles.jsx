import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Truck, Hash, Car } from 'lucide-react';
// New imports for validation and toast notifications
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Assuming these components exist from your project structure
import Modal from '../../components/common/Modal'; 
import { useAuth } from '../../hooks/useAuth';

// Validation Schema using Yup
const VehicleSchema = Yup.object().shape({
    plateNumber: Yup.string()
        .trim()
        .matches(/^[A-Z0-9-]{5,10}$/i, 'Must be 5-10 characters and contain only letters, numbers, or hyphens.')
        .required('Plate number is required.'),
    type: Yup.string()
        .oneOf(['Truck', 'Van', 'Motorcycle', 'Car'], 'Invalid vehicle type.')
        .required('Vehicle type is required.'),
    model: Yup.string()
        .trim()
        .min(2, 'Model must be at least 2 characters long.')
        .required('Model is required.'),
    specifications: Yup.string()
        .max(500, 'Specifications cannot exceed 500 characters.'),
});

const ManageVehicles = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    // This is the single source of truth for a new vehicle form
    const initialFormState = { plateNumber: '', type: 'Truck', model: '', specifications: '' };

    const fetchVehicles = async () => {
        if (!user?.token) return;
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
            // Using toast for error notification
            toast.error(err.message || 'An unknown error occurred.');
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [user]);

    const handleAdd = () => {
        setCurrentVehicle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (vehicle) => {
        setCurrentVehicle(vehicle);
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
                toast.success(`Vehicle ${vehicleToDelete.plateNumber} deleted successfully!`);
                fetchVehicles(); // Refresh list
                setIsDeleteModalOpen(false);
                setVehicleToDelete(null);
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete vehicle');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        if (!user?.token) {
            setSubmitting(false);
            return;
        }

        const url = currentVehicle ? `/api/vehicles/${currentVehicle._id}` : '/api/vehicles';
        const method = currentVehicle ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(values)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Vehicle ${currentVehicle ? 'updated' : 'added'} successfully!`);
                fetchVehicles();
                setIsModalOpen(false);
            } else {
                // Display specific error from backend if available
                throw new Error(data.message || `Failed to ${currentVehicle ? 'update' : 'add'} vehicle`);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="max-w-7xl mx-auto">
                {/* Page Title Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Truck className="w-7 h-7" />
                                Vehicle Management
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                                    <span className="text-blue-500 font-semibold text-sm">
                                        Total: {vehicles.length}
                                    </span>
                                </div>
                                <button
                                    onClick={handleAdd}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Vehicle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicles Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        {vehicles.length === 0 ? (
                            <div className="text-center py-16">
                                <Truck className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-medium">No vehicles found</p>
                                <p className="text-gray-400 text-sm mt-1">Add your first vehicle to get started</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2"><Hash className="w-4 h-4" />Plate Number</div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2"><Truck className="w-4 h-4" />Type</div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2"><Car className="w-4 h-4" />Model</div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {vehicles.map(vehicle => (
                                            <tr key={vehicle._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm font-medium text-gray-900 font-mono">{vehicle.plateNumber}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{vehicle.type}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm text-gray-600">{vehicle.model}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {vehicle.isAvailable ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Available</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">In Use</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(vehicle)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5">
                                                            <Edit className="w-3 h-3" /><span className="text-xs font-medium">Edit</span>
                                                        </button>
                                                        <button onClick={() => openDeleteModal(vehicle)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5">
                                                            <Trash2 className="w-3 h-3" /><span className="text-xs font-medium">Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Vehicle Modal with Formik */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentVehicle ? "Edit Vehicle" : "Add New Vehicle"}>
                <Formik
                    initialValues={currentVehicle || initialFormState}
                    validationSchema={VehicleSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize // This is important to update the form when `currentVehicle` changes
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="plateNumber">Plate Number</label>
                                <Field
                                    type="text"
                                    name="plateNumber"
                                    id="plateNumber"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.plateNumber && touched.plateNumber ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <ErrorMessage name="plateNumber" component="p" className="mt-1 text-sm text-red-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">Vehicle Type</label>
                                <Field
                                    as="select"
                                    name="type"
                                    id="type"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.type && touched.type ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option>Truck</option>
                                    <option>Van</option>
                                    <option>Motorcycle</option>
                                    <option>Car</option>
                                </Field>
                                <ErrorMessage name="type" component="p" className="mt-1 text-sm text-red-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="model">Model</label>
                                <Field
                                    type="text"
                                    name="model"
                                    id="model"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.model && touched.model ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <ErrorMessage name="model" component="p" className="mt-1 text-sm text-red-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="specifications">Specifications</label>
                                <Field
                                    as="textarea"
                                    name="specifications"
                                    id="specifications"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.specifications && touched.specifications ? 'border-red-500' : 'border-gray-300'}`}
                                    rows="3"
                                />
                                <ErrorMessage name="specifications" component="p" className="mt-1 text-sm text-red-600" />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving...' : (currentVehicle ? 'Update Vehicle' : 'Add Vehicle')}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="space-y-6">
                    <p className="text-gray-700">
                        Are you sure you want to delete the vehicle with plate number{' '}
                        <span className="font-bold text-gray-900">{vehicleToDelete?.plateNumber}</span>?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                            Cancel
                        </button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
                            Delete Vehicle
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageVehicles;