"use client";

import React from "react";

interface Props {
  onLogin: (email: string, password: string) => void;
  error: string;
}

export default function AdminLogin({ onLogin, error }: Props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900 border border-amber-900/30 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-600 via-rose-700 to-amber-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-amber-950/50 mb-4">
            S
          </div>
          <h1 className="text-2xl font-serif font-bold text-amber-200 tracking-wide">
            Sanskriti Sarees
          </h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-mono">
            Secure Admin Gateway
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Admin Email / Username
            </label>
            <input
              type="text"
              required
              placeholder="admin@sanskriti.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-950/50 transition-all mt-2"
          >
            Unlock Admin Portal
          </button>
        </form>

        <p className="text-center text-[11px] text-neutral-500 mt-6">
          Default credentials:{" "}
          <code className="text-amber-400">admin@sanskriti.com</code> /{" "}
          <code className="text-amber-400">admin123</code>
        </p>
      </div>
    </div>
  );
}
