import React from 'react';
import './RelatedItems.css';

const RelatedItems = () => {
  const relatedItems = [
    { id: 1, name: 'Gamepad Red', discount: '-40%', image: 'related1.jpg' },
    { id: 2, name: 'Keyboard RGB', discount: '-35%', image: 'related2.jpg' },
    { id: 3, name: 'Cooling Fans', discount: '-30%', image: 'related3.jpg' },
  ];

  return (
    <div className="related-items">
      <h2>Related Items</h2>
      <div className="items">
        {relatedItems.map((item) => (
          <div key={item.id} className="item">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <span>{item.discount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedItems;
