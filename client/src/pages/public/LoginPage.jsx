import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileText
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPendingVerification(false);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      const rolePath = (loggedUser.role === 'superadmin' || loggedUser.role === 'admin')
        ? '/admin/dashboard'
        : `/${loggedUser.role}/dashboard`;
      const redirectPath = location.state?.from?.pathname || rolePath;
      navigate(redirectPath, { replace: true });
    } catch (err) {
      if (err.response?.data?.pending_verification) {
        setPendingVerification(true);
        setPendingMessage(
          err.response?.data?.message || 
          'Your account is currently locked pending administrator payment verification. Both parent and student accounts will be unlocked once an administrator confirms your payment proof.'
        );
      } else {
        setError(err.response?.data?.message || err.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#050167] to-[#001f3f] flex items-center justify-center text-[#40ffa7] border border-[#40ffa7]/30 shadow-lg shadow-[#050167]/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#001f3f]">Beacon Bridge Academics</span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#050167] tracking-tight">
          Sign In to Your Portal
        </h2>
        <p className="mt-2 text-sm text-[#001f3f]/70">
          Or{' '}
          <Link to="/register" className="font-semibold text-[#050167] hover:text-[#001f3f] underline decoration-[#40ffa7] decoration-2 underline-offset-4">
            register for student & parent admission
          </Link>
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow-xl shadow-[#050167]/5 rounded-3xl border border-[#050167]/15">
        
        {/* Pending Verification Alert Banner */}
        {pendingVerification && (
          <div className="mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950">
            <div className="flex items-start space-x-3">
              <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-sm font-extrabold text-amber-900">
                  Account Pending Payment Verification
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {pendingMessage}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Link
                    to="/payment-proof"
                    className="text-xs font-bold text-amber-900 underline hover:text-amber-700 flex items-center gap-1"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>View Bank Details / Update Proof</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standard Error Alert */}
        {error && !pendingVerification && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#050167] mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beaconbridgeacademics.co.uk"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] bg-[#f0faff]/40"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#050167]">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact admissions@beaconbridgeacademics.co.uk or your school administrator to reset your credentials.'); }} className="text-xs text-[#050167] hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] bg-[#f0faff]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#050167]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm transition-all shadow-md shadow-[#40ffa7]/30 hover:shadow-lg hover:shadow-[#40ffa7]/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#001f3f]" />
              </>
            )}
          </button>
        </form>

        {/* Clean Institutional Help & Registration Links */}
        <div className="mt-8 pt-6 border-t border-[#050167]/10 text-center space-y-2 text-xs text-[#001f3f]/70">
          <p>
            Don't have an enrolled account?{' '}
            <Link to="/register" className="font-bold text-[#050167] hover:underline">
              Book a Consultation or Register
            </Link>
          </p>
          <p>
            Transferred tuition?{' '}
            <Link to="/payment-proof" className="font-semibold text-[#001f3f] hover:underline">
              Submit Bank Wire Proof of Payment
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
