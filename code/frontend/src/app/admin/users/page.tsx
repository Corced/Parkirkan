'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { userService } from "@/lib/api";
import { Edit, Trash2, Plus, Eye, Search, ChevronDown, User as UserIcon, X, Check, Save, FileText } from "lucide-react";
import { User, Role } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [confirmUsername, setConfirmUsername] = useState('');

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('semua');
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        role: 'petugas' as Role,
        password: '',
        is_active: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAll();
            if (Array.isArray(data)) setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            username: '',
            email: '',
            role: 'petugas',
            password: '',
            is_active: true
        });
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name || '',
            username: user.username,
            email: user.email,
            role: user.role,
            password: '', // Don't show password
            is_active: !!user.is_active
        });
        setIsEditing(true);
    };

    const handleAddClick = () => {
        resetForm();
        setIsAdding(true);
        setSelectedUser(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && selectedUser) {
                const updated = await userService.update(selectedUser.id, formData);
                setUsers(users.map(u => u.id === selectedUser.id ? updated : u));
                setSelectedUser(updated);
                setIsEditing(false);
            } else if (isAdding) {
                const created = await userService.create(formData);
                setUsers([...users, created]);
                setIsAdding(false);
            }
            resetForm();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Error tidak diketahui';
            alert('Gagal menyimpan: ' + msg);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.delete(userToDelete.id);
            setUsers(users.filter(user => user.id !== userToDelete.id));
            setUserToDelete(null);
            setSelectedUser(null);
            setConfirmUsername('');
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus user');
        }
    };

    // Filtered Users Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesRole = roleFilter === 'semua' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-10 relative">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-black tracking-tight">Kelola User</h1>
                    <p className="text-slate-800 font-bold text-xs tracking-widest">Manajemen pengguna sistem</p>
                </div>
                {!isAdding && !isEditing && (
                    <Button onClick={handleAddClick} className="bg-[#2563EB] hover:bg-blue-700 h-14 px-8 rounded-2xl gap-3 text-lg font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                        <Plus className="h-6 w-6" />
                        Tambah User
                    </Button>
                )}
            </div>

            {/* Filter Section - Hidden in Form/Detail Mode */}
            {!selectedUser && !isAdding && (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 z-20 relative">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-700" />
                            <Input
                                placeholder="Cari User...."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-16 pl-16 rounded-2xl border-2 border-slate-100 bg-[#F9FAFB] font-bold text-lg focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                        <div className="relative min-w-[240px]">
                            <button
                                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                                className="w-full h-16 rounded-2xl border-2 border-slate-100 bg-white px-8 flex items-center justify-between font-bold text-lg text-slate-600 hover:border-blue-400 transition-all active:scale-95"
                            >
                                {roleFilter === 'semua' ? 'Semua Role' : (roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1))}
                                <ChevronDown className={cn("h-6 w-6 transition-transform", showRoleDropdown ? "rotate-180" : "")} />
                            </button>

                            {showRoleDropdown && (
                                <div className="absolute top-20 left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 animate-in slide-in-from-top-2 duration-200">
                                    {['semua', 'admin', 'petugas', 'owner'].map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => { setRoleFilter(role); setShowRoleDropdown(false); }}
                                            className={cn(
                                                "w-full text-left px-6 py-4 rounded-xl font-bold text-lg transition-colors",
                                                roleFilter === role ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            {role === 'semua' ? 'Semua Role' : (role.charAt(0).toUpperCase() + role.slice(1))}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 min-h-[500px]">
                {/* Table View */}
                {!selectedUser && !isAdding && (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-50">
                                    <TableHead className="text-base font-black text-black tracking-widest px-8 pb-8">Username</TableHead>
                                    <TableHead className="text-base font-black text-black tracking-widest pb-8">Email</TableHead>
                                    <TableHead className="text-base font-black text-black tracking-widest pb-8">Role</TableHead>
                                    <TableHead className="text-base font-black text-black tracking-widest pb-8">Status</TableHead>
                                    <TableHead className="text-base font-black text-black tracking-widest text-right pb-8 pr-8">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="group border-none hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full border-2 border-slate-900 flex items-center justify-center bg-white shadow-sm overflow-hidden">
                                                    <UserIcon className="h-6 w-6 text-slate-800" />
                                                </div>
                                                <span className="text-xl font-black text-black tracking-tight">{user.username}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <span className="text-lg font-bold text-slate-800 tracking-tight">{user.email}</span>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className={cn(
                                                "inline-flex px-6 py-2 rounded-xl text-lg font-black tracking-tighter",
                                                user.role === 'admin' ? "bg-pink-300 text-pink-900" :
                                                    user.role === 'petugas' ? "bg-yellow-300 text-yellow-900" :
                                                        "bg-cyan-300 text-cyan-900"
                                            )}>
                                                {user.role}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className={cn(
                                                "inline-flex items-center px-6 py-2 rounded-xl text-lg font-black tracking-tighter",
                                                user.is_active ? "bg-green-400 text-green-950" : "bg-red-400 text-red-950"
                                            )}>
                                                {user.is_active ? 'Aktif' : 'Nonaktif'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6 text-right pr-8">
                                            <div className="flex justify-end gap-6" onClick={(e) => e.stopPropagation()}>
                                                <button className="h-10 w-10 flex items-center justify-center text-blue-400 hover:text-blue-600 transition-colors" onClick={() => setSelectedUser(user)}>
                                                    <Eye className="h-6 w-6" />
                                                </button>
                                                <button className="h-10 w-10 flex items-center justify-center text-orange-400 hover:text-orange-600 transition-colors" onClick={() => handleEditClick(user)}>
                                                    <Edit className="h-6 w-6" />
                                                </button>
                                                <button className="h-10 w-10 flex items-center justify-center text-red-300 hover:text-red-500 transition-colors" onClick={() => setUserToDelete(user)}>
                                                    <Trash2 className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-48 text-2xl font-black text-slate-300">
                                            Tidak ada user yang cocok.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination Footer (Placeholder like image) */}
                        <div className="flex justify-end gap-6 pt-10 text-slate-700 items-center">
                            <button className="h-10 w-10 flex items-center justify-center cursor-pointer hover:text-black transition-colors">
                                <ChevronDown className="rotate-90 h-8 w-8" />
                            </button>
                            <div className="h-12 w-12 rounded-2xl border-2 border-slate-900 flex items-center justify-center text-black bg-white shadow-sm">
                                <FileText className="h-6 w-6" />
                            </div>
                            <button className="h-10 w-10 flex items-center justify-center cursor-pointer hover:text-black transition-colors">
                                <ChevronDown className="-rotate-90 h-8 w-8" />
                            </button>
                        </div>
                    </>
                )}

                {/* Detail View / Edit View / Add View */}
                {(selectedUser || isAdding) && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center px-2">
                            <button
                                onClick={() => { setSelectedUser(null); setIsEditing(false); setIsAdding(false); resetForm(); }}
                                className="bg-slate-100 hover:bg-slate-200 p-3 rounded-2xl transition-all active:scale-95"
                            >
                                <X className="h-8 w-8 text-slate-800" />
                            </button>
                            {(isEditing || isAdding) && (
                                <h2 className="text-3xl font-black text-black">
                                    {isAdding ? 'Tambah User Baru' : 'Edit Profil User'}
                                </h2>
                            )}
                            {selectedUser && !isEditing && (
                                <div className="flex gap-4">
                                    <button className="p-3 bg-orange-50 text-orange-500 rounded-2xl hover:bg-orange-100 transition-all font-black flex items-center gap-2" onClick={() => handleEditClick(selectedUser)}>
                                        <Edit className="h-8 w-8" />
                                    </button>
                                    <button className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all font-black flex items-center gap-2" onClick={() => setUserToDelete(selectedUser)}>
                                        <Trash2 className="h-8 w-8" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="max-w-4xl space-y-6">
                            {[
                                { label: 'Username', key: 'username', type: 'text', placeholder: 'petugas01' },
                                { label: 'Name', key: 'name', type: 'text', placeholder: 'Budi Santoso' },
                                { label: 'Email', key: 'email', type: 'email', placeholder: 'petugas@parkirkan.id' },
                                { label: 'Role', key: 'role', type: 'select', options: ['admin', 'petugas', 'owner'] },
                                { label: 'Password', key: 'password', type: 'password', placeholder: isEditing ? 'Kosongkan jika tidak diubah' : '********' },
                            ].map((field, idx) => (
                                <div key={idx} className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 group">
                                    <label className="lg:w-64 text-2xl font-bold text-black tracking-tight">{field.label}</label>
                                    <span className="hidden lg:block text-2xl font-bold text-black">:</span>
                                    <div className="flex-1">
                                        {isEditing || isAdding ? (
                                            field.type === 'select' ? (
                                                <select
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                                    className="w-full h-20 rounded-[1.5rem] border-4 border-slate-100 bg-slate-50 px-10 text-2xl font-black text-black focus:border-blue-400 focus:bg-white transition-all appearance-none tracking-tight"
                                                >
                                                    {field.options?.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                                                </select>
                                            ) : (
                                                <Input
                                                    type={field.type}
                                                    value={String(formData[field.key as keyof typeof formData] || '')}
                                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="h-20 rounded-[1.5rem] border-4 border-slate-100 bg-slate-50 px-10 text-2xl font-black text-black focus:border-blue-400 focus:bg-white transition-all shadow-inner tracking-tight"
                                                    required={isAdding && field.key !== 'name'}
                                                />
                                            )
                                        ) : (
                                            <span className="text-2xl font-medium text-slate-800 tracking-tight">
                                                {selectedUser ? String(selectedUser[field.key as keyof User] || '-') : '-'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Constant Detail Fields from Image */}
                            {!isEditing && !isAdding && (
                                <>
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 group">
                                        <label className="lg:w-64 text-2xl font-bold text-black tracking-tight">Status</label>
                                        <span className="hidden lg:block text-2xl font-bold text-black">:</span>
                                        <div className="flex-1">
                                            <span className="text-2xl font-medium text-slate-800 tracking-tight">Aktif</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 group">
                                        <label className="lg:w-64 text-2xl font-bold text-black tracking-tight">Jadwal Shift</label>
                                        <span className="hidden lg:block text-2xl font-bold text-black">:</span>
                                        <div className="flex-1">
                                            <span className="text-2xl font-medium text-slate-800 tracking-tight">ID-001 : Shift Siang</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 group">
                                        <label className="lg:w-64 text-2xl font-bold text-black tracking-tight">Jam Masuk</label>
                                        <span className="hidden lg:block text-2xl font-bold text-black">:</span>
                                        <div className="flex-1">
                                            <span className="text-2xl font-medium text-slate-800 tracking-tight">12:00</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 group">
                                        <label className="lg:w-64 text-2xl font-bold text-black tracking-tight">Jam Keluar</label>
                                        <span className="hidden lg:block text-2xl font-bold text-black">:</span>
                                        <div className="flex-1">
                                            <span className="text-2xl font-medium text-slate-800 tracking-tight">18:00</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Status Switch if editing */}
                            {(isEditing || isAdding) && (
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 pt-4">
                                    <label className="lg:w-64 text-2xl font-bold text-black tracking-tight">Status</label>
                                    <span className="hidden lg:block text-2xl font-bold text-black">:</span>
                                    <div className="flex items-center gap-6">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                            className={cn(
                                                "relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none ring-offset-2 focus:ring-4",
                                                formData.is_active ? "bg-green-400 ring-green-100" : "bg-slate-200 ring-slate-100"
                                            )}
                                        >
                                            <span className={cn(
                                                "inline-block h-10 w-10 transform rounded-full bg-white transition-transform border-2",
                                                formData.is_active ? "translate-x-13 border-green-500" : "translate-x-1 border-slate-300 shadow-sm"
                                            )} />
                                        </button>
                                        <span className="text-xl font-black text-black">
                                            {formData.is_active ? 'Aktif' : 'Non-aktif'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            {(isEditing || isAdding) && (
                                <div className="flex gap-8 pt-12">
                                    <Button
                                        type="submit"
                                        className="flex-1 h-20 rounded-[2rem] bg-[#2563EB] hover:bg-blue-700 text-white text-3xl font-black shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                                    >
                                        <Save className="mr-4 h-10 w-10" /> Simpan
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setIsAdding(false); resetForm(); }}
                                        className="flex-1 h-20 rounded-[2rem] bg-slate-100 hover:bg-slate-200 text-slate-800 text-3xl font-black transition-all active:scale-95 border-2 border-slate-200"
                                    >
                                        Batal
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>

            {/* CUSTOM SECURE DELETE MODAL */}
            {userToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <div className="relative bg-white rounded-[4rem] w-full max-w-3xl p-20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] space-y-16 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-black leading-tight tracking-tighter">
                                Hapus Akun User?
                            </h3>
                            <p className="text-2xl font-bold text-slate-700 tracking-tight">
                                Apakah anda yakin untuk menghapus <span className="text-red-500">"{userToDelete.username}"</span>?
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p className="text-lg font-black text-slate-700 tracking-[0.2em]">Ketik username untuk konfirmasi</p>
                            <Input
                                value={confirmUsername}
                                onChange={(e) => setConfirmUsername(e.target.value)}
                                placeholder={userToDelete.username}
                                className="h-24 rounded-[2rem] border-4 border-slate-100 bg-slate-50 px-12 text-3xl font-black text-black focus:border-red-400 focus:bg-white transition-all text-center shadow-inner tracking-tight"
                            />
                        </div>

                        <div className="flex gap-10">
                            <Button
                                onClick={handleDelete}
                                disabled={confirmUsername !== userToDelete.username}
                                className={cn(
                                    "flex-1 h-24 rounded-[2rem] text-4xl font-black shadow-2xl transition-all active:scale-95",
                                    confirmUsername === userToDelete.username
                                        ? "bg-[#4ADE80] hover:bg-green-500 text-white shadow-green-500/40"
                                        : "bg-slate-100 text-slate-300 cursor-not-allowed border-4 border-slate-200"
                                )}
                            >
                                Iya
                            </Button>
                            <Button
                                onClick={() => { setUserToDelete(null); setConfirmUsername(''); }}
                                className="flex-1 h-24 rounded-[2rem] bg-[#EF4444] hover:bg-red-600 text-white text-4xl font-black shadow-2xl shadow-red-500/40 transition-all active:scale-95"
                            >
                                Tidak
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
