import React, { useState, useEffect } from 'react';
import { FiUser, FiMapPin, FiPhone, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';

const Checkout = ({ cart, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data
      const products = cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      }));
      const shippingAddress = `${formData.name}, ${formData.address}, ${formData.city}, ${formData.pincode}, ${formData.phone}`;

      // Create order on backend
      const response = await axios.post(
        '/api/orders',
        {
          products,
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      const { orderId, razorpayOrderId, amount, currency } = response.data;

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Iraxas',
        description: 'Purchase from Iraxas',
        order_id: razorpayOrderId,
        handler: async (response) => {
          // Verify payment
          await axios.post(
            '/api/orders/verify',
            {
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            }
          );
          alert('Payment successful! Order placed.');
          // Redirect to orders page or home
        },
        prefill: {
          name: formData.name,
          email: user.email,
          contact: formData.phone,
        },
        theme: {
          color: '#7c3aed',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gradient-to-r from-purple-50 to-pink-50 min-h-screen py-10 px-4'>
      <div className='container mx-auto max-w-6xl'>
        <div className='text-center mb-10'>
          <h1 className='text-3xl md:text-4xl font-serif font-bold text-gray-800'>
            Complete Your Order
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 lg:grid-cols-3 gap-8'
        >
          {/* --- Left Side: Shipping & Payment --- */}
          <div className='lg:col-span-2 bg-white p-8 rounded-lg shadow-lg'>
            {/* Shipping Details */}
            <div>
              <h2 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-4'>
                Shipping Information
              </h2>
              <div className='grid grid-cols-1 gap-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='address'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Address
                  </label>
                  <input
                    type='text'
                    id='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    required
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='city'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      City
                    </label>
                    <input
                      type='text'
                      id='city'
                      value={formData.city}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='pincode'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Pincode
                    </label>
                    <input
                      type='text'
                      id='pincode'
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Side: Order Summary --- */}
          <div className='lg:col-span-1'>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b pb-3'>
                Order Summary
              </h2>
              <div className='space-y-4 mb-4'>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-14 h-14 rounded-md object-cover mr-4'
                      />
                      <div>
                        <p className='font-semibold text-gray-700'>
                          {item.name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className='font-semibold text-gray-800'>
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className='border-t pt-4 space-y-2'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className='flex justify-between font-bold text-xl text-gray-800 border-t pt-2 mt-2'>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors text-lg disabled:opacity-50'
              >
                {loading ? 'Processing...' : 'Place Order & Pay'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
