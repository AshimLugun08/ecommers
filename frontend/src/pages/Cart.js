import { useEffect, useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Fetch cart items
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      console.log('Fetched cart:', data);
      setCart(data);
    } catch (error) {
      console.error(error);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // Remove item from cart
  const handleRemove = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data);
    } catch (error) { console.error(error); }
  };

  // Change item quantity
  const handleQuantityChange = async (itemId, newQty) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) { fetchCart(); return; }
      const data = await res.json();
      setCart(data);
    } catch (error) { console.error(error); fetchCart(); }
  };

  // Place order (no payment)
 const handlePlaceOrder = async () => {
  try {
    const token = localStorage.getItem('token');

    // Format products based on your cart structure
    const orderData = {
  products: cart.items.map(item => ({
    product: item.product._id,  // or item._id depending on your structure
    quantity: item.quantity,
    price: item.product.price,
  })),
  totalAmount: cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ),
  shippingAddress: "Ranchi, Jharkhand, India",
};

    console.log("Posting Order Data:", orderData);

    const res = await axios.post('http://localhost:5000/api/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Order Response:", res.data);
    alert('Order placed successfully!');
  } catch (error) {
    console.error("Order posting error:", error.response?.data || error.message);
    alert('Failed to place order');
  }
};


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-16 h-16 border-4 border-gray-300 border-t-purple-600 rounded-full"></div>
    </div>
  );

  const cartItems = cart?.items || [];
  if (!cartItems.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <ShoppingBag className="mx-auto w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Start shopping to add items!</p>
        <a href="/shop" className="bg-purple-600 text-white px-6 py-2 rounded-lg">Shop Now</a>
      </div>
    </div>
  );

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item._id} className="bg-white p-6 rounded-xl shadow hover:shadow-md">
              <div className="flex gap-6">
                <img src={item.image || item.product.images?.[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-xl font-bold">₹{item.product.price}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button disabled={item.quantity <= 1} onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => handleRemove(item._id)} className="flex items-center gap-2 text-red-600"><Trash2 className="w-4 h-4" /> Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-xl shadow sticky top-8">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between mb-2"><span>Shipping</span><span>₹{shipping}</span></div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>₹{total}</span></div>
            <button onClick={handlePlaceOrder} className="w-full bg-purple-600 text-white py-3 rounded-lg mt-4 hover:bg-purple-700">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
