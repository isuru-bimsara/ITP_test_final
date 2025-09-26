import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleDashboardRedirect = () => {
        if (user.role === 'Admin') {
            navigate('/admin');
        } else {
            navigate('/customer');
        }
    };
    
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-[var(--color-primary)]">Shopee</Link>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)]">Home</Link>
                    <Link to="/contact" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)]">Contact</Link>
                    {user ? (
                        <>
                            <Button onClick={handleDashboardRedirect} variant="secondary">Dashboard</Button>
                            <Button onClick={logout} variant="primary">Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)]">Login</Link>
                            <Link to="/register">
                                <Button>Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
