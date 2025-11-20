import React from "react";

const VideoPlayer = ({ videoId }) => {
  const streamUrl = `http://localhost:5000/api/video/stream/${videoId}`;
  return (
    <div className="rounded-xl overflow-hidden bg-slate-900">
      <video
        controls
        width="100%"
        src={streamUrl}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
