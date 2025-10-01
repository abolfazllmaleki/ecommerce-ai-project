import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = () => {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-gray-500 text-lg">Loading ...</p>
      </div>
  );
};

export default LoadingSpinner;