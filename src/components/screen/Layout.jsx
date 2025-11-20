import React from 'react';
import { LayoutDashboard, Upload, PlaySquare, Settings, LogOut } from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, active }) => (
    <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
        <Icon size={20} />
        <span className="font-medium">{text}</span>
    </div>
);

const Layout = ({ children }) => {

    const logout = async () => {
        await api.post("/user/logout");
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
                    <SidebarItem icon={LayoutDashboard} text="Dashboard" active />
                    <SidebarItem icon={PlaySquare} text="My Videos" />
                    <SidebarItem icon={Settings} text="Settings" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                            JD
                        </div>
                        <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-slate-500">Editor Role</p>
                        </div>
                    </div>
                    <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm" onClick={logout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;