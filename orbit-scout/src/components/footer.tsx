"use client";

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-12 bg-purple-900/50 backdrop-blur-md text-white py-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-5 text-center">
                <p className="text-purple-200">
                    Space data provided by our friends at NASA! 🛸
                </p>
                <p className="text-purple-200 mt-2">
                    Check out our project on <a href="https://github.com/SIGMA-WOLF-PACK/OrbitScout/tree/main/orbit-scout" className="text-yellow-300 underline">GitHub</a>!
                </p>
            </div>
        </footer>
    );
};

export default Footer;