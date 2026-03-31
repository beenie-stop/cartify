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

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all";

  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2";

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
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-all"
        >
          ← Back to Cart
        </button>
      </header>

      {/* ── BODY ── */}
      <div className="max-w-6xl mx-auto px-8 py-10 flex gap-8 items-start">

        {/* ── LEFT: ILLUSTRATION + ORDER SUMMARY ── */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-5">

          {/* Illustration card */}
          <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 flex items-center justify-center">
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/payment-3d-icon-png-download-5272924.png"
              alt="Checkout Illustration"
              className="w-full max-w-[200px] hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </div>

          {/* Order summary card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-base font-semibold text-gray-800">Order Summary</span>
              {cartItems.length > 0 && (
                <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-400 px-6 py-8 text-center">Your cart is empty.</p>
            ) : (
              <div className="px-6 py-2 divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.images?.[0]?.url || "https://via.placeholder.com/40"}
                          alt={item.name}
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {item.name}
                        <span className="text-gray-400 font-normal"> × {item.qty}</span>
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-800">Total</span>
              <span className="text-base font-bold text-purple-600">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: CHECKOUT FORM ── */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🔒 Secure Checkout
          </h2>

          <form onSubmit={handleCheckout} className="flex flex-col gap-5">

            {/* Shipping Details Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100">
                <span className="text-base font-semibold text-gray-800">Shipping Details</span>
              </div>

              <div className="px-7 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={inputClass}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Address</label>
                  <textarea
                    placeholder="House no., Street, Area..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    className={inputClass}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    className={inputClass}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100">
                <span className="text-base font-semibold text-gray-800">Payment Method</span>
              </div>

              <div className="px-7 py-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Cash on Delivery", "Credit Card", "PayPal", "Stripe"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 py-4 px-3 text-xs font-semibold transition-all duration-150 cursor-pointer
                        ${paymentMethod === method
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                        }`}
                    >
                      <span className="text-xl">
                        {method === "Cash on Delivery" ? "💵" : method === "Credit Card" ? "💳" : method === "PayPal" ? "🅿️" : "⚡"}
                      </span>
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                "Place Order →"
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}