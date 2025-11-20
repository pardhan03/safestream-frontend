import React, { useState } from "react";
import { changePassword } from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";

const Setting = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { authUser } = useAuth();

    const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        toast("Passwords do not match.");
        return;
    }

    try {
        setLoading(true);
        const response = await changePassword(newPassword);
        toast(response.data.message);
        setNewPassword("");
        setConfirmPassword("");
    } catch (error) {
        toast(error.response?.data?.message || "Error changing password.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">User Settings</h2>
            <section className="mb-8 p-4 border rounded-lg bg-indigo-50">
                <h3 className="text-xl font-semibold text-indigo-800 mb-3">Profile Information</h3>
                <div className="space-y-2 text-gray-700">
                    <p><strong>Username:</strong> {authUser?.fullname}</p>
                    <p><strong>Role:</strong> <span className={`font-semibold ${
                        authUser?.role === 'admin' ? 'text-red-600' : authUser?.role === 'editor' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{authUser?.role.toUpperCase()}</span></p>
                    <p>
                    </p>
                </div>
            </section>

            <section className="p-4 border rounded-lg bg-white">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
                        disabled={!newPassword || newPassword !== confirmPassword || loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Setting