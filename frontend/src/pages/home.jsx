import React from 'react';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                const data = await res.json();
                setProducts(data.slice(0, 10));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    },[]);
    return (
        <div className="home-container">
            <div className='home-banner'>
                <h1>Welcome to ShopZ</h1>
                <p>Your Swift Online Marketplace</p>
            </div>
            <h2 className='ml-6'>Featured Products</h2>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    
                    <div onClick={() => navigate('/shop')} className='group bg-[#18181b] rounded-xl p-6 flex flex-col
                    justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300'>
                        <div className='text-4xl mb-4 group-hover:translate-x-2 transition-transform'>
                            →
                        </div>
                        <h3 className='text-xl font-bold'>
                            View All Products
                        </h3>

                        <p className='text-[#fa7e25] mt-2 text-center'>
                            Explore our complete collection
                        </p>
                    </div>

                </div>
          )}
        </div>

    );
};

export default Home;