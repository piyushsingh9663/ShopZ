import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const getStatusMeta = (status) => {
  const normalized = typeof status === 'string' ? status.trim().toLowerCase() : 'pending';

  switch (normalized) {
    case 'delivered':
      return { label: 'Delivered', background: 'rgba(16,185,129,0.1)', color: '#10b981' };
    case 'shipped':
      return { label: 'Shipped', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
    case 'cancelled':
      return { label: 'Cancelled', background: 'rgba(239,68,68,0.1)', color: '#ef4444' };
    default:
      return { label: 'Pending', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
  }
};

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          // Token obsolete or 401: clear and bounce
          if (res.status === 401) {
             logout();
             navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, status: 'cancelled' } : order));
        alert(data.message || 'Order cancelled successfully');
      } else {
        alert(data.message || 'Unable to cancel order');
      }
    } catch (error) {
      console.error(error);
      alert('Unable to cancel order. Please try again later.');
    }
  };

  const deleteAccounthandler = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Account deleted successfully');
        logout();
        navigate('/login');
      } else {
        alert(data.message || 'Unable to delete account');
      }
    } catch (error) {
      console.error(error);
      alert('Unable to delete account. Please try again later.');
    }
  }

  const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
  const badgeStyle = { background: 'rgba(249,115,22,0.1)', color: '#f97316', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '30px', gap: '20px', flexWrap: 'wrap' };
  const deleteBtnStyle = { background: '#ef4444', boxShadow: 'none', width: '100%', maxWidth: '180px', alignSelf: 'flex-start' };

  if (!user) return null;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '10px' }}>My Profile</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '5px' }}><strong>Name:</strong> {user.name}</p>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '15px' }}><strong>Email:</strong> {user.email}</p>
          <span style={badgeStyle}>Account Type: {user.role.toUpperCase()}</span>
        </div>
        <button onClick={deleteAccounthandler} className="btn" style={deleteBtnStyle}>Delete Account</button>
      </div>

      <h3 style={{ color: '#f97316', marginBottom: '20px', fontSize: '1.5rem' }}>Order History</h3>
      {loading ? (
        <p style={{ color: '#a1a1aa' }}>Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ background: '#09090b', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: '#09090b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Order ID: <span style={{ color: '#fff' }}>{order._id}</span></p>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Placed On: <span style={{ color: '#fff' }}>{new Date(order.createdAt).toLocaleDateString()}</span></p>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Total: <strong style={{ color: '#10b981' }}>₹{order.totalAmount.toFixed(2)}</strong></p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ 
                  background: getStatusMeta(order.status).background, 
                  color: getStatusMeta(order.status).color,
                  padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' 
                }}>
                  {getStatusMeta(order.status).label}
                </span>
                {['pending'].includes((order.status || '').toString().toLowerCase()) && (
                  <button onClick={() => handleCancelOrder(order._id)} className="btn" style={{ background: '#ef4444', padding: '8px 14px', boxShadow: 'none' }}>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;