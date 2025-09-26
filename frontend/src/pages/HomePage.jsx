import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const HomePage = () => {
    return (
        <div className="text-center">
            <div className="bg-[var(--color-primary)] text-white py-20 rounded-lg shadow-lg">
                <h1 className="text-5xl font-bold mb-4">Fast, Reliable, and Secure Delivery</h1>
                <p className="text-xl mb-8">Your trusted partner for all delivery needs.</p>
                <Link to="/register">
                    <Button variant="secondary" className="text-lg px-8 py-3">Get Started</Button>
                </Link>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
                <Card title="Track Everything">
                    <p>Get real-time updates on your delivery from start to finish. Our live tracking map shows you exactly where your package is.</p>
                </Card>
                <Card title="Secure Handling">
                    <p>We handle every package with the utmost care. Our professional drivers ensure your items arrive safely and on time.</p>
                </Card>
                <Card title="24/7 Support">
                    <p>Have a question? Our support team is available around the clock to help you with any inquiries or issues you may have.</p>
                </Card>
            </div>
        </div>
    );
};

export default HomePage;
