import React, { useState } from 'react';
import { LayoutDashboard, PlaySquare, Settings, LogOut, User } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthProvider';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, text, to }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-150 ${isActive
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{text}</span>
        </Link>
    );
};


const Layout = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const { authUser, setAuthUser } = useAuth();

    const logout = async () => {
        const res = await api.post("/user/logout");
        console.log('res', res)
        setAuthUser(null);
        localStorage.removeItem("user");
        window.location.href = "/login";
    };
    return (
        <div className="flex h-screen bg-slate-900 text-slate-200 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-500">StreamGuard</h1>
                    <p className="text-xs text-slate-500 mt-1">Enterprise Video Hub</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarItem icon={LayoutDashboard} text="Dashboard" to="/dashboard" />
                    <SidebarItem icon={PlaySquare} text="My Videos" to="/my-videos" />
                    <SidebarItem icon={Settings} text="Settings" to="/settings" />
                </nav>

                <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <User size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{authUser?.username || 'User'}</p>
                            <p className="text-xs text-slate-400">{authUser?.role || 'Basic'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-400 hover:bg-slate-700 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;