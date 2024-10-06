"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Handle signup logic here
        console.log('Signup successful', { email, password });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900">
            <Navbar />

            <main className="flex items-center justify-center max-w-7xl mx-auto px-5">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 w-full max-w-md">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-white">Create Your Account</h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600">
                                Signup
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default SignupPage;
