const DynamicColor = ({ colors, selectedColor, onColorChange }:any) => {
    return (
      <div className="my-4">
        <h3 className="font-semibold">Colours:</h3>
        <div className="flex space-x-2">
          {colors.map((color:any, index:any) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-black' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            ></button>
          ))}
        </div>
      </div>
    );
  };
  
  export default DynamicColor;