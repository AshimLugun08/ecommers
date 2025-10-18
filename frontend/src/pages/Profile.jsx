// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const Profile = ({ user, onAuthSuccess, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user orders when profile loads
  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
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
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        onAuthSuccess(response.data.user);
        toast({
          title: 'Success!',
          description: 'Profile updated successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  // If user is not logged in, show auth component
  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-4xl mx-auto px-4'>
          <h1 className='text-3xl font-bold mb-8'>My Account</h1>
          <div className='bg-white rounded-lg shadow p-6'>
            <Auth onAuthSuccess={onAuthSuccess} isProfileLogin={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl font-bold mb-8'>My Account</h1>

        <div className='bg-white rounded-lg shadow'>
          {/* Tabs */}
          <div className='border-b'>
            <nav className='flex -mb-px'>
              {['profile', 'orders', 'addresses'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'profile' && 'Profile'}
                  {tab === 'orders' && 'My Orders'}
                  {tab === 'addresses' && 'Addresses'}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === 'profile' && (
              <div>
                <h2 className='text-xl font-semibold mb-4'>
                  Personal Information
                </h2>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Name
                    </label>
                    <input
                      type='text'
                      defaultValue={user.name}
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Email
                    </label>
                    <input
                      type='email'
                      defaultValue={user.email}
                      disabled
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
                    />
                  </div>
                  <button
                    onClick={updateProfile}
                    className='bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800'
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className='text-xl font-semibold mb-4'>Order History</h2>
                {orders.length === 0 ? (
                  <p className='text-gray-500'>No orders yet</p>
                ) : (
                  <div className='space-y-4'>
                    {orders.map((order) => (
                      <div key={order._id} className='border rounded-lg p-4'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <p className='font-semibold'>
                              Order #{order.orderId}
                            </p>
                            <p className='text-sm text-gray-600'>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className='text-sm'>Status: {order.status}</p>
                          </div>
                          <p className='font-semibold'>₹{order.totalAmount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className='text-xl font-semibold mb-4'>
                  Shipping Addresses
                </h2>
                {/* Address management will go here */}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onLogout}
          className='mt-6 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
