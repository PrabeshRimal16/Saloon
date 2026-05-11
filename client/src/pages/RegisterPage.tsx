import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // If already logged in, redirect home
    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirm: '',
        agreed: false,
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, phone, password, confirm, agreed } = form;

        if (!name || !email || !password || !confirm) {
            setStatus('error');
            setMessage('Please fill in all required fields.');
            return;
        }
        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }
        if (!agreed) {
            setStatus('error');
            setMessage('You must agree to the Terms of Membership.');
            return;
        }

        setStatus('loading');
        setMessage('');

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name, phone },
            },
        });

        if (error) {
            setStatus('error');
            setMessage(error.message);
            return;
        }

        // Insert profile row
        if (data.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                full_name: name,
                email,
                phone,
            });
        }

        setStatus('success');
        setMessage(
            data.session
                ? 'Account created! Redirecting…'
                : 'Account created! Please check your email to confirm, then log in.'
        );
        if (data.session) {
            setTimeout(() => navigate('/'), 1200);
        }
    };

    const FeedbackBanner = () => {
        if (status === 'idle' || status === 'loading') return null;
        const isError = status === 'error';
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-3 p-4 rounded-lg border ${
                        isError
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-green-50 border-green-200 text-green-800'
                    }`}
                >
                    {isError ? (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{message}</p>
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <div className="section-sm flex items-center justify-center min-h-screen">
            <div className="card w-full max-w-md p-8 md:p-12">
                <div className="text-center">
                    <p className="eyebrow mb-2">START YOUR JOURNEY</p>
                    <h1 className="text-4xl md:text-5xl mb-6">Create Account</h1>
                </div>

                <FeedbackBanner />

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
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="field-label">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            className="input-field"
                            placeholder="(555) 123-4567"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="field-label">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="input-field pr-12"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm" className="field-label">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                id="confirm"
                                className="input-field pr-12"
                                placeholder="••••••••"
                                value={form.confirm}
                                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="agreed"
                            className="mt-1"
                            checked={form.agreed}
                            onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                            required
                        />
                        <label htmlFor="agreed" className="text-sm text-muted leading-relaxed">
                            I agree to the{' '}
                            <a href="#" className="text-gold hover:underline">
                                Terms of Membership
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-gold hover:underline">
                                Privacy Policy
                            </a>
                            .
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn-gold mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                        <UserPlus className="w-4 h-4" />
                        Create Account
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