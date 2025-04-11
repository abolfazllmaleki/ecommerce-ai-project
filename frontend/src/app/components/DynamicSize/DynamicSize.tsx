import { FC } from 'react';

interface DynamicSizeProps {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

const DynamicSize: FC<DynamicSizeProps> = ({ sizes, selectedSize, onSizeChange }) => {
  return (
    <div className="my-4">
      <h3 className="font-semibold">Size:</h3>
      <div className="flex space-x-2">
        {sizes.map((size, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-md ${
              selectedSize === size
                ? 'bg-[#DF2648] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => onSizeChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DynamicSize;