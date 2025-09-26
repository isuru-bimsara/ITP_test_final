import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/common/Card';
import StatusTracker from '../../components/customer/StatusTracker';
import { useAuth } from '../../hooks/useAuth';

const API_URL = 'http://localhost:5000/api';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if(user) {
            const fetchOrders = async () => {
                try {
                    const res = await axios.get(`${API_URL}/deliveries/my-orders`);
                    setOrders(res.data);
                } catch (error) {
                    console.error("Failed to fetch orders:", error);
                }
            };
            fetchOrders();
        }
    }, [user]);

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
        <div className="p-6 max-w-6xl mx-auto min-h-screen" style={{ backgroundColor: 'var(--color-secondary)' }}>
                        <div>
                            <h1 className="text-3xl font-bold mb-10" style={{ color: styles.textMain }}>
                                My Delivery Orders
                            </h1>

                        </div>
            
            {orders.length > 0 ? (
                orders.map(order => (
                    <div
                        key={order._id}
                        className="mb-5 p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                        style={{ borderColor: 'var(--color-border-main)', border: '1px solid' }}
                    >
                        <div className="flex justify-between items-start mb-5 flex-wrap gap-4">
                            <div className="flex-1 min-w-64">
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                                    Order 
                                    <span 
                                        className="px-2 py-1 rounded-md text-sm font-medium"
                                        style={{ 
                                            backgroundColor: 'var(--color-secondary)',
                                            color: 'var(--color-text-main)'
                                        }}
                                    >
                                        #{order.orderId}
                                    </span>
                                </h3>
                                
                                <div className="mb-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                                    <span className="font-semibold mr-2" style={{ color: 'var(--color-text-main)' }}>
                                        Delivery To:
                                    </span>
                                    {order.deliveryAddress}
                                </div>
                                
                                <div className="mb-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                                    <span className="font-semibold mr-2" style={{ color: 'var(--color-text-main)' }}>
                                        Driver:
                                    </span>
                                    <span className="flex items-center gap-1.5 inline-flex">
                                        {order.driver?.name ? (
                                            <>
                                                <div 
                                                    className="w-5 h-5 rounded-full text-white flex items-center justify-center text-xs font-semibold"
                                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                                >
                                                    {order.driver.name.charAt(0).toUpperCase()}
                                                </div>
                                                {order.driver.name}
                                            </>
                                        ) : (
                                            <span className="italic" style={{ color: 'var(--color-text-secondary)' }}>
                                                Not Assigned
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-right min-w-36">
                                <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                                    Status
                                </div>
                                <span 
                                    className="text-sm font-semibold px-3 py-1.5 rounded-full inline-block capitalize border"
                                    style={{ 
                                        color: 'var(--color-primary)',
                                        backgroundColor: 'rgba(26, 115, 232, 0.1)',
                                        borderColor: 'rgba(26, 115, 232, 0.2)'
                                    }}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--color-border-main)' }}>
                            <StatusTracker status={order.status} />
                        </div>
                    </div>
                ))
            ) : (
                <div 
                    className="text-center p-16 bg-white rounded-xl shadow-md"
                    style={{ border: '1px solid var(--color-border-main)' }}
                >
                    <div className="text-5xl mb-4" style={{ color: 'var(--color-border-main)' }}>
                        📦
                    </div>
                    <p className="text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                        You have no active orders at the moment.
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Your delivery orders will appear here once you place them.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyOrders;