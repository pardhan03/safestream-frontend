import React, { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ video, onClose }) => {
  const [quality, setQuality] = useState("original"); // options: original, p360, p720, p1080
  const videoRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      const qparam = quality === "original" ? "" : `?q=${quality}`;
      videoRef.current.src = `${API_BASE}/api/video/stream/${video._id}${qparam}`;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [quality, video]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-4xl bg-slate-900 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h3 className="text-white font-semibold">{video.originalName}</h3>
          <div className="flex items-center gap-3">
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="bg-slate-800 text-white p-2 rounded"
            >
              <option value="original">Original</option>
              <option value="p1080">1080p</option>
              <option value="p720">720p</option>
              <option value="p360">360p</option>
            </select>
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                onClose();
              }}
              className="text-slate-300 hover:text-white px-3 py-1"
            >
              Close
            </button>
          </div>
        </div>

        <div className="bg-black">
          <video
            ref={videoRef}
            controls
            style={{ width: "100%", height: "auto", backgroundColor: "black" }}
          />
        </div>

        <div className="p-4 text-slate-300">
          <div className="text-sm">Status: {video.status} · Sensitivity: {video.sensitivity}</div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
