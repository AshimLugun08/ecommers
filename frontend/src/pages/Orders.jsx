import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          'http://localhost:5000/api/orders/my-orders',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>
            Please login to view orders
          </h2>
          <a
            href='/auth'
            className='bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800'
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>Loading orders...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4'>
        <h1 className='text-3xl font-bold mb-8'>My Orders</h1>

        {orders.length === 0 ? (
          <div className='bg-white rounded-lg shadow p-8 text-center'>
            <h2 className='text-xl font-semibold mb-4'>No orders yet</h2>
            <p className='text-gray-600 mb-6'>
              Start shopping to see your orders here
            </p>
            <a
              href='/shop'
              className='bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800'
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className='space-y-6'>
            {orders.map((order) => (
              <div key={order._id} className='bg-white rounded-lg shadow p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold'>
                      Order #{order.orderId}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-semibold'>
                      ₹{order.totalAmount}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className='border-t pt-4'>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-4 mb-3'
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-16 h-16 object-cover rounded'
                      />
                      <div className='flex-1'>
                        <p className='font-medium'>{item.name}</p>
                        <p className='text-sm text-gray-600'>
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className='text-sm'>
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
