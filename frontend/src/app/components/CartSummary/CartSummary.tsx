export const CartSummary = ({ subtotal }: { subtotal: number }) => (
  <div className="space-y-3">
    <div className="flex justify-between">
      <span className="text-gray-600">Subtotal:</span>
      <span className="text-gray-800 font-semibold">${subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Shipping:</span>
      <span className="text-gray-800 font-semibold">Free</span>
    </div>
    <div className="flex justify-between border-t pt-3">
      <span className="text-gray-800 font-bold">Total:</span>
      <span className="text-gray-800 font-bold">${subtotal.toFixed(2)}</span>
    </div>
  </div>
);