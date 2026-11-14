'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { FileText } from 'lucide-react';

export const AmilSubmissions: React.FC = () => {
  const { applicants, updateApplicantStatus } = useApp();

  return (
    <div className="space-y-6 taste-enter">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Antrean Pengajuan Mustahik</h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Tinjauan proposal bantuan zakat produktif, kesiapan berkas, dan penetapan status intervensi.
        </p>
      </div>

      {/* Responsive Grid: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applicants.map(app => {
          const isApproved = app.status === 'Disetujui';
          const isAssisted = app.status === 'Didampingi';
          const isRejected = app.status === 'Ditolak';

          return (
            <div
              key={app.id}
              className="taste-card bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{app.name}</h3>
                    <p className="text-xs text-slate-500">{app.businessType} · {app.location}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isAssisted
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : isRejected
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>{app.documentsStatus}</span>
                  </div>
                  <p className="font-semibold text-slate-900">{app.plannedUsage}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-500">Skor potensi:</span>
                    <span className="font-mono font-extrabold text-slate-900">{app.potentialScore}%</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      app.potentialScore < 50
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : app.potentialScore < 75
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {app.potentialScore < 50 ? 'Rendah' : app.potentialScore < 75 ? 'Sedang' : 'Tinggi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Setujui, Dampingi dulu, Tolak */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => updateApplicantStatus(app.id, 'Disetujui')}
                  className={`taste-btn py-2 text-xs font-bold rounded-xl transition-all ${
                    isApproved
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                  }`}
                >
                  Setujui
                </button>

                <button
                  onClick={() => updateApplicantStatus(app.id, 'Didampingi')}
                  className={`taste-btn py-2 text-xs font-bold rounded-xl transition-all ${
                    isAssisted
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                  }`}
                >
                  Dampingi
                </button>

                <button
                  onClick={() => updateApplicantStatus(app.id, 'Ditolak')}
                  className={`taste-btn py-2 text-xs font-bold rounded-xl transition-all ${
                    isRejected
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-700 border border-slate-200'
                  }`}
                >
                  Tolak
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
