// ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem('token');

  // Fetch product details from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //   Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          size: 'M', // optional
          color: 'Red', // optional
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Added to cart!');
        onAddToCart && onAddToCart(data); // update parent cart state
        navigate('/cart'); // redirect to cart page
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="container mx-auto p-8 flex flex-col md:flex-row gap-8">
      {/* Product Image */}
      <div className="w-full md:w-1/3">
        <img
          src={product.images?.[0] || product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-xl font-bold mb-4">₹{product.price?.toLocaleString()}</p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border rounded"
          >
            -
          </button>
          <span className="text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 border rounded"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
