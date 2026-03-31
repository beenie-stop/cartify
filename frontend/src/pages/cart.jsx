import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleCheckout = () => navigate("/checkout");

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

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0s" }} />
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.15s" }} />
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.3s" }} />
        <span className="ml-3 text-gray-400 text-sm font-medium">Loading your cart…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-12 h-[70px] flex items-center justify-between shadow-sm">
        <h1
          className="text-2xl font-bold text-purple-600 cursor-pointer tracking-tight select-none hover:opacity-75 transition-opacity"
          onClick={() => navigate("/dashboard")}
        >
          Cartify
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-all"
        >
          ← Continue Shopping
        </button>
      </header>

      {/* ── PAGE BODY ── */}
      <div className="max-w-6xl mx-auto px-8 py-10 flex gap-7 items-start">

        {/* ── LEFT: CART PANEL ── */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🛒 Your Cart
          </h2>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            {/* Panel header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <span className="text-base font-semibold text-gray-800">Items</span>
              {cart.length > 0 && (
                <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {cart.length} item{cart.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Empty state */}
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <span className="text-5xl mb-4">🛍️</span>
                <p className="text-base font-semibold text-gray-500 mb-1">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add items from the store to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 px-7">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-6 py-5"
                  >
                    {/* Product info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-[76px] h-[76px] rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.images?.[0]?.url || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">₹{item.price.toLocaleString()} each</p>
                      </div>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden h-9 flex-shrink-0">
                      <button
                        onClick={() => handleQuantity(item._id, "dec")}
                        className="w-9 h-9 flex items-center justify-center text-purple-600 font-bold text-base hover:bg-purple-50 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 text-sm font-semibold text-gray-800 border-x border-gray-200 h-full flex items-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleQuantity(item._id, "inc")}
                        className="w-9 h-9 flex items-center justify-center text-purple-600 font-bold text-base hover:bg-purple-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="text-sm font-bold text-purple-600 w-24 text-right flex-shrink-0">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 flex-shrink-0"
                    >
                      🗑 Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: SUMMARY + ILLUSTRATION ── */}
        <aside className="w-72 flex-shrink-0 flex flex-col gap-5">

          {/* Order summary card */}
          {cart.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-5 pb-4 border-b border-gray-100">
                Order Summary
              </h3>

              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
                <span className="font-medium text-gray-700">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <div className="flex justify-between text-base font-bold text-gray-900 mt-4 pt-4 border-t border-gray-100">
                <span>Total</span>
                <span className="text-purple-600">₹{subtotal.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-purple-300 hover:shadow-lg"
              >
                Proceed to Checkout →
              </button>
            </div>
          )}

          {/* Illustration card */}
          <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 flex items-center justify-center">
            <img
              src="https://static.vecteezy.com/system/resources/previews/022/278/271/non_2x/gift-shopping-3d-rendering-icon-illustration-transparent-background-shopping-and-retail-png.png"
              alt="Shopping Illustration"
              className="w-full max-w-[200px] hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </div>
        </aside>

      </div>
    </div>
  );
}