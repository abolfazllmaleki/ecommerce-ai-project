import { useState } from 'react';

const DynamicCounter = () => {
  const [count, setCount] = useState<number>(1);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count > 1 ? count - 1 : 1);

  return (
    <div className="flex items-center space-x-2">
      <button
        className="px-4 py-2 border-2 border-gray-300 rounded-md"
        onClick={decrement}
      >
        -
      </button>
      <span className="px-4 py-2 border-2 border-gray-300 rounded-md">
        {count}
      </span>
      <button
        className="px-4 py-2 border-2 border-gray-300 rounded-md bg-[#DF2648] text-white"
        onClick={increment}
      >
        +
      </button>
    </div>
  );
};

export default DynamicCounter;