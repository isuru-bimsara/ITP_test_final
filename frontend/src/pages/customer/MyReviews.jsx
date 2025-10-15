import React, { useState, useEffect } from "react";
import axios from 'axios';

// New imports for validation and toast notifications
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../hooks/useAuth';
import { GoCodeReview } from "react-icons/go";

// A custom StarRating component to be used inside and outside Formik
const StarRating = ({ rating, setRating, isStatic = false }) => {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onClick={() => !isStatic && setRating(star)}
                    className={`w-8 h-8 transition-colors duration-200 ${isStatic ? '' : 'cursor-pointer'} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
};

// Validation Schema for the review form
const ReviewSchema = Yup.object().shape({
    rating: Yup.number()
        .min(1, 'Please select at least one star.')
        .required('A star rating is required.'),
    comment: Yup.string()
        .max(500, 'Comment cannot exceed 500 characters.'),
});

const MyReviews = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState({});
    const { user } = useAuth();
    const [activeReviewForm, setActiveReviewForm] = useState(null);

    useEffect(() => {
        const fetchMyOrdersAndReviews = async () => {
            if (!user?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
                const [deliveryRes, reviewRes] = await Promise.all([
                    fetch('/api/deliveries/my-orders', config),
                    fetch('/api/reviews/my-reviews', config)
                ]);

                if (!deliveryRes.ok) throw new Error("Failed to fetch your deliveries");
                const deliveriesData = await deliveryRes.json();
                const deliveredOrders = deliveriesData.filter(d => d.status === "Delivered");
                setOrders(deliveredOrders);

                if (!reviewRes.ok) throw new Error("Failed to fetch your reviews");
                const reviewData = await reviewRes.json();

                const reviewsMap = reviewData.reduce((acc, r) => {
                    if (r.delivery?._id) {
                        acc[r.delivery._id] = r;
                    }
                    return acc;
                }, {});
                setReviews(reviewsMap);

            } catch (err) {
                toast.error(err.message || "Failed to load review data.");
                console.error("❌ Error fetching data:", err.message);
            }
        };
        fetchMyOrdersAndReviews();
    }, [user]);

    const handleReviewSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } };
            const reviewData = {
                deliveryId: activeReviewForm,
                rating: values.rating,
                comment: values.comment,
            };

            const res = await axios.post("/api/reviews", reviewData, config);

            setReviews(prev => ({ ...prev, [activeReviewForm]: res.data }));
            toast.success("Thank you! Your review has been submitted successfully.");
            
            setActiveReviewForm(null);
            resetForm();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to submit review. Please try again.";
            toast.error(errorMessage);
            console.error("❌ Error submitting review:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleReviewForm = (orderId) => {
        setActiveReviewForm(prev => (prev === orderId ? null : orderId));
    };

    const styles = {
        primary: '#1a73e8', primaryHover: '#1765cc', secondary: '#f1f3f4',
        secondaryHover: '#e8eaed', borderMain: '#dadce0', textMain: '#202124', textSecondary: '#5f6368'
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: styles.secondary }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg mb-4">
                        <GoCodeReview className="text-3xl" />
                        <h1 className="text-3xl font-bold">My Reviews</h1>
                    </div>
                    <p className="text-gray-600 text-lg font-medium">Honest Reviews to Help You Decide</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Stat Cards */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: styles.borderMain }}><div className="flex items-center"><div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: styles.secondary }}><svg className="w-6 h-6" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div><div><p className="text-sm" style={{ color: styles.textSecondary }}>Delivered Orders</p><p className="text-2xl font-bold" style={{ color: styles.textMain }}>{orders.length}</p></div></div></div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: styles.borderMain }}><div className="flex items-center"><div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: styles.secondary }}><svg className="w-6 h-6" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg></div><div><p className="text-sm" style={{ color: styles.textSecondary }}>Reviews Given</p><p className="text-2xl font-bold" style={{ color: styles.textMain }}>{Object.keys(reviews).length}</p></div></div></div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: styles.borderMain }}><div className="flex items-center"><div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: styles.secondary }}><svg className="w-6 h-6" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><p className="text-sm" style={{ color: styles.textSecondary }}>Pending Reviews</p><p className="text-2xl font-bold" style={{ color: styles.textMain }}>{orders.length - Object.keys(reviews).length}</p></div></div></div>
                </div>

                <div className="space-y-6">
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <div key={order._id} className="bg-white rounded-3xl shadow-lg border transition-all duration-300 hover:shadow-xl" style={{ borderColor: styles.borderMain, animation: `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`, opacity: 0 }}>
                                <div className="px-8 py-6 border-b rounded-t-3xl" style={{ backgroundColor: styles.secondary, borderColor: styles.borderMain }}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold" style={{ color: styles.textMain }}>Order #{order.orderId}</h3>
                                            <p className="text-sm mt-1" style={{ color: styles.textSecondary }}>Delivered to: {order.deliveryAddress}</p>
                                        </div>
                                        <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div><span className="text-green-600 font-semibold">{order.status}</span></div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    {reviews[order._id] ? (
                                        <div>
                                            <div className="flex items-center mb-4"><div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: styles.primary }}><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div><h4 className="text-lg font-semibold" style={{ color: styles.textMain }}>Your Review</h4></div>
                                            <div className="p-6 rounded-2xl border" style={{ backgroundColor: styles.secondary, borderColor: styles.borderMain }}>
                                                <div className="mb-4"><StarRating rating={reviews[order._id].rating} isStatic={true} /></div>
                                                {reviews[order._id].comment && (<div className="bg-white p-4 rounded-xl border" style={{ borderColor: styles.borderMain }}><p className="italic" style={{ color: styles.textMain }}>"{reviews[order._id].comment}"</p></div>)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center"><div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: styles.secondary }}><svg className="w-6 h-6" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg></div><h4 className="text-lg font-semibold" style={{ color: styles.textMain }}>Share Your Experience</h4></div>
                                                <button onClick={() => toggleReviewForm(order._id)} className="px-6 py-3 rounded-xl font-semibold transition-all" style={{ backgroundColor: activeReviewForm === order._id ? styles.secondaryHover : styles.primary, color: activeReviewForm === order._id ? styles.textMain : 'white' }}>{activeReviewForm === order._id ? 'Cancel' : 'Write Review'}</button>
                                            </div>
                                            {activeReviewForm === order._id && (
                                                <Formik initialValues={{ rating: 0, comment: '' }} validationSchema={ReviewSchema} onSubmit={handleReviewSubmit}>
                                                    {({ isSubmitting, setFieldValue, values }) => (
                                                        <Form className="p-6 rounded-2xl border animate-fadeInUp" style={{ backgroundColor: styles.secondary, borderColor: styles.borderMain }}>
                                                            <div className="mb-6">
                                                                <label className="block text-sm font-semibold mb-3" style={{ color: styles.textMain }}>Your Rating *</label>
                                                                <div className="bg-white p-4 rounded-xl border" style={{ borderColor: styles.borderMain }}>
                                                                    <StarRating rating={values.rating} setRating={(rating) => setFieldValue('rating', rating)} />
                                                                </div>
                                                                <ErrorMessage name="rating" component="p" className="text-red-500 text-xs mt-2" />
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-sm font-semibold mb-3" style={{ color: styles.textMain }}>Your Comments (Optional)</label>
                                                                <Field as="textarea" name="comment" className="w-full px-4 py-3 border rounded-xl" style={{ borderColor: styles.borderMain }} rows="4" placeholder="Share your experience..." />
                                                                <ErrorMessage name="comment" component="p" className="text-red-500 text-xs mt-2" />
                                                            </div>
                                                            <button type="submit" disabled={isSubmitting} className="w-full px-6 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50" style={{ backgroundColor: styles.primary }}>
                                                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                                            </button>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl shadow-lg border p-12 text-center" style={{ borderColor: styles.borderMain }}>
                            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: styles.secondary }}><svg className="w-10 h-10" style={{ color: styles.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg></div>
                            <h3 className="text-xl font-semibold mb-2" style={{ color: styles.textMain }}>No Delivered Orders Yet</h3>
                            <p style={{ color: styles.textSecondary }}>You have no completed deliveries to review at this time.</p>
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default MyReviews;

