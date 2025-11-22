import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/viewcart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cart || []);
        const totalQty = res.data.cart.reduce((acc, item) => acc + item.qty, 0);
        localStorage.setItem("cartCount", totalQty);
      } catch (err) {
        console.error("Error fetching cart", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Update quantity
  const handleQuantity = async (id, type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/updatecart/${id}`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
      const totalQty = res.data.cart.reduce((acc, item) => acc + item.qty, 0);
      localStorage.setItem("cartCount", totalQty);
    } catch (err) {
      console.error("Error updating quantity", err);
    }
  };

  // Remove item
  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/removecart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
      const totalQty = res.data.cart.reduce((acc, item) => acc + item.qty, 0);
      localStorage.setItem("cartCount", totalQty);
    } catch (err) {
      console.error("Error removing item", err);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (loading) return <p className="p-6 text-lg text-gray-700">Loading cart...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FF] to-[#E9D5FF] 
            flex flex-col lg:flex-row justify-center items-start gap-10 
            px-6 py-12">

      
      {/* LEFT: Cart Section */}
      <div className="lg:w-2/3 bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-[#450693]">
          🛒 Your Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-4"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-1/3">
                    <img
                      src={item.images?.[0]?.url || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-500">₹{item.price}</p>
                    </div>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantity(item._id, "dec")}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full font-bold text-gray-700"
                    >
                      -
                    </button>
                    <span className="px-3 font-medium">{item.qty}</span>
                    <button
                      onClick={() => handleQuantity(item._id, "inc")}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="w-24 text-right font-semibold text-gray-800">
                    ₹{item.price * item.qty}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Subtotal + Checkout */}
            <div className="flex justify-between items-center mt-6 text-lg font-semibold text-gray-800">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#450693] hover:bg-[#6B21A8] text-white py-3 mt-6 rounded-xl text-lg font-medium transition-all duration-300"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>

      {/* RIGHT: Image Section */}
      <div className="lg:w-1/3 flex justify-center items-center">
        <img
          src="https://static.vecteezy.com/system/resources/previews/022/278/271/non_2x/gift-shopping-3d-rendering-icon-illustration-transparent-background-shopping-and-retail-png.png"
          alt="Shopping Illustration"
          className="w-full max-w-md rounded-2xl drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}
