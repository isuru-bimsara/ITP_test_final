import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

// --- NEW IMPORTS for Validation and Toasts ---
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- STRIPE IMPORTS ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/CheckoutForm';



// --- STRIPE PROMISE ---
// Replace with your actual Stripe publishable key.
const stripePromise = loadStripe('pk_test_51RP6YlBMdUxFhkxwyJT32fuJF5y3mpSEiCqlMH0ifyYj3LnitGVMhTpYZgPNGoawokpTjJFXc1m7cjUJdfJSQWYo00zVV8OITy');

// --- YUP VALIDATION SCHEMA ---
const CustomerDetailsSchema = Yup.object().shape({
    name: Yup.string().trim().min(3, 'Name must be at least 3 characters.').required('Name is required.'),
    email: Yup.string().email('Invalid email address format.').required('Email is required.'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be between 10 and 15 digits.').required('Phone number is required.'),
    address: Yup.object().shape({
        street: Yup.string().trim().required('Street address is required.'),
        city: Yup.string().trim().required('City is required.'),
        state: Yup.string().trim().required('State / Province is required.'),
        zipCode: Yup.string().trim().matches(/^[A-Z0-9\s-]{3,10}$/, 'Invalid ZIP / Postal code.').required('ZIP / Postal Code is required.'),
        country: Yup.string().trim().required('Country is required.'),
    }),
});

function OrderReview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [order, setOrder] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [areDetailsConfirmed, setAreDetailsConfirmed] = useState(false); // State to lock payment button

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const fetchOrderAndProduct = async () => {
            try {
                const orderRes = await axios.get(`http://localhost:5000/api/orders/${id}`);
                const orderData = orderRes.data;
                setOrder(orderData);

                const initialDetails = {
                    name: orderData.customerOrderDetails?.customerName || user.username || '',
                    email: orderData.customerOrderDetails?.customerEmail || user.email || '',
                    phone: orderData.customerOrderDetails?.customerPhone || '',
                    address: orderData.customerOrderDetails?.address || { street: '', street2: '', city: '', state: '', zipCode: '', country: '' }
                };
                setCustomerDetails(initialDetails);
                
                // Automatically confirm details if they are valid on load
                const isValid = await CustomerDetailsSchema.isValid(initialDetails);
                setAreDetailsConfirmed(isValid);
                if (!isValid) {
                    setIsEditing(true); // Force user to edit if details are incomplete
                    toast.info("Please complete your shipping details to proceed.");
                }


                const productId = orderData.customerOrderDetails?.productId;
                if (!productId) throw new Error('Product not found in this order');
                
                const productRes = await axios.get(`http://localhost:5000/api/products/${productId}`);
                setProduct(productRes.data);

            } catch (err) {
                console.error(err);
                const errorMessage = 'Failed to fetch order details.';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderAndProduct();
    }, [id, user]);

    const handleEditToggle = () => {
        setIsEditing(prev => !prev);
        if (!isEditing) {
            setAreDetailsConfirmed(false); // Lock payment button when editing starts
        }
    };

    const handleConfirmDetails = (values) => {
        setCustomerDetails(values);
        setIsEditing(false);
        setAreDetailsConfirmed(true); // Unlock payment button upon confirmation
        toast.success('Customer & Shipping Details confirmed!');
    };

    const handleProceedToPayment = async () => {
        if (!areDetailsConfirmed) {
            toast.warn('Please fill in and confirm your customer details before proceeding.');
            return;
        }

        try {
            const quantity = order?.items?.[0]?.quantity ?? 1;
            const subtotal = product.price * quantity;
            const tax = subtotal * 0.08;
            const total = (subtotal + tax).toFixed(2);

            const updatedOrderData = {
                customerOrderDetails: { ...order.customerOrderDetails, ...customerDetails },
                items: order.items,
            };
            sessionStorage.setItem('finalOrderData', JSON.stringify(updatedOrderData));

            const res = await axios.post('http://localhost:5000/api/payment/create-payment-intent', { amount: total });
            setClientSecret(res.data.clientSecret);
            setShowPaymentForm(true);
        } catch (error) {
            console.error('Error initiating payment:', error);
            toast.error('Failed to start payment process. Please try again.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product || !order || !customerDetails) return <div>Order or Product not found</div>;

    const quantity = order?.items?.[0]?.quantity ?? 1;
    const subtotal = product.price * quantity;
    const tax = subtotal * 0.08;
    const total = (subtotal + tax).toFixed(2);
    const selectedOptions = order.customerOrderDetails || {};

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            {showPaymentForm && clientSecret && (
                 <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <button onClick={() => setShowPaymentForm(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', lineHeight: '1' }}>&times;</button>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Complete Your Payment</h2>
                        <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                            <CheckoutForm orderId={id} />
                        </Elements>
                    </div>
                 </div>
            )}
            <div style={{ background: '#f7fbff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0 24px', marginTop: '20px' }}>
                    <button onClick={() => navigate(`/product/${product._id}`)} style={{ background: 'transparent', color: '#374151', border: 'none', padding: '8px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                        Back
                    </button>
                </div>
                <div style={{ padding: '32px 0', flex: 1 }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#2d3748', marginBottom: 16 }}>Order Summary</h1>
                            <p style={{ fontSize: 18, color: '#4a5568' }}>Please review your order details and confirm to proceed with payment.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32, marginBottom: 32 }}>
                            {/* Order Summary Column */}
                            <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                                <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                                    <img src={product.img} alt={product.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#2d3748' }}>{product.name}</h3>
                                        {selectedOptions.color && <p style={{ fontSize: 14, color: '#4a5568' }}>Color: {selectedOptions.color}</p>}
                                        {quantity && <p style={{ fontSize: 14, color: '#4a5568' }}>Quantity: {quantity}</p>}
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#6b7280' }}>Subtotal:</span><span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#6b7280' }}>Shipping:</span><span style={{ fontWeight: 600, color: '#10b981' }}>FREE</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><span style={{ color: '#6b7280' }}>Tax (8%):</span><span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '2px solid #e5e7eb' }}><span style={{ fontSize: 18, fontWeight: 700 }}>Total:</span><span style={{ fontSize: 20, fontWeight: 700 }}>${total}</span></div>
                                </div>
                            </div>

                            {/* Customer & Shipping Details Column */}
                            <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#2d3748', margin: 0 }}>Customer & Shipping</h2>
                                    {!isEditing && <button onClick={handleEditToggle} style={{ background: 'transparent', color: '#000000', border: 'none', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Edit</button>}
                                </div>
                                {isEditing ? (
                                    <Formik initialValues={customerDetails} validationSchema={CustomerDetailsSchema} onSubmit={handleConfirmDetails} enableReinitialize>
                                        {({ isSubmitting }) => (
                                            <Form>
                                                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Customer Information</h3>
                                                <Field name="name" placeholder="Name" style={{width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                                <ErrorMessage name="name" component="div" style={{color: 'red', fontSize: '12px', marginBottom: '8px'}} />
                                                
                                                <Field name="email" type="email" placeholder="Email" style={{width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                                <ErrorMessage name="email" component="div" style={{color: 'red', fontSize: '12px', marginBottom: '8px'}} />

                                                <Field name="phone" placeholder="Phone" style={{width: '100%', padding: '8px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                                <ErrorMessage name="phone" component="div" style={{color: 'red', fontSize: '12px', marginBottom: '8px'}} />

                                                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Shipping Address</h3>
                                                <Field name="address.street" placeholder="Street Address" style={{width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                                <ErrorMessage name="address.street" component="div" style={{color: 'red', fontSize: '12px', marginBottom: '8px'}} />
                                                
                                                <Field name="address.city" placeholder="City" style={{width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                                <ErrorMessage name="address.city" component="div" style={{color: 'red', fontSize: '12px', marginBottom: '8px'}} />
                                                
                                                <Field name="address.state" placeholder="State" style={{width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                                <ErrorMessage name="address.state" component="div" style={{color: 'red', fontSize: '12px', marginBottom: '8px'}} />

                                                <Field name="address.zipCode" placeholder="ZIP Code" style={{width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                                <ErrorMessage name="address.zipCode" component="div" style={{color: 'red', fontSize: '12px', marginBottom: '8px'}} />

                                                <Field name="address.country" placeholder="Country" style={{width: '100%', padding: '8px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                                                <ErrorMessage name="address.country" component="div" style={{color: 'red', fontSize: '12px', marginBottom: '8px'}} />

                                                <div style={{display: 'flex', gap: '16px'}}>
                                                    <button type="button" onClick={handleEditToggle} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', flex: 1 }}>Cancel</button>
                                                    <button type="submit" disabled={isSubmitting} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', flex: 2 }}>{isSubmitting ? 'Saving...' : '✓ Confirm Details'}</button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                ) : (
                                    <div>
                                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Customer Information</h3>
                                        <p><strong>Name:</strong> {customerDetails.name}</p><p><strong>Email:</strong> {customerDetails.email}</p><p><strong>Phone:</strong> {customerDetails.phone}</p>
                                        <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 24, marginBottom: 16 }}>Shipping Address</h3>
                                        <p>{customerDetails.address.street}</p><p>{customerDetails.address.city}, {customerDetails.address.state} {customerDetails.address.zipCode}</p><p>{customerDetails.address.country}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={handleProceedToPayment}
                                disabled={!areDetailsConfirmed}
                                title={!areDetailsConfirmed ? 'Please confirm your customer and shipping details to proceed.' : 'Proceed to Payment'}
                                style={{
                                    background: !areDetailsConfirmed ? '#d1d5db' : '#3b82f6',
                                    color: '#fff', border: 'none', borderRadius: 25, padding: '16px 48px',
                                    fontWeight: 700, fontSize: 18, cursor: !areDetailsConfirmed ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s ease',
                                    textTransform: 'uppercase', letterSpacing: '1px'
                                }}
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderReview;

