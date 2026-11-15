'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { CircleDollarSign, ArrowRight, Loader2, User, Briefcase, HeartHandshake, Database } from 'lucide-react';
import { authenticateUser, registerNewUser } from '@/services/zakatService';

export const AuthView: React.FC = () => {
  const { login } = useApp();
  const [step, setStep] = useState<'onboarding' | 'auth'>('onboarding');
  const [mode, setMode] = useState<'masuk' | 'daftar'>('masuk');
  const [selectedRole, setSelectedRole] = useState<UserRole>('mustahik');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setAuthNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthNotice(null);

    try {
      if (mode === 'daftar') {
        if (!fullName.trim() || !emailOrPhone.trim() || !password.trim()) {
          setAuthNotice('Mohon lengkapi nama, email, dan kata sandi.');
          setIsLoading(false);
          return;
        }
        // Simpan pendaftaran ke Supabase
        await registerNewUser({
          id: emailOrPhone.trim().toLowerCase(),
          email: emailOrPhone.trim().toLowerCase(),
          name: fullName.trim(),
          password: password,
          role: selectedRole,
        });
        login(selectedRole, emailOrPhone.trim().toLowerCase(), fullName.trim());
      } else {
        if (!emailOrPhone.trim() || !password.trim()) {
          setAuthNotice('Mohon masukkan email dan kata sandi.');
          setIsLoading(false);
          return;
        }
        // Validasi login ke Supabase
        const dbUser = await authenticateUser(emailOrPhone, password, selectedRole);
        if (dbUser) {
          if (dbUser.password && dbUser.password !== password) {
            setAuthNotice('Kata sandi salah. Silakan periksa kembali.');
            setIsLoading(false);
            return;
          }
          login(dbUser.role, dbUser.email, dbUser.name);
        } else {
          setAuthNotice('Akun belum terdaftar di database Supabase. Silakan klik tab "Daftar" untuk membuat akun baru.');
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Auth error:', err);
      setAuthNotice('Terjadi kendala koneksi ke database. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 1: Onboarding Screen (Direct & Punchy per Guideline)
  if (step === 'onboarding') {
    return (
      <div className="max-w-md mx-auto my-8 bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[530px] text-[#111827] taste-enter">
        <div className="pt-6 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#1A4331] text-white flex items-center justify-center mb-6 shadow-sm">
            <CircleDollarSign className="w-10 h-10 stroke-[2] text-[#E8F3ED]" />
          </div>

          <span className="pill-verified mb-3">
            Sistem Penyaluran Zakat Produktif
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mb-3 tracking-tight">
            Zakat sebagai Titik Awal
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
            Bantuan modal alat dan pendampingan bertahap untuk usaha mikro. Dinilai berdasarkan skoring potensi, dipantau melalui 6 tahap hingga mandiri.
          </p>

          <div className="flex items-center gap-2 justify-center mt-8">
            <span className="w-6 h-1.5 rounded-full bg-[#1A4331]" />
            <span className="w-2 h-1.5 rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="space-y-2.5 pt-8 w-full">
          <button
            onClick={() => setStep('auth')}
            className="btn-primary w-full text-xs sm:text-sm"
          >
            <span>Lanjut ke Pilihan Akun</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setStep('auth')}
            className="taste-btn w-full py-2 text-[#6B7280] hover:text-[#111827] text-xs font-semibold text-center"
          >
            Lewati
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Masuk / Buat Akun
  return (
    <div className="max-w-md mx-auto my-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between text-[#111827] taste-enter">
      <div>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
            {mode === 'masuk' ? 'Akses Akun' : 'Pendaftaran Binaan'}
          </h2>
          <p className="text-[#6B7280] text-xs mt-0.5">Pilih peran pengguna untuk masuk ke sistem.</p>
        </div>

        {/* Tab Masuk / Daftar */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-full mb-4 border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('masuk'); setAuthNotice(null); }}
            className={`taste-btn py-1.5 text-xs font-bold rounded-full transition-all ${
              mode === 'masuk' ? 'bg-[#1A4331] text-white shadow-2xs' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => { setMode('daftar'); setAuthNotice(null); }}
            className={`taste-btn py-1.5 text-xs font-bold rounded-full transition-all ${
              mode === 'daftar' ? 'bg-[#1A4331] text-white shadow-2xs' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Daftar
          </button>
        </div>

        {authNotice && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
            <span className="font-semibold">{authNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Masuk sebagai: Mustahik, Amil, Muzakki */}
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Peran Pengguna
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('mustahik')}
                className={`taste-btn py-2.5 px-2 text-xs font-bold rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'mustahik'
                    ? 'bg-[#1A4331] text-white border-[#1A4331] shadow-xs'
                    : 'bg-white text-[#6B7280] border-slate-200 hover:border-slate-400'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Mustahik</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('amil')}
                className={`taste-btn py-2.5 px-2 text-xs font-bold rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'amil'
                    ? 'bg-[#1A4331] text-white border-[#1A4331] shadow-xs'
                    : 'bg-white text-[#6B7280] border-slate-200 hover:border-slate-400'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Amil</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('muzakki')}
                className={`taste-btn py-2.5 px-2 text-xs font-bold rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'muzakki'
                    ? 'bg-[#1A4331] text-white border-[#1A4331] shadow-xs'
                    : 'bg-white text-[#6B7280] border-slate-200 hover:border-slate-400'
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
              placeholder="contoh: nama@email.com"
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
              placeholder="Masukkan kata sandi"
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
            className="btn-primary w-full text-xs py-3.5 mt-2"
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
