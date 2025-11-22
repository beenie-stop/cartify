import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/viewcart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.cart || []);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!fullName || !address || !city || !phoneNumber) {
      alert("Please fill all shipping fields");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Phone number must be 10 digits");
      return;
    }

    const checkoutData = {
      checkoutItems: cartItems.map((item) => ({
        product: item._id,
        quantity: item.qty,
        price: item.price,
      })),
      shippingAddress: {
        fullName,
        addressLine: address,
        city,
        phone_number: phoneNumber,
      },
      paymentMethod,
      totalPrice,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/addcheckout",
        checkoutData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Checkout created successfully!");
      navigate(`/thankyou/${res.data.order._id}`);
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert(
        error.response?.data?.message ||
          "Checkout failed! Check console for details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FF] to-[#E9D5FF]  flex flex-col lg:flex-row justify-center items-center gap-10 px-6 py-12">
      
      {/* LEFT SIDE - IMAGE */}
      <div className="lg:w-1/2 flex justify-center items-center">
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/payment-3d-icon-png-download-5272924.png"
          alt="Checkout Illustration"
          className="w-full max-w-md drop-shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* RIGHT SIDE - CHECKOUT DETAILS */}
      <div className="lg:w-1/2 w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#4C1D95]">
          Secure Checkout
        </h2>

        {/* Order Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            🛍️ Order Summary
          </h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item._id} className="py-3 flex justify-between">
                  <span className="text-gray-700">
                    {item.name} × {item.qty}
                  </span>
                  <span className="font-medium text-gray-800">
                    ₹{item.price * item.qty}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex justify-between text-lg font-semibold text-gray-900">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* Shipping Form */}
        <form onSubmit={handleCheckout}>
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">
              Address
            </label>
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">
              City
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-700">
              Payment Method
            </label>
            <select
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="PayPal">PayPal</option>
              <option value="Stripe">Stripe</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white py-3 rounded-lg font-semibold transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
