import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        // For now, we'll just log the data.
        // In the next step, we'll send this to our backend API.
        console.log({ name, email, password });
    };


    return (
        <div className="section-sm flex items-center justify-center min-h-screen">
            <div className="card w-full max-w-md p-8 md:p-12">
                <div className="text-center">
                    <p className="eyebrow mb-2">START YOUR JOURNEY</p>
                    <h1 className="text-4xl md:text-5xl mb-6">Create Account</h1>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="name" className="field-label">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="input-field"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="field-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="field-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-gold mt-2">
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-muted mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-gold hover:underline">
                        Log In
                    </Link>

                </p>
            </div>
        </div>
    );
};

export default RegisterPage;