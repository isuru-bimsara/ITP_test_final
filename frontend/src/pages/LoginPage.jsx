//frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card title="Login">
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-[var(--color-text-main)]">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-[var(--color-border-main)] rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-[var(--color-text-main)]">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-[var(--color-border-main)] rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-[var(--color-primary)] hover:underline"
                    >
                        Register here
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default LoginPage;
