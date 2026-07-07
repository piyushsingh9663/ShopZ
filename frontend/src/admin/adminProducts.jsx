import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you strictly sure you want to delete this?')) {return;}
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'delete',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to delete product');
      }
      setProducts(products.filter(p => p._id !== id));

      alert('Product deleted successfully');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to delete product');
    }
  }

  

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#f97316', background: 'none', WebkitTextFillColor: '#f97316' }}>Manage Products</h2>
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        <Link to="/admin/add-product" className="btn">+ Add Product</Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>PRICE</th>
              <th style={thStyle}>CATEGORY</th>
              <th style={thStyle}>STOCK</th>
              <th style={thStyle}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#a1a1aa' }}>Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#a1a1aa' }}>No products found.</td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product._id} style={rowStyle}>
                  <td style={tdStyle}>{product._id.substring(0, 8)}...</td>
                  <td style={tdStyle}>{product.name}</td>
                  <td style={tdStyle}>₹{(product.price * 50).toFixed(2)}</td>
                  <td style={tdStyle}>{product.category}</td>
                  <td style={tdStyle}>{product.stock}</td>
                  <td style={tdStyle}>
                    <Link to={`/admin/edit-product/${product._id}`} style={editBtn}>Edit</Link>
                    <button onClick={() => handleDelete(product._id)} style={deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.1)' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#a1a1aa', fontSize: '0.9rem' };
const tdStyle = { padding: '15px', textAlign: 'left' };
const searchInputStyle = { width: '100%', maxWidth: '320px', padding: '10px 12px', marginTop: '8px', borderRadius: '8px', border: '1px solid #27272a', background: '#09090b', color: '#fafafa', outline: 'none' };
const editBtn = { background: '#3b82f6', color: '#fff', padding: '6px 12px', borderRadius: '4px', marginRight: '10px' };
const deleteBtn = { background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' };

export default AdminProducts;