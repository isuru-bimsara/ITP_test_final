import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    FaPlus, FaEdit, FaTrash, FaStar, FaBox, FaImage,
    FaTags, FaDollarSign, FaBarcode, FaTimes, FaInbox
} from 'react-icons/fa';
// New imports for validation and toast notifications
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:5000/api/products";

// Validation Schema using Yup
const ProductSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(3, 'Name must be at least 3 characters long.')
        .required('Product name is required.'),
    price: Yup.number()
        .positive('Price must be a positive number.')
        .required('Price is required.'),
    oldPrice: Yup.number()
        .positive('Old price must be a positive number.')
        .nullable(),
    sku: Yup.string()
        .trim()
        .matches(/^[A-Z0-9-]+$/, 'SKU can only contain uppercase letters, numbers, and hyphens.')
        .required('SKU is required.'),
    img: Yup.string()
        .url('Must be a valid URL.')
        .required('Image URL is required.'),
    discount: Yup.number()
        .min(0, 'Discount cannot be negative.')
        .max(100, 'Discount cannot exceed 100.')
        .nullable(),
    category: Yup.string().required('Category is required.'),
});

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    const initialFormState = {
        name: "", price: "", oldPrice: "", sku: "", img: "", discount: "", category: ""
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(API_URL);
            setProducts(res.data);
        } catch (err) {
            toast.error("Failed to fetch products.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openModal = (product = null) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleSaveProduct = async (values, { setSubmitting }) => {
        try {
            if (selectedProduct) {
                await axios.put(`${API_URL}/${selectedProduct._id}`, values);
                toast.success(`Product "${values.name}" updated successfully!`);
            } else {
                await axios.post(API_URL, values);
                toast.success(`Product "${values.name}" added successfully!`);
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save product.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        try {
            await axios.delete(`${API_URL}/${productToDelete._id}`);
            toast.success(`Product "${productToDelete.name}" deleted successfully!`);
            fetchProducts();
            setShowDeleteModal(false);
            setProductToDelete(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete product.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><FaBox className="w-7 h-7" />Product Management</h2>
                            <div className="flex items-center gap-4">
                                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg"><span className="text-blue-500 font-semibold text-sm">Total: {products.length}</span></div>
                                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-50 transition-all shadow-md font-medium"><FaPlus className="w-4 h-4" />Add Product</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        {products.length === 0 ? (
                            <div className="text-center py-16">
                                <FaInbox className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-medium">No products found</p>
                                <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><FaImage className="w-4 h-4" />Image</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><FaBox className="w-4 h-4" />Product</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><FaDollarSign className="w-4 h-4" />Price</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><FaDollarSign className="w-4 h-4" />Old Price</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><FaBarcode className="w-4 h-4" />SKU</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><FaTags className="w-4 h-4" />Category</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><FaTags className="w-4 h-4" />Discount</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><div className="flex items-center gap-2"><FaStar className="w-4 h-4" />Reviews</div></th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((p) => (
                                            <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap"><img src={p.img} alt={p.name} className="w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-200" /></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm font-medium text-gray-900">{p.name}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded"><FaDollarSign className="w-3 h-3 text-green-600" /><span className="text-sm font-semibold text-green-700">{p.price}</span></div></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm text-gray-500 line-through">${p.oldPrice}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><div className="flex items-center gap-2"><FaBarcode className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{p.sku}</span></div></td>
                                                <td className="px-4 py-3 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{p.category}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap">{p.discount ? (<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{p.discount}% OFF</span>) : (<span className="text-sm text-gray-400">-</span>)}</td>
                                                <td className="px-4 py-3 whitespace-nowrap"><button onClick={() => { setSelectedProduct(p); setShowReviewModal(true); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors"><FaStar className="w-3 h-3 text-yellow-600" /><span className="text-sm font-medium text-yellow-700">{p.reviews?.length || 0}</span></button></td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openModal(p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm"><FaEdit className="w-3 h-3" /><span className="text-xs font-medium">Edit</span></button>
                                                        <button onClick={() => openDeleteModal(p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm"><FaTrash className="w-3 h-3" /><span className="text-xs font-medium">Delete</span></button>
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

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <Formik
                            initialValues={selectedProduct || initialFormState}
                            validationSchema={ProductSchema}
                            onSubmit={handleSaveProduct}
                            enableReinitialize
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaBox className="w-5 h-5" />{selectedProduct ? "Edit Product" : "Add Product"}</h2>
                                            <button type="button" onClick={() => setShowModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5"><FaTimes className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                            <Field type="text" name="name" placeholder="Enter product name" className={`w-full px-3 py-2 border rounded-lg transition-all ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                                            <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                                <Field type="number" name="price" placeholder="0.00" className={`w-full px-3 py-2 border rounded-lg transition-all ${errors.price && touched.price ? 'border-red-500' : 'border-gray-300'}`} />
                                                <ErrorMessage name="price" component="p" className="mt-1 text-sm text-red-600" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                                                <Field type="number" name="oldPrice" placeholder="0.00" className={`w-full px-3 py-2 border rounded-lg transition-all ${errors.oldPrice && touched.oldPrice ? 'border-red-500' : 'border-gray-300'}`} />
                                                <ErrorMessage name="oldPrice" component="p" className="mt-1 text-sm text-red-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                            <Field type="text" name="sku" placeholder="Enter SKU" className={`w-full px-3 py-2 border rounded-lg transition-all ${errors.sku && touched.sku ? 'border-red-500' : 'border-gray-300'}`} />
                                            <ErrorMessage name="sku" component="p" className="mt-1 text-sm text-red-600" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                            <Field type="text" name="img" placeholder="https://example.com/image.jpg" className={`w-full px-3 py-2 border rounded-lg transition-all ${errors.img && touched.img ? 'border-red-500' : 'border-gray-300'}`} />
                                            <ErrorMessage name="img" component="p" className="mt-1 text-sm text-red-600" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                                <Field type="number" name="discount" placeholder="0" className={`w-full px-3 py-2 border rounded-lg transition-all ${errors.discount && touched.discount ? 'border-red-500' : 'border-gray-300'}`} />
                                                <ErrorMessage name="discount" component="p" className="mt-1 text-sm text-red-600" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                <Field as="select" name="category" className={`w-full px-3 py-2 border rounded-lg transition-all ${errors.category && touched.category ? 'border-red-500' : 'border-gray-300'}`}>
                                                    <option value="">Select Category</option>
                                                    <option value="Blouse">Blouse</option>
                                                    <option value="Trousers">Trousers</option>
                                                    <option value="Dresses">Dresses</option>
                                                    <option value="Sweaters">Sweaters</option>
                                                    <option value="Jackets">Jackets</option>
                                                    <option value="Shirts">Shirts</option>
                                                    <option value="Shorts">Shorts</option>
                                                    <option value="Jeans">Jeans</option>
                                                </Field>
                                                <ErrorMessage name="category" component="p" className="mt-1 text-sm text-red-600" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
                                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : (selectedProduct ? "Update Product" : "Add Product")}</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && productToDelete && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
                            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete the product <span className="font-bold">"{productToDelete.name}"</span>? This action cannot be undone.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">Cancel</button>
                                <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Delete</button>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {/* Review Modal (No changes needed here) */}
            {showReviewModal && selectedProduct && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    {/* ... Review Modal JSX ... */}
                 </div>
            )}
        </div>
    );
}