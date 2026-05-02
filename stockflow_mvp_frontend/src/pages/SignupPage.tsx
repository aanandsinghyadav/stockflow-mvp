import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import type { ApiResponse, AuthResponse } from '../types';
import Spinner from '../components/Spinner';

interface FormState {
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]           = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading]       = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name as keyof FormState]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<FormState> = {};
    if (!form.organizationName.trim()) errors.organizationName = 'Organization name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/signup', {
        email: form.email,
        password: form.password,
        organizationName: form.organizationName,
      });
      login(data.data.token, {
        email: data.data.email,
        organizationName: data.data.organizationName,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][strength];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">
              📦
            </div>
            <span className="text-xl font-bold tracking-tight">StockFlow</span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Start managing your<br />inventory today.
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Set up your account in seconds. No credit card required.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: '1', title: 'Create your account', desc: 'Sign up with your email' },
              { step: '2', title: 'Add your products',   desc: 'Import or add manually' },
              { step: '3', title: 'Track stock levels',  desc: 'Get low-stock alerts' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-blue-300 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300 text-xs">
          © {new Date().getFullYear()} StockFlow. All rights reserved.
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-10 sm:px-8 lg:px-16 bg-slate-50 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-lg">
            📦
          </div>
          <span className="text-xl font-bold text-gray-900">StockFlow</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
              Get started — it only takes a minute
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <span className="text-red-500 mt-0.5 shrink-0">⚠</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Organization name */}
            <div>
              <label htmlFor="organizationName" className="label">
                Organization name
              </label>
              <input
                id="organizationName"
                name="organizationName"
                type="text"
                className={`input ${fieldErrors.organizationName ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Acme Store"
                value={form.organizationName}
                onChange={handleChange}
                autoFocus
                autoComplete="organization"
              />
              {fieldErrors.organizationName && (
                <p className="error-text">{fieldErrors.organizationName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`input ${fieldErrors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="error-text">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className={`input pr-10 ${fieldErrors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength:{' '}
                    <span className={`font-medium ${
                      strength <= 1 ? 'text-red-500' :
                      strength === 2 ? 'text-yellow-600' :
                      strength === 3 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {strengthLabel}
                    </span>
                  </p>
                </div>
              )}
              {fieldErrors.password && (
                <p className="error-text">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className={`input pr-10 ${fieldErrors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? '🙈' : '👁'}
                </button>
              </div>
              {/* Match indicator */}
              {form.confirmPassword && (
                <p className={`text-xs mt-1.5 ${
                  form.password === form.confirmPassword ? 'text-green-600' : 'text-red-500'
                }`}>
                  {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
              {fieldErrors.confirmPassword && !form.confirmPassword && (
                <p className="error-text">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full py-3 text-base mt-2"
              disabled={loading}
            >
              {loading && <Spinner className="h-4 w-4" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs text-gray-400">
                Already have an account?
              </span>
            </div>
          </div>

          <Link to="/login" className="btn-secondary w-full py-3 text-base">
            Sign in instead
          </Link>

          {/* Terms note */}
          <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
            By creating an account you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span>{' '}
            and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
