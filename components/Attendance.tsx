
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, ClipboardList, CheckCircle2, Camera, X, User } from 'lucide-react';
import { Employee } from '../types';

interface AttendanceProps {
  employees: Employee[];
}

const Attendance: React.FC<AttendanceProps> = ({ employees }) => {
  const [tab, setTab] = useState<'qr' | 'manual' | 'scan'>('qr');
  const [scanned, setScanned] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (tab === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [tab]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleAction = (msg: string) => {
    setScanned(true);
    setTimeout(() => setScanned(false), 3000);
  };

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="bg-[#005BAB] text-white p-6 pb-20">
        <h2 className="text-xl font-bold mb-1">Kehadiran</h2>
        <p className="text-blue-100 text-sm">Pilih metode absensi Anda</p>
      </div>

      <div className="-mt-12 px-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-1 flex">
          <button 
            onClick={() => setTab('qr')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${tab === 'qr' ? 'bg-[#005BAB] text-white' : 'text-gray-500'}`}
          >
            <QrCode className="w-4 h-4" /> QR Saya
          </button>
          <button 
            onClick={() => setTab('scan')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${tab === 'scan' ? 'bg-[#005BAB] text-white' : 'text-gray-500'}`}
          >
            <Camera className="w-4 h-4" /> Scan QR
          </button>
          <button 
            onClick={() => setTab('manual')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${tab === 'manual' ? 'bg-[#005BAB] text-white' : 'text-gray-500'}`}
          >
            <ClipboardList className="w-4 h-4" /> Manual
          </button>
        </div>

        {tab === 'qr' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <p className="font-bold text-gray-800 mb-2">ID Karyawan: EMP-001</p>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-3xl mb-6">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EMP-001-ADMIN" alt="QR" className="w-48 h-48" />
            </div>
            <div className="bg-blue-50 p-4 rounded-xl w-full flex items-center gap-4 border border-blue-100">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-blue-900">Admin Utama</p>
                <p className="text-[10px] text-blue-700">Terakhir Absen: 08:00 WIB</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'scan' && (
          <div className="bg-black rounded-2xl overflow-hidden shadow-sm relative aspect-square flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-white/50 rounded-lg relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              </div>
            </div>
            <button 
              onClick={() => handleAction("Scanned")}
              className="absolute bottom-6 bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold text-sm border border-white/30"
            >
              Simulasikan Scan
            </button>
          </div>
        )}

        {tab === 'manual' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 animate-in slide-in-from-bottom duration-300">
            <h3 className="font-bold text-gray-800">Input Manual</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Pilih Karyawan</label>
                <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500">
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-bold active:bg-green-100">Masuk</button>
                <button className="py-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold active:bg-red-100">Pulang</button>
              </div>
              <button 
                onClick={() => handleAction("Manual")}
                className="w-full bg-[#005BAB] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Simpan Kehadiran
              </button>
            </div>
          </div>
        )}

        {scanned && (
          <div className="fixed top-10 left-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold text-sm text-white">Berhasil!</p>
              <p className="text-[10px] opacity-90">Data kehadiran telah disimpan ke sistem.</p>
            </div>
            <button onClick={() => setScanned(false)} className="ml-auto opacity-70"><X className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
