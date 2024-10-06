import React from 'react';

interface DropdownMenuProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onLoginClick, onSignupClick }) => {
    return (
        <div className="absolute right-0 mt-2 w-40 md:w-48 bg-white text-black rounded-md shadow-lg">
            <button onClick={onLoginClick} className="block px-4 py-2 text-left text-sm md:text-lg font-semibold hover:bg-gray-200">
                Login
            </button>
            <button onClick={onSignupClick} className="block px-4 py-2 text-left text-sm md:text-lg font-semibold hover:bg-gray-200">
                Sign Up
            </button>
        </div>
    );
};

export default DropdownMenu;