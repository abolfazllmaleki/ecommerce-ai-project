// components/CartItem.tsx
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }
  
  export const CartItemRow = ({ item, onQuantityChange }: { 
    item: CartItem, 
    onQuantityChange?: (id: string, quantity: number) => void 
  }) => (
    <tr className="border-b">
      <td className="py-4">{item.name}</td>
      <td className="py-4">${item.price}</td>
      <td className="py-4">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onQuantityChange?.(item.id, parseInt(e.target.value))}
          className="w-16 border rounded px-2 py-1"
          min="1"
        />
      </td>
      <td className="py-4">${item.price * item.quantity}</td>
    </tr>
  );