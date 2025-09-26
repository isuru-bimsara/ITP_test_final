import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-[var(--color-border-main)]">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
                    Welcome, {user?.username}
                </h2>
            </div>
            <div className="flex items-center">
                <img
                    className="w-10 h-10 rounded-full object-cover mr-4"
                    src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                    alt="User Avatar"
                />
                <Button onClick={logout} variant="primary">Logout</Button>
            </div>
        </header>
    );
};

export default Header;
