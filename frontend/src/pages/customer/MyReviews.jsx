import React, { useState, useEffect } from 'react';


import StarRating from '../../components/customer/StarRating';
import { useAuth } from '../../hooks/useAuth';

const MyReviews = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { user } = useAuth();

    // Form state
    const [currentRating, setCurrentRating] = useState(0);
    const [currentComment, setCurrentComment] = useState('');
    const [activeReviewForm, setActiveReviewForm] = useState(null);

    // Fetch orders and my reviews
    const fetchMyOrdersAndReviews = async () => {
        if (!user?.token) return;
        setError(null);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // 1. Fetch my delivered orders
            const orderRes = await fetch('/api/deliveries/my-orders', config);
            if (!orderRes.ok) throw new Error('Failed to fetch your orders.');
            const ordersData = await orderRes.json();
            const deliveredOrders = ordersData.filter(o => o.status === 'Delivered');
            setOrders(deliveredOrders);

            // 2. Fetch my existing reviews
            const reviewRes = await fetch('/api/reviews/my-reviews', config);
            if (!reviewRes.ok) throw new Error('Failed to fetch your reviews.');
            const reviewData = await reviewRes.json();

            // Map reviews by deliveryId
            const reviewsMap = {};
            reviewData.forEach(r => {
                if (r.delivery?._id) {
                    reviewsMap[r.delivery._id] = r;
                }
            });
            setReviews(reviewsMap);

        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchMyOrdersAndReviews();
    }, [user]);

    // Submit a review
    const handleReviewSubmit = async (deliveryId) => {
        setError(null);
        setSuccess(null);

        if (currentRating === 0) {
            setError('Please select a star rating before submitting.');
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    deliveryId,
                    rating: currentRating,
                    comment: currentComment,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to submit review.');

            setSuccess('Thank you! Your review has been submitted successfully.');
            setActiveReviewForm(null);
            setCurrentRating(0);
            setCurrentComment('');
            fetchMyOrdersAndReviews();
        } catch (err) {
            setError(err.message);
        }
    };

  
    const toggleReviewForm = (orderId) => {
        if (activeReviewForm === orderId) {
            setActiveReviewForm(null);
        } else {
            setActiveReviewForm(orderId);
            setCurrentRating(0);
            setCurrentComment('');
        }
    };

    const styles = {
        primary: '#1a73e8',
        primaryHover: '#1765cc',
        secondary: '#f1f3f4',
        secondaryHover: '#e8eaed',
        borderMain: '#dadce0',
        textMain: '#202124',
        textSecondary: '#5f6368'
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: styles.secondary }}>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center mb-6">
                       
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2" style={{ color: styles.textMain }}>
                                My Reviews
                            </h1>

                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: styles.borderMain }}>
                            <div className="flex items-center">
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                                    style={{ backgroundColor: styles.secondary }}
                                >
                                    <svg className="w-6 h-6" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm" style={{ color: styles.textSecondary }}>Total Orders</p>
                                    <p className="text-2xl font-bold" style={{ color: styles.textMain }}>{orders.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: styles.borderMain }}>
                            <div className="flex items-center">
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                                    style={{ backgroundColor: styles.secondary }}
                                >
                                    <svg className="w-6 h-6" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm" style={{ color: styles.textSecondary }}>Reviews Given</p>
                                    <p className="text-2xl font-bold" style={{ color: styles.textMain }}>{Object.keys(reviews).length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: styles.borderMain }}>
                            <div className="flex items-center">
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                                    style={{ backgroundColor: styles.secondary }}
                                >
                                    <svg className="w-6 h-6" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm" style={{ color: styles.textSecondary }}>Pending Reviews</p>
                                    <p className="text-2xl font-bold" style={{ color: styles.textMain }}>
                                        {orders.length - Object.keys(reviews).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-red-700 font-medium">{`Error: ${error}`}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-green-700 font-medium">{success}</p>
                        </div>
                    </div>
                )}

                {/* Orders Grid */}
                <div className="space-y-6">
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-3xl shadow-lg border transition-all duration-300 hover:shadow-xl"
                                style={{ 
                                    borderColor: styles.borderMain,
                                    animationDelay: `${index * 0.1}s`,
                                    animation: 'fadeInUp 0.5s ease-out forwards'
                                }}
                            >
                                {/* Order Header */}
                                <div 
                                    className="px-8 py-6 border-b rounded-t-3xl"
                                    style={{ backgroundColor: styles.secondary, borderColor: styles.borderMain }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold" style={{ color: styles.textMain }}>
                                                Order #{order.orderId}
                                            </h3>
                                            <p className="text-sm mt-1" style={{ color: styles.textSecondary }}>
                                                Delivered to: {order.deliveryAddress}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-green-600 font-semibold">{order.status}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Section */}
                                <div className="p-8">
                                    {reviews[order._id] ? (
                                        <div>
                                            <div className="flex items-center mb-4">
                                                <div 
                                                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                                    style={{ backgroundColor: styles.primary }}
                                                >
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-semibold" style={{ color: styles.textMain }}>
                                                    Your Review
                                                </h4>
                                            </div>
                                            
                                            <div 
                                                className="p-6 rounded-2xl border"
                                                style={{ backgroundColor: styles.secondary, borderColor: styles.borderMain }}
                                            >
                                                <div className="mb-4">
                                                    <StarRating rating={reviews[order._id].rating} isStatic={true} />
                                                </div>
                                                {reviews[order._id].comment && (
                                                    <div className="bg-white p-4 rounded-xl border" style={{ borderColor: styles.borderMain }}>
                                                        <div className="flex items-start">
                                                            <svg className="w-5 h-5 mr-3 mt-0.5" style={{ color: styles.textSecondary }} fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                                                            </svg>
                                                            <p className="italic" style={{ color: styles.textMain }}>
                                                                {reviews[order._id].comment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div 
                                                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                                        style={{ backgroundColor: styles.secondary }}
                                                    >
                                                        <svg className="w-6 h-6" style={{ color: styles.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-lg font-semibold" style={{ color: styles.textMain }}>
                                                        Share Your Experience
                                                    </h4>
                                                </div>
                                                
                                                <button
                                                    onClick={() => toggleReviewForm(order._id)}
                                                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                                                    style={{
                                                        backgroundColor: activeReviewForm === order._id ? styles.secondaryHover : styles.primary,
                                                        color: activeReviewForm === order._id ? styles.textMain : 'white'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (activeReviewForm !== order._id) {
                                                            e.target.style.backgroundColor = styles.primaryHover;
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (activeReviewForm !== order._id) {
                                                            e.target.style.backgroundColor = styles.primary;
                                                        }
                                                    }}
                                                >
                                                    {activeReviewForm === order._id ? 'Cancel Review' : 'Write Review'}
                                                </button>
                                            </div>

                                            {activeReviewForm === order._id && (
                                                <div 
                                                    className="p-6 rounded-2xl border transition-all duration-300"
                                                    style={{ backgroundColor: styles.secondary, borderColor: styles.borderMain }}
                                                >
                                                    <div className="mb-6">
                                                        <label className="block text-sm font-semibold mb-3" style={{ color: styles.textMain }}>
                                                            Your Rating *
                                                        </label>
                                                        <div className="bg-white p-4 rounded-xl border" style={{ borderColor: styles.borderMain }}>
                                                            <StarRating rating={currentRating} setRating={setCurrentRating} />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mb-6">
                                                        <label className="block text-sm font-semibold mb-3" style={{ color: styles.textMain }}>
                                                            Your Comments (Optional)
                                                        </label>
                                                        <textarea
                                                            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
                                                            style={{ 
                                                                borderColor: styles.borderMain,
                                                                focusRingColor: styles.primary 
                                                            }}
                                                            onFocus={(e) => {
                                                                e.target.style.borderColor = styles.primary;
                                                                e.target.style.boxShadow = `0 0 0 2px ${styles.primary}33`;
                                                            }}
                                                            onBlur={(e) => {
                                                                e.target.style.borderColor = styles.borderMain;
                                                                e.target.style.boxShadow = 'none';
                                                            }}
                                                            rows="4"
                                                            placeholder="Share your experience with this order... What did you like? Any suggestions for improvement?"
                                                            value={currentComment}
                                                            onChange={(e) => setCurrentComment(e.target.value)}
                                                        />
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => handleReviewSubmit(order._id)}
                                                        className="w-full px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                                                        style={{ backgroundColor: styles.primary }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = styles.primaryHover;
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = styles.primary;
                                                        }}
                                                    >
                                                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                                        </svg>
                                                        Submit Review
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl shadow-lg border p-12 text-center" style={{ borderColor: styles.borderMain }}>
                            <div 
                                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ backgroundColor: styles.secondary }}
                            >
                                <svg className="w-10 h-10" style={{ color: styles.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2" style={{ color: styles.textMain }}>
                                No Delivered Orders Yet
                            </h3>
                            <p style={{ color: styles.textSecondary }}>
                                You have no completed deliveries to review at this time. Once your orders are delivered, you'll be able to share your experience here.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default MyReviews;