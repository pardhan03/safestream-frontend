import React, { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ video, onClose }) => {
  const [quality, setQuality] = useState("original");
  const videoRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      const token = localStorage.getItem("token");
      // Build query params - include token for auth since video elements can't send headers
      const params = new URLSearchParams();
      if (quality !== "original") params.append("q", quality);
      if (token) params.append("token", token);
      const queryString = params.toString() ? `?${params.toString()}` : "";
      videoRef.current.src = `${API_BASE}/api/video/stream/${video._id}${queryString}`;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [quality, video]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = ''; // Clear src to stop loading
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-4xl bg-slate-900 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h3 className="text-white font-semibold">{video.originalName}</h3>
          <div className="flex items-center gap-3">
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="bg-slate-800 text-white p-2 rounded text-sm"
            >
              <option value="original">Original</option>
              <option value="p1080">1080p</option>
              <option value="p720">720p</option>
              <option value="p360">360p</option>
            </select>
            <button
              onClick={handleClose}
              className="text-slate-300 hover:text-white px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="bg-black aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            controls
            className="w-full h-full max-h-[70vh]"
            style={{ backgroundColor: "black" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="p-4 text-slate-300 text-sm">
          <div className="flex justify-between">
            <span>Status: {video.status}</span>
            <span>Sensitivity: {video.sensitivity}</span>
            <span>Quality: {quality}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;