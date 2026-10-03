import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { loginWithGoogleAPI, loginWithEmailAPI, registerUserAPI } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Simulate authentic Google OAuth profile
      const user = await loginWithGoogleAPI({
        email: "alex.green@gmail.com",
        name: "Alex Green",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      });
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMessage("Could not sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isRegisterMode) {
        if (!email || !name) {
          setErrorMessage("Please enter both your name and email.");
          setIsLoading(false);
          return;
        }
        const user = await registerUserAPI({ name, email, password });
        onLoginSuccess(user);
      } else {
        if (!email) {
          setErrorMessage("Please enter your email.");
          setIsLoading(false);
          return;
        }
        const user = await loginWithEmailAPI({ email, password });
        onLoginSuccess(user);
      }
      onClose();
    } catch (err) {
      setErrorMessage("Authentication failed. Please verify your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-deep/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-background-surface w-full max-w-md rounded-xl shadow-modal border border-charcoal-border overflow-hidden">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-charcoal-borderLight flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-accent text-white flex items-center justify-center font-mono font-bold text-xs">
              RE:
            </div>
            <div>
              <h3 className="font-bold text-lg text-charcoal tracking-tight">
                {isRegisterMode ? "Create Your Account" : "Sign In to RE:BOX"}
              </h3>
              <p className="text-xs text-charcoal-muted">
                {isRegisterMode ? "Join the creative reuse movement" : "Welcome back to your upcycling studio"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-charcoal-muted hover:text-charcoal hover:bg-background-warm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              {errorMessage}
            </div>
          )}

          {/* PRIMARY GOOGLE SIGN-IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 border border-charcoal-border rounded-lg text-xs font-semibold text-charcoal shadow-subtle flex items-center justify-center gap-3 transition-colors active:scale-[0.99]"
          >
            {/* Authentic Google "G" SVG Icon */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google Account</span>
          </button>

          {/* Quick Demo badge */}
          <div className="text-center">
            <span className="text-[11px] text-accent font-medium bg-accent-light px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Instant Google Login with 1-click test profile</span>
            </span>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-charcoal-borderLight w-full"></div>
            <span className="bg-background-surface px-3 text-[11px] font-mono text-charcoal-subtle uppercase">
              Or with email
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegisterMode && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal block">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-charcoal-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Alex Green"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-charcoal-border bg-background-warm/40 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal block">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-charcoal-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.green@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-charcoal-border bg-background-warm/40 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal block">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-charcoal-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-charcoal-border bg-background-warm/40 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-charcoal hover:bg-charcoal-deep text-white text-xs font-semibold rounded-md shadow-subtle flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{isRegisterMode ? "Create Free Account" : "Sign In"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Toggle Register / Sign In */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMessage('');
              }}
              className="text-xs text-charcoal-muted hover:text-charcoal transition-colors"
            >
              {isRegisterMode ? (
                <>Already have an account? <span className="text-accent font-semibold underline">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="text-accent font-semibold underline">Create one</span></>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
