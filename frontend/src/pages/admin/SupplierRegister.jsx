import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// New imports for validation and toast notifications
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from "../../hooks/useAuth";
import { 
    User, Mail, Lock, Building2, UserCircle, Phone, 
    MapPin, Package, CheckCircle, XCircle, AlertCircle
} from "lucide-react";

// Validation Schema using Yup
const RegistrationSchema = Yup.object().shape({
    username: Yup.string()
        .trim()
        .min(3, 'Username must be at least 3 characters long.')
        .required('Username is required.'),
    email: Yup.string()
        .email('Invalid email address.')
        .required('Email is required.'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long.')
        .required('Password is required.'),
    clientcompanyName: Yup.string()
        .trim()
        .required('Company name is required.'),
    clientcontactName: Yup.string()
        .trim()
        .required('Contact name is required.'),
    clientphone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits.')
        .required('Phone number is required.'),
    clientaddress: Yup.string()
        .trim()
        .required('Address is required.'),
    clientproductCategories: Yup.string()
        .trim()
        .required('At least one product category is required.'),
});

const ClientRegister = () => {
    const [suppliers, setSuppliers] = useState([]);
    const { register, user } = useAuth();

    const initialFormState = {
        username: "", email: "", password: "", role: "Supplier",
        clientcompanyName: "", clientcontactName: "", clientphone: "",
        clientaddress: "", clientproductCategories: "",
    };

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            const suppliersOnly = res.data.filter((u) => u.role === "Supplier");
            setSuppliers(suppliersOnly);
        } catch (err) {
            toast.error("Failed to fetch suppliers.");
            console.error("❌ Failed to fetch suppliers:", err);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchSuppliers();
        }
    }, [user]);

    const handleToggleActive = async (supplier) => {
        try {
            const updated = { clientisActive: !supplier.clientisActive };
            await axios.put(`http://localhost:5000/api/users/${supplier._id}`, updated, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            setSuppliers((prev) =>
                prev.map((s) => s._id === supplier._id ? { ...s, clientisActive: !s.clientisActive } : s)
            );
            toast.success(`${supplier.username} is now ${updated.clientisActive ? "Active" : "Inactive"}`);
        } catch (err) {
            toast.error("Failed to update supplier status.");
            console.error("❌ Failed to update supplier status:", err);
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const productCategoriesArray = values.clientproductCategories.split(",").map((item) => item.trim());
            await register(
                values.username, values.email, values.password, values.role,
                {
                    clientcompanyName: values.clientcompanyName,
                    clientcontactName: values.clientcontactName,
                    clientphone: values.clientphone,
                    clientaddress: values.clientaddress,
                    clientproductCategories: productCategoriesArray,
                }
            );
            toast.success(`Supplier "${values.username}" registered successfully!`);
            resetForm();
            fetchSuppliers(); // Refresh the list
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed. Email might already be in use.");
            console.error("❌ Registration failed:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            {/* LEFT: Register Form */}
            <div className="lg:w-1/2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><UserCircle className="w-7 h-7" />Register a Supplier</h2>
                    </div>
                    <div className="p-6">
                        <Formik initialValues={initialFormState} validationSchema={RegistrationSchema} onSubmit={handleSubmit}>
                            {({ isSubmitting, errors, touched }) => (
                                <Form className="space-y-5">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="w-5 h-5 text-gray-400" /></div>
                                            <Field type="text" name="username" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.username && touched.username ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} />
                                        </div>
                                        <ErrorMessage name="username" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="w-5 h-5 text-gray-400" /></div>
                                            <Field type="email" name="email" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.email && touched.email ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} />
                                        </div>
                                        <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="w-5 h-5 text-gray-400" /></div>
                                            <Field type="password" name="password" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.password && touched.password ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} />
                                        </div>
                                        <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Company Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building2 className="w-5 h-5 text-gray-400" /></div>
                                            <Field type="text" name="clientcompanyName" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.clientcompanyName && touched.clientcompanyName ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} />
                                        </div>
                                        <ErrorMessage name="clientcompanyName" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Contact Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserCircle className="w-5 h-5 text-gray-400" /></div>
                                            <Field type="text" name="clientcontactName" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.clientcontactName && touched.clientcontactName ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} />
                                        </div>
                                        <ErrorMessage name="clientcontactName" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="w-5 h-5 text-gray-400" /></div>
                                            <Field type="text" name="clientphone" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.clientphone && touched.clientphone ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} />
                                        </div>
                                        <ErrorMessage name="clientphone" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="w-5 h-5 text-gray-400" /></div>
                                            <Field type="text" name="clientaddress" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.clientaddress && touched.clientaddress ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} />
                                        </div>
                                        <ErrorMessage name="clientaddress" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Product Categories</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Package className="w-5 h-5 text-gray-400" /></div>
                                            <Field type="text" name="clientproductCategories" placeholder="e.g. Cotton Fabrics, Rayon, Threads" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.clientproductCategories && touched.clientproductCategories ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1.5">Separate multiple categories with commas</p>
                                        <ErrorMessage name="clientproductCategories" component="p" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isSubmitting ? 'Registering...' : 'Register Supplier'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            {/* RIGHT: Supplier List */}
            <div className="lg:w-1/2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5"><h2 className="text-2xl font-bold text-white flex items-center gap-2"><Building2 className="w-7 h-7" />All Suppliers</h2></div>
                    <div className="p-6">
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Username</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Company</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {suppliers.map((s) => (
                                        <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-900">{s.username}</span></div></td>
                                            <td className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{s.email}</span></div></td>
                                            <td className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{s.clientcompanyName}</span></div></td>
                                            <td className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{s.clientphone}</span></div></td>
                                            <td className="px-4 py-3 whitespace-nowrap text-center"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.clientisActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{s.clientisActive ? (<><CheckCircle className="w-3.5 h-3.5" />Active</>) : (<><XCircle className="w-3.5 h-3.5" />Inactive</>)}</span></td>
                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <button onClick={() => handleToggleActive(s)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all shadow-sm ${s.clientisActive ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600"}`}>
                                                    {s.clientisActive ? (<><XCircle className="w-4 h-4" />Deactivate</>) : (<><CheckCircle className="w-4 h-4" />Activate</>)}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {suppliers.length === 0 && (<div className="text-center py-12"><Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg font-medium">No suppliers found</p><p className="text-gray-400 text-sm mt-1">Register your first supplier to get started</p></div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientRegister;
