import React, { useEffect, useState } from 'react';
import { Upload, Play, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import UploadModal from './UploadModal';
import { uploadVideo, getMyVideos, deleteVideo } from '../../api/axios';
import { useAuth } from '../../context/AuthProvider';
import { connectSocket } from '../../utils/socket';
import VideoPlayer from './VideoPlayer';

const StatusBadge = ({ status, sensitivity, progress }) => {
    if (status === 'processing') {
        return (
            <div className="flex items-center text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded-full w-fit">
                <Loader2 size={12} className="animate-spin mr-1" />
                Processing {progress || 0}%
            </div>
        );
    }

    if (status === 'completed' && sensitivity === 'flagged') {
        return (
            <div className="flex items-center text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded-full w-fit">
                <AlertTriangle size={12} className="mr-1" />
                Flagged
            </div>
        );
    }

    if (status === 'completed' && sensitivity === 'safe') {
        return (
            <div className="flex items-center text-green-500 text-xs bg-green-500/10 px-2 py-1 rounded-full w-fit">
                <CheckCircle size={12} className="mr-1" />
                Safe
            </div>
        );
    }

    // Default case for other statuses
    return (
        <div className="flex items-center text-slate-400 text-xs bg-slate-500/10 px-2 py-1 rounded-full w-fit">
            {status}
        </div>
    );
};

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [playingVideo, setPlayingVideo] = useState(null);
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

    // Fallback polling: if Socket.IO is down (e.g., Render hibernation),
    // progress still updates in DB, so we poll while any videos are processing.
    useEffect(() => {
        const hasInFlight = videos?.some(
            (v) => (v?.status === "processing" || v?.status === "uploaded") && (v?.progress ?? 0) < 100
        );

        if (!hasInFlight) return;

        const id = setInterval(() => {
            fetchVideos();
        }, 2000);

        return () => clearInterval(id);
    }, [videos]);

    useEffect(() => {
    if (!authUser) return;

    const s = connectSocket(authUser._id);

    s.on("video:progress", ({ videoId, progress, status }) => {
        setVideos(prev =>
            prev.map(v => String(v._id) === String(videoId) ? { 
                ...v, 
                progress, 
                status: status || "processing" // Ensure status is updated
            } : v)
        );
    });

    s.on("video:completed", ({ videoId, status, sensitivity }) => {
        console.log("Video completed:", { videoId, status, sensitivity }); // Debug log
        setVideos(prev =>
            prev.map(v => String(v._id) === String(videoId) ?
                { 
                    ...v, 
                    status: status || "completed", 
                    sensitivity: sensitivity || "safe",
                    progress: 100 
                } : v
            )
        );
    });

    // Add error handling
    s.on("video:uploaded", ({ videoId }) => {
        setVideos(prev =>
            prev.map(v => String(v._id) === String(videoId) ? 
                { ...v, status: "uploaded" } : v
            )
        );
    });

    return () => {
        s.off("video:progress");
        s.off("video:completed");
        s.off("video:uploaded");
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
                                {authUser?.role === "Admin" && (
                                    <th className="px-6 py-4 text-right">Actions</th>
                                )}

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
                                                <button onClick={() => setPlayingVideo(video)} className="text-slate-400 hover:text-white p-1">
                                                    <Play size={16} />
                                                </button>
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
                                        {authUser?.role === "Admin" && (
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={async () => {
                                                        await deleteVideo(video._id);
                                                        fetchVideos();
                                                    }}
                                                    className="text-red-400 hover:text-red-600 p-1"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        )}
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
            {playingVideo && (
                <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />
            )}
        </>
    );
};

export default Dashboard;
