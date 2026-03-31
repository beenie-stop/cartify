import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cartify_logo from "../assets/Cartify_logo.png";

export default function Thankyou() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/order/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0s" }} />
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.15s" }} />
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.3s" }} />
        <span className="ml-3 text-gray-400 text-sm font-medium">Loading your order…</span>
      </div>
    );
  }

  /* ── NOT FOUND ── */
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">😕</span>
        <p className="text-lg font-semibold text-gray-600">Order not found.</p>
        <Link
          to="/dashboard"
          className="text-sm text-purple-600 hover:underline font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

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
      </header>

      {/* ── BODY ── */}
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* ── SUCCESS BANNER ── */}
        <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border border-purple-100 rounded-2xl p-10 flex flex-col items-center text-center mb-7">
          <img
            src={Cartify_logo}
            alt="Cartify Logo"
            className="w-16 h-16 object-contain mb-5"
          />
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-5">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-500 text-sm">
            Your order has been placed successfully. We'll notify you once it ships. 🎉
          </p>
        </div>

        {/* ── ORDER SUMMARY CARD ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-5">
          <div className="px-7 py-5 border-b border-gray-100">
            <span className="text-base font-semibold text-gray-800">Order Summary</span>
          </div>
          <div className="px-7 py-6 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Order ID</span>
              <span className="text-gray-800 font-semibold font-mono text-xs bg-gray-100 px-3 py-1 rounded-lg">
                {order._id}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Status</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100 mt-1">
              <span className="text-gray-800 font-semibold">Total Amount</span>
              <span className="text-purple-600 font-bold text-base">₹{order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── SHIPPING ADDRESS CARD ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-5">
          <div className="px-7 py-5 border-b border-gray-100">
            <span className="text-base font-semibold text-gray-800">Shipping Address</span>
          </div>
          <div className="px-7 py-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg flex-shrink-0">
              📍
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900 mb-1">{order.shippingAddress.fullName}</p>
              <p className="text-gray-500">{order.shippingAddress.addressLine}</p>
              <p className="text-gray-500">{order.shippingAddress.city}</p>
            </div>
          </div>
        </div>

        {/* ── ITEMS ORDERED CARD ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-base font-semibold text-gray-800">Items Ordered</span>
            <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
              {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-gray-100 px-7">
            {order.orderItems.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between py-5 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-[68px] h-[68px] rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <img
                      src={
                        item.product.images?.[0]?.url ||
                        item.product.images?.[0] ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.product.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{item.product.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-purple-600">
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="flex justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 px-10 rounded-xl shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            Continue Shopping →
          </Link>
        </div>

      </div>
    </div>
  );
}