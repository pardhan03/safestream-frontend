import React, { useEffect, useState } from 'react';
import { Upload, Play, AlertTriangle, CheckCircle, Loader2, MoreVertical } from 'lucide-react';
import UploadModal from './UploadModal';
import { uploadVideo, getMyVideos } from '../../api/axios';
import { useAuth } from '../../context/AuthProvider';
import { connectSocket, getSocket } from '../../utils/socket';

const StatusBadge = ({ status, sensitivity, progress }) => {
    if (status === 'processing') {
        return (
            <div className="flex items-center text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded-full w-fit">
                <Loader2 size={12} className="animate-spin mr-1" />
                Processing {progress || 0}%
            </div>
        );
    }

    if (sensitivity === 'flagged') {
        return (
            <div className="flex items-center text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded-full w-fit">
                <AlertTriangle size={12} className="mr-1" />
                Flagged
            </div>
        );
    }

    return (
        <div className="flex items-center text-green-500 text-xs bg-green-500/10 px-2 py-1 rounded-full w-fit">
            <CheckCircle size={12} className="mr-1" />
            Safe
        </div>
    );
};

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const { authUser } = useAuth();

    const fetchVideos = async () => {
        try {
            const res = await getMyVideos();
            setVideos(res.data.videos);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpload = async (formData) => {
        try {
            const res = await uploadVideo(formData);
            fetchVideos();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        if (authUser) {
            connectSocket(authUser._id);
            const s = getSocket();
            s.on("video:progress", ({ videoId, progress }) => {
                setVideos(prev => prev.map(v => v._id === videoId ? { ...v, progress, status: 'processing' } : v));
            });
            s.on("video:completed", ({ videoId, status, sensitivity }) => {
                setVideos(prev => prev.map(v => v._id === videoId ? { ...v, status: status === 'completed' ? 'completed' : 'failed', sensitivity, progress: 100 } : v));
            });
            s.on("video:uploaded", ({ videoId }) => {
                fetchVideos();
            });
        }
        return () => {
            const s = getSocket();
            if (s) {
                s.off("video:progress");
                s.off("video:completed");
                s.off("video:uploaded");
            }
        };
    }, [authUser]);

    return (
        <>
            <div className="space-y-6">
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
                            {videos?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-slate-400 py-6">
                                        No videos uploaded yet.
                                    </td>
                                </tr>
                            ) : (
                                videos.map((video) => (
                                    <tr key={video._id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center">
                                                    <Play size={16} className="text-slate-400" />
                                                </div>
                                                <span className="font-medium text-white">{video.originalName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(video.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {(video.size / (1024 * 1024)).toFixed(2)} MB
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge
                                                status={video.status}
                                                sensitivity={video.sensitivity}
                                                progress={video.progress}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-white p-1">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isUploadModalOpen && (
                <UploadModal
                    onClose={() => setUploadModalOpen(false)}
                    onUpload={handleUpload}
                />
            )}
        </>
    );
};

export default Dashboard;
