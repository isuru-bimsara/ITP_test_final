import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, User, Phone, CreditCard, UserCheck, Users } from 'lucide-react';
// New imports for validation and toast notifications
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Assuming these components exist from your project structure
import Modal from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';

// Validation Schema with enhanced rules for maximum validation
const DriverSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(3, 'Name must be at least 3 characters.')
        .matches(/^[A-Za-z\s.'-]+$/, 'Name can only contain letters and spaces.')
        .required('Name is required.'),
    contact: Yup.string()
        .matches(/^[0-9]{10}$/, 'Contact must be a valid phone number with 10 to 15 digits.')
        .required('Contact number is required.'),
    licenseNumber: Yup.string()
        .trim()
        .matches(/^[A-Z0-9-]{5,20}$/i, 'Must be 5-20 characters (letters, numbers, hyphen).')
        .required('License number is required.'),
});

const ManageDrivers = () => {
    const { user } = useAuth();
    const [drivers, setDrivers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
    const [currentDriver, setCurrentDriver] = useState(null);
    const [driverToDelete, setDriverToDelete] = useState(null); // State for driver to be deleted

    const initialFormState = { name: '', contact: '', licenseNumber: '' };

    const fetchDrivers = async () => {
        if (!user?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/drivers', config);
            setDrivers(res.data);
        } catch (error) {
            toast.error("Failed to fetch drivers. Please try again.");
            console.error("Failed to fetch drivers:", error);
        }
    };

    useEffect(() => {
        if (user) fetchDrivers();
    }, [user]);

    const handleAdd = () => {
        setCurrentDriver(null);
        setIsModalOpen(true);
    };

    const handleEdit = (driver) => {
        setCurrentDriver(driver);
        setIsModalOpen(true);
    };
    
    // Opens the delete confirmation modal
    const openDeleteModal = (driver) => {
        setDriverToDelete(driver);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!driverToDelete || !user?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/drivers/${driverToDelete._id}`, config);
            toast.success(`Driver ${driverToDelete.name} has been deleted.`);
            fetchDrivers();
            setIsDeleteModalOpen(false);
            setDriverToDelete(null);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete driver.";
            toast.error(errorMessage);
            console.error("Failed to delete driver:", error);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        if (!user?.token) {
            setSubmitting(false);
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            let response;
            if (currentDriver) {
                response = await axios.put(`/api/drivers/${currentDriver._id}`, values, config);
            } else {
                response = await axios.post('/api/drivers', values, config);
            }
            toast.success(`Driver ${currentDriver ? 'updated' : 'added'} successfully!`);
            fetchDrivers();
            setIsModalOpen(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to save driver.";
            toast.error(errorMessage);
            console.error("Failed to save driver:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Users className="w-7 h-7" />
                                Driver Management
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                                    <span className="text-blue-500 font-semibold text-sm">
                                        Total: {drivers.length}
                                    </span>
                                </div>
                                <button
                                    onClick={handleAdd}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Driver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        {drivers.length === 0 ? (
                            <div className="text-center py-16">
                                <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-medium">No drivers found</p>
                                <p className="text-gray-400 text-sm mt-1">Add your first driver to get started</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><User className="w-4 h-4" />Name</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><Phone className="w-4 h-4" />Contact</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><CreditCard className="w-4 h-4" />License No.</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><UserCheck className="w-4 h-4" />Availability</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {drivers.map(driver => (
                                            <tr key={driver._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm font-medium text-gray-900">{driver.name}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm text-gray-600">{driver.contact}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm text-gray-600 font-mono">{driver.licenseNumber}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {driver.isAvailable ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Available</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Unavailable</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(driver)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5">
                                                            <Edit className="w-3 h-3" /><span className="text-xs font-medium">Edit</span>
                                                        </button>
                                                        <button onClick={() => openDeleteModal(driver)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5">
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

            {/* Add/Edit Driver Modal with Formik */}
            <Modal title={currentDriver ? "Edit Driver" : "Add New Driver"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Formik
                    initialValues={currentDriver || initialFormState}
                    validationSchema={DriverSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
                                <Field type="text" name="name" id="name" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact">Contact Number</label>
                                <Field type="text" name="contact" id="contact" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.contact && touched.contact ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="contact" component="p" className="mt-1 text-sm text-red-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="licenseNumber">License Number</label>
                                <Field type="text" name="licenseNumber" id="licenseNumber" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.licenseNumber && touched.licenseNumber ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="licenseNumber" component="p" className="mt-1 text-sm text-red-600" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Saving...' : (currentDriver ? 'Update Driver' : 'Add Driver')}
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
                        Are you sure you want to delete the driver{' '}
                        <span className="font-bold text-gray-900">{driverToDelete?.name}</span>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
                            Delete Driver
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageDrivers;