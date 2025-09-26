import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-text-main">Welcome, {user?.username}!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="New Delivery Request">
                    <p className="mb-4">Need to send a package? Get started right away.</p>
                    
                    <Button>Create New Order</Button>
                </Card>
                <Card title="Track Your Orders">
                    <p className="mb-4">View the status of all your ongoing and past deliveries.</p>
                    <Link to="/customer/orders">
                        <Button variant="secondary">Go to My Orders</Button>
                    </Link>
                </Card>
            </div>
        </div>
    );
};

export default CustomerDashboard;
