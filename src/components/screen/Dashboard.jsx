import React, { useState } from 'react';
import { Upload, Play, AlertTriangle, CheckCircle, Loader2, MoreVertical } from 'lucide-react';
import UploadModal from './UploadModal';
import Layout from './Layout';

// Mock Data to simulate what the Backend will send
const initialVideos = [
    { id: 1, title: "Q3 Financial Report.mp4", size: "1.2 GB", date: "2023-10-24", status: "ready", sensitivity: "safe" },
    { id: 2, title: "Safety Training Demo.mp4", size: "450 MB", date: "2023-10-24", status: "processing", progress: 45, sensitivity: "pending" },
    { id: 3, title: "Raw Footage_001.mp4", size: "2.1 GB", date: "2023-10-23", status: "ready", sensitivity: "flagged" },
];

const StatusBadge = ({ status, sensitivity, progress }) => {
    if (status === 'processing') {
        return (
            <div className="flex items-center text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded-full w-fit">
                <Loader2 size={12} className="animate-spin mr-1" />
                Processing {progress}%
            </div>
        );
    }

    if (sensitivity === 'flagged') {
        return (
            <div className="flex items-center text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded-full w-fit">
                <AlertTriangle size={12} className="mr-1" />
                Flagged Content
            </div>
        );
    }

    return (
        <div className="flex items-center text-green-500 text-xs bg-green-500/10 px-2 py-1 rounded-full w-fit">
            <CheckCircle size={12} className="mr-1" />
            Safe & Ready
        </div>
    );
};

const Dashboard = () => {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Video Library</h2>
                        <p className="text-slate-400">Manage and monitor your uploaded content</p>
                    </div>
                    <button
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Upload size={18} />
                        <span>Upload Video</span>
                    </button>
                </div>

                {/* Stats Row (Optional but good for dashboard) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <h3 className="text-slate-400 text-sm">Storage Used</h3>
                        <p className="text-2xl font-bold text-white mt-1">45.2 GB <span className="text-xs text-slate-500 font-normal">/ 100 GB</span></p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <h3 className="text-slate-400 text-sm">Total Videos</h3>
                        <p className="text-2xl font-bold text-white mt-1">128</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <h3 className="text-slate-400 text-sm">Action Required</h3>
                        <p className="text-2xl font-bold text-red-400 mt-1">3 <span className="text-xs text-slate-500 font-normal">Flagged Videos</span></p>
                    </div>
                </div>

                {/* Video Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Video Name</th>
                                <th className="px-6 py-4">Upload Date</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {initialVideos.map((video) => (
                                <tr key={video.id} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center">
                                                <Play size={16} className="text-slate-400" />
                                            </div>
                                            <span className="font-medium text-white">{video.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{video.date}</td>
                                    <td className="px-6 py-4 text-slate-400">{video.size}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge {...video} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-white p-1">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Render Upload Modal here conditionally */}
                {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
            </div>
        </Layout>
    );
};

export default Dashboard;