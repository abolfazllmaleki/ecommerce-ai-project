import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin text-red-500">
        <FaSpinner className="w-12 h-12" />
      </div>
      <p className="mt-4 text-lg text-gray-600 font-semibold">Loading Product...</p>
    </div>
  );
};

export default LoadingSpinner;