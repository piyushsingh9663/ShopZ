import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/product.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/products/${product._id}`)} className="product-card">
        <img src={product.imageurl} alt={product.name} className="product-image" />
        <div className='product-info'>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">₹{(product.price*50).toFixed(0)}</p>           
        </div>
    </div>
  );
};

export default ProductCard;