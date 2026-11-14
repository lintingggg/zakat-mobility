'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { CircleDollarSign, ArrowRight, Loader2, User, Briefcase, HeartHandshake } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login } = useApp();
  const [step, setStep] = useState<'onboarding' | 'auth'>('onboarding');
  const [mode, setMode] = useState<'masuk' | 'daftar'>('masuk');
  const [selectedRole, setSelectedRole] = useState<UserRole>('mustahik');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [fullName, setFullName] = useState('Faizah Elysia');
  const [emailOrPhone, setEmailOrPhone] = useState('faizah@contoh.id');
  const [password, setPassword] = useState('••••••••••••');
  const [agreed, setAgreed] = useState(true);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'mustahik') {
      setFullName('Faizah Elysia');
      setEmailOrPhone('faizah@contoh.id');
    } else if (role === 'amil') {
      setFullName('Hilman Ramadhan');
      setEmailOrPhone('hilman@baznas.go.id');
    } else {
      setFullName('Bpk. Rahmat Santoso');
      setEmailOrPhone('rahmat@muzakki.id');
    }
  };

  const handleProceedLogin = (roleToLogin: UserRole, email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(roleToLogin, email);
      setIsLoading(false);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProceedLogin(selectedRole, emailOrPhone);
  };

  // STEP 1: Onboarding Screen (Direct & Punchy, No AI-Slop)
  if (step === 'onboarding') {
    return (
      <div className="max-w-md mx-auto my-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[520px] text-slate-900 taste-enter">
        <div className="pt-6 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-xs">
            <CircleDollarSign className="w-10 h-10 stroke-[2] text-emerald-400" />
          </div>

          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded border border-slate-200 mb-3">
            Sistem Penyaluran Zakat Produktif
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Zakat sebagai Titik Awal
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
            Bantuan modal alat dan pendampingan bertahap untuk usaha mikro. Dinilai berdasarkan skoring potensi, dipantau melalui 6 tahap hingga mandiri.
          </p>

          <div className="flex items-center gap-2 justify-center mt-8">
            <span className="w-6 h-1.5 rounded-full bg-slate-900" />
            <span className="w-2 h-1.5 rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="space-y-2.5 pt-8 w-full">
          <button
            onClick={() => setStep('auth')}
            className="taste-btn w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs"
          >
            Lanjut ke Pilihan Akun
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setStep('auth')}
            className="taste-btn w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold text-center"
          >
            Lewati
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Masuk / Buat Akun
  return (
    <div className="max-w-md mx-auto my-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between text-slate-900 taste-enter">
      <div>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {mode === 'masuk' ? 'Akses Akun' : 'Pendaftaran Binaan'}
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Pilih peran pengguna untuk masuk ke sistem.</p>
        </div>

        {/* Tab Masuk / Daftar */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('masuk')}
            className={`taste-btn py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'masuk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode('daftar')}
            className={`taste-btn py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'daftar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Masuk sebagai: Mustahik, Amil, Muzakki */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Peran Pengguna
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('mustahik')}
                className={`taste-btn py-2.5 px-2 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'mustahik'
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Mustahik</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('amil')}
                className={`taste-btn py-2.5 px-2 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'amil'
                    ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Amil</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('muzakki')}
                className={`taste-btn py-2.5 px-2 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'muzakki'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Muzakki</span>
              </button>
            </div>
          </div>

          {mode === 'daftar' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Nama sesuai KTP"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email atau nomor telepon
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={e => setEmailOrPhone(e.target.value)}
              placeholder="faizah@contoh.id"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kata sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-700"
              required
            />
          </div>

          {mode === 'daftar' && (
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-800 focus:ring-emerald-700"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                Saya menyetujui pemanfaatan data profil usaha oleh BAZNAS untuk keperluan penilaian dan verifikasi.
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="taste-btn w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses akses...</span>
              </>
            ) : mode === 'masuk' ? (
              'Masuk ke Sistem'
            ) : (
              'Daftar Akun Baru'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
