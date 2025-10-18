import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/auth'; // your backend endpoint

  // handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle login/signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/register`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Something went wrong!');
        return;
      }

      // When login succeeds, save token in localStorage
      if (isLogin) {
        localStorage.setItem('token', data.token);

        // Optional: decode token to get user info
        const decoded = jwtDecode(data.token);
        console.log('User decoded from token:', decoded);

        setMessage('✅ Login successful!');
      } else {
        setMessage('✅ Registration successful! Please login now.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage('❌ Server error, please try again later.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-sm'>
        <h2 className='text-2xl font-semibold text-center mb-4'>
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {!isLogin && (
            <input
              type='text'
              name='name'
              placeholder='Full Name'
              value={formData.name}
              onChange={handleChange}
              required
              className='w-full border border-gray-300 rounded-md p-2'
            />
          )}

          <input
            type='email'
            name='email'
            placeholder='Email Address'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md p-2'
          />

          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md p-2'
          />

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700'
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className='text-sm text-center mt-4'>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className='text-blue-600 hover:underline'
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        {message && (
          <p className='text-center text-sm mt-4 text-gray-700'>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Auth;
