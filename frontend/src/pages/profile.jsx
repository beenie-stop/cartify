import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        const res = await axios.get("http://localhost:5000/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartCount");
    navigate("/login");
  };

  const statusColors = {
    Pending:    "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped:    "bg-indigo-100 text-indigo-700",
    Delivered:  "bg-green-100 text-green-700",
    Cancelled:  "bg-red-100 text-red-700",
  };

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
          ← Back to Store
        </button>
      </header>

      {/* ── BODY ── */}
      <div className="max-w-4xl mx-auto px-8 py-10 flex gap-7 items-start">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-60 flex-shrink-0 flex flex-col gap-4">

          {/* Avatar card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl mb-3">
              👤
            </div>
            <p className="text-sm font-semibold text-gray-800">My Account</p>
            <p className="text-xs text-gray-400 mt-1">Manage your orders</p>
          </div>

          {/* Nav */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors border-b border-gray-100
                ${activeTab === "orders"
                  ? "bg-purple-50 text-purple-700 border-l-4 border-l-purple-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              📦 Order History
            </button>
            <button
              onClick={() => setActiveTab("logout")}
              className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors
                ${activeTab === "logout"
                  ? "bg-purple-50 text-purple-700 border-l-4 border-l-purple-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* ── RIGHT CONTENT ── */}
        <div className="flex-1 min-w-0">

          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📦 Order History
              </h2>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Panel header */}
                <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-800">Your Orders</span>
                  {!loading && orders.length > 0 && (
                    <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {orders.length} order{orders.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Loading */}
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-16">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0s" }} />
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="ml-2 text-gray-400 text-sm">Loading orders…</span>
                  </div>

                /* Empty state */
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-5xl mb-4">🗂️</span>
                    <p className="text-base font-semibold text-gray-500 mb-1">No orders yet</p>
                    <p className="text-sm text-gray-400 mb-5">Start shopping to see your orders here.</p>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="text-sm text-purple-600 font-semibold hover:underline"
                    >
                      Browse Products →
                    </button>
                  </div>

                /* Order list */
                ) : (
                  <div className="divide-y divide-gray-100 px-7">
                    {orders.map((order) => (
                      <div key={order._id} className="py-6">

                        {/* Order meta row */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Order ID</p>
                            <p className="text-xs font-semibold font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded-lg inline-block">
                              {order._id}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Date + Total */}
                        <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                          <span>📅 {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span className="font-semibold text-purple-600">₹{order.totalPrice.toLocaleString()}</span>
                        </div>

                        {/* Items */}
                        <div className="flex flex-wrap gap-2">
                          {order.orderItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700"
                            >
                              <span className="font-medium">{item.product?.name}</span>
                              <span className="text-gray-400">× {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LOGOUT TAB ── */}
          {activeTab === "logout" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🚪 Logout
              </h2>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-7 py-5 border-b border-gray-100">
                  <span className="text-base font-semibold text-gray-800">Sign Out</span>
                </div>
                <div className="px-7 py-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-3xl mb-5">
                    🚪
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to leave?</h3>
                  <p className="text-sm text-gray-400 mb-8 max-w-xs">
                    You'll need to sign in again to access your orders and cart.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-10 py-3 rounded-xl text-sm shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}