
import React, { useState } from 'react';
import { Users, Plus, Trash2, X, UserPlus, Briefcase, Banknote, Clock } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeManagementProps {
  employees: Employee[];
  onAdd: (emp: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, onAdd, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    name: '',
    position: '',
    dailyRate: 0,
    overtimeRate: 0
  });

  const handleAdd = () => {
    if (!newEmp.name || !newEmp.position) return;
    
    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmp.name || '',
      position: newEmp.position || '',
      dailyRate: Number(newEmp.dailyRate) || 0,
      overtimeRate: Number(newEmp.overtimeRate) || 0
    };

    onAdd(employee);
    setShowAddModal(false);
    setNewEmp({ name: '', position: '', dailyRate: 0, overtimeRate: 0 });
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-24">
      <div className="bg-[#005BAB] p-6 pb-20 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manajemen Karyawan</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#2AC3E2] p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            <UserPlus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-blue-100">Total: {employees.length} Karyawan Aktif</p>
      </div>

      <div className="-mt-12 px-4 space-y-4">
        {employees.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Belum ada karyawan</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-[#005BAB] font-bold text-sm"
            >
              Tambah Sekarang
            </button>
          </div>
        ) : (
          employees.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 border border-transparent hover:border-blue-100 transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold">
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{emp.position}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className="text-[10px] font-bold text-gray-400">Rp {emp.dailyRate.toLocaleString()}/Hari</p>
                <button 
                  onClick={() => onDelete(emp.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center animate-in slide-in-from-bottom duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Tambah Karyawan</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-500"><X /></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Lengkap</label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500">
                  <Plus className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Contoh: John Doe" 
                    className="bg-transparent w-full text-sm outline-none"
                    value={newEmp.name}
                    onChange={e => setNewEmp({...newEmp, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Jabatan / Posisi</label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Contoh: Manager" 
                    className="bg-transparent w-full text-sm outline-none"
                    value={newEmp.position}
                    onChange={e => setNewEmp({...newEmp, position: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Gaji / Hari</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500">
                    <Banknote className="w-5 h-5 text-gray-400" />
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="bg-transparent w-full text-sm outline-none"
                      value={newEmp.dailyRate}
                      // Fixed: Explicitly convert the string value from input to a number
                      onChange={e => setNewEmp({...newEmp, dailyRate: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Lembur / Jam</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="bg-transparent w-full text-sm outline-none"
                      value={newEmp.overtimeRate}
                      // Fixed: Explicitly convert the string value from input to a number
                      onChange={e => setNewEmp({...newEmp, overtimeRate: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAdd}
                className="w-full bg-[#005BAB] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 active:scale-95 transition-transform"
              >
                Simpan Karyawan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
