import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch order history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartCount");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">My Profile</h1>
        <button
          onClick={handleLogout}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "orders"
              ? "border-b-4 border-purple-600 text-purple-700"
              : "text-gray-500 hover:text-purple-600"
          }`}
        >
          Order History
        </button>

        <button
          onClick={() => setActiveTab("logout")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "logout"
              ? "border-b-4 border-purple-600 text-purple-700"
              : "text-gray-500 hover:text-purple-600"
          }`}
        >
          Logout
        </button>
      </div>

      
      <div>
        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">
              Your Order History
            </h2>

            {loading ? (
              <p className="text-gray-500">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">Order ID:</span> {order._id}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Shipped"
                            ? "bg-indigo-100 text-indigo-800"
                            : order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Total:</span> ₹{order.totalPrice}
                    </p>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      {order.orderItems.map((item) => (
                        <li key={item._id}>
                          {item.product?.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logout Tab */}
        {activeTab === "logout" && (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              Ready to logout?
            </h2>
            <p className="text-gray-600 mb-5">
              You’ll need to log in again to access your account.
            </p>
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
