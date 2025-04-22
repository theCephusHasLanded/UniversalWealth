import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

const ErrorPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 p-4">
      <div className="bg-navy-800 border border-navy-700 p-8 rounded-sm max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="rounded-full bg-red-900/30 p-3">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
        </div>
        
        <h1 className="text-xl font-medium text-center mb-2">Page Not Found</h1>
        <p className="text-neutral-400 text-center mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 bg-navy-700 hover:bg-navy-600 transition-colors rounded-sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;