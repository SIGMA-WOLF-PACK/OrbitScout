"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Rocket, CalendarIcon } from 'lucide-react'; 

const AuthDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Handle signup or login logic here
        console.log(isLogin ? 'Login successful' : 'Signup successful', { email, password });
        onClose(); // Close the dialog after submission
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-white">
                        <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
                        Welcome to Orbit Scout, Login to your Account!
                    </DialogTitle>
                </DialogHeader>
                {/* <div className="space-y-6 text-white">
                    <p className="text-lg">
                        Get ready to embark on an amazing street food adventure! Join us to explore delicious street food options and enjoy great rewards!
                    </p>
                    <div className="bg-white/10 p-6 rounded-xl">
                        <h3 className="font-semibold mb-4 text-xl">Your Food Mission:</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <Star className="h-5 w-5 text-yellow-300" />
                                Discover hidden street food gems around you
                            </li>
                            <li className="flex items-center gap-3">
                                <Rocket className="h-5 w-5 text-yellow-300" />
                                Click on food carts to learn about their specialties
                            </li>
                            <li className="flex items-center gap-3">
                                <CalendarIcon className="h-5 w-5 text-yellow-300" />
                                Participate in daily challenges to earn rewards
                            </li>
                        </ul>
                    </div>
                </div> */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div>
                        <label className="text-white">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 p-2 w-full rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="text-white">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 p-2 w-full rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                            placeholder="Enter your password"
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <label className="text-white">Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 p-2 w-full rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400"
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                            {isLogin ? 'Login' : 'Signup'}
                        </Button>
                    </div>
                </form>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70">
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default AuthDialog;
