import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-200 p-4 text-center">
      <div className="bg-slate-800 p-4 rounded-full mb-6 animate-bounce">
        <AlertCircle size={64} className="text-red-500" />
      </div>
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;