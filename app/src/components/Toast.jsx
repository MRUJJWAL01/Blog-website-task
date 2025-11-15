import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400';
  const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`fixed top-20 right-4 z-50 ${bgColor} border-l-4 p-4 rounded-lg shadow-lg max-w-md animate-slide-in`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${textColor} mt-0.5 mr-3`} />
        <p className={`${textColor} flex-1`}>{message}</p>
        <button onClick={onClose} className={`${textColor} hover:opacity-70 ml-3`}>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
