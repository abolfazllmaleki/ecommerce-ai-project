const Recommendations = () => {
    const products = [
      { id: 1, name: "Running Shoes", price: "₦32,000", image: "/shoes.png" },
      { id: 2, name: "Smart Watch", price: "₦65,000", image: "/watch.png" },
      { id: 3, name: "Sunglasses", price: "₦15,000", image: "/sunglasses.png" },
      { id: 4, name: "Backpack", price: "₦28,000", image: "/backpack.png" },
    ];
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Recommended for You</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-md p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="font-medium text-sm">{product.name}</h3>
              <p className="text-[#DF2648] font-semibold mt-1">{product.price}</p>
              <button className="w-full mt-4 px-4 py-2 bg-[#DF2648] text-white rounded-md hover:bg-[#DF2648]/90 text-sm">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Recommendations;