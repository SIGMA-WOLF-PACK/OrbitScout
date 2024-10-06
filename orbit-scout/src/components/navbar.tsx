"use client";

import React, { useState } from 'react';
import { Telescope, User } from 'lucide-react';
import Link from 'next/link';
import AuthDialog from './authDialogue';

const Navbar: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 md:py-8 mb-8 rounded-b-3xl shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Telescope size={40} className="h-12 w-12 animate-bounce" />
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 font-comic">Orbit Scout!</h1>
                            <p className="text-sm md:text-lg opacity-90">
                                Join us on an amazing journey through space! 🚀✨
                            </p>
                        </div>
                    </div>
                    <nav className="flex items-center gap-2 md:gap-4">
                        <Link href="/" className="text-sm md:text-lg font-semibold hover:underline">Home</Link>
                        <Link href="/learners" className="text-sm md:text-lg font-semibold hover:underline">Learners</Link>
                        <div className="relative">
                            <button onClick={toggleDropdown} className="flex items-center text-sm md:text-lg font-semibold hover:underline">
                                <User className="h-6 w-6 md:h-8 md:w-8" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 md:w-48 bg-white text-black rounded-md shadow-lg">
                                    <Link href="/login" className="block px-4 py-2 hover:bg-gray-200">Login</Link>
                                    <Link href="/signup" className="block px-4 py-2 hover:bg-gray-200">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;