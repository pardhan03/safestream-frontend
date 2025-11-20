import React, { useRef, useState } from 'react';
import { X, UploadCloud, FileVideo } from 'lucide-react';

const UploadModal = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const filePicker = useRef(null);

  const handleSelectFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("video", file);
    onUpload(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Upload New Video</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!file ? (
            <div
              className="border-2 border-dashed border-slate-600 rounded-xl p-10 text-center"
            >
              <UploadCloud className="mx-auto text-blue-500 mb-4" size={48} />
              <p className="text-lg font-medium text-white mb-2">Select files to upload</p>
              <p className="text-slate-400 text-sm mb-6">MP4, WEBM, or OGG (Max 2GB)</p>

              <button
                onClick={() => filePicker.current.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Select Files
              </button>

              <input
                type="file"
                ref={filePicker}
                className="hidden"
                accept="video/*"
                onChange={handleSelectFile}
              />
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/20 p-3 rounded-lg text-blue-500">
                  <FileVideo size={24} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{file.name}</p>
                  <p className="text-slate-500 text-xs">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-300 text-xs">
                Remove
              </button>
            </div>
          )}
        </div>
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">
            Cancel
          </button>

          <button
            disabled={!file}
            onClick={handleUpload}
            className={`px-6 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
              !file ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Start Processing
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
