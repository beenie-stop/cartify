import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Orderstatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const navigate = useNavigate();

  const showAlert = (msg, type = "success") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/allorder");
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/updatestatus/${id}`, { status });
      setOrders(orders.map((order) => (order._id === id ? res.data.order : order)));
      showAlert("Order status updated!", "success");
    } catch (err) {
      console.error("Error updating status", err);
      showAlert("Failed to update status.", "error");
    }
  };

  const statusColors = {
    Pending:    "bg-yellow-100 text-yellow-700 border-yellow-200",
    Processing: "bg-blue-100 text-blue-700 border-blue-200",
    Shipped:    "bg-indigo-100 text-indigo-700 border-indigo-200",
    Delivered:  "bg-green-100 text-green-700 border-green-200",
    Cancelled:  "bg-red-100 text-red-700 border-red-200",
  };

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast keyframe */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .toast-enter { animation: slideIn 0.3s ease forwards; }
      `}</style>

      {/* Toast */}
      {alertMsg && (
        <div className={`toast-enter fixed top-6 right-6 z-[9999] flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-white text-sm font-semibold shadow-2xl
          ${alertType === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
          <span>{alertType === "success" ? "✓" : "✕"}</span>
          {alertMsg}
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-12 h-[70px] flex items-center justify-between shadow-sm">
        <h1
          className="text-2xl font-bold text-purple-600 tracking-tight select-none cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => navigate("/admin")}
        >
          Cartify <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-2 align-middle">Admin</span>
        </h1>
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-sm font-medium text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-all"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* ── BODY ── */}
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Page title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-7">🚚 Order Status</h2>

        {/* ── STAT CARDS ── */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
              <div
                key={status}
                className={`rounded-2xl border px-5 py-4 flex flex-col gap-1 ${statusColors[status]}`}
              >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">{status}</span>
                <span className="text-2xl font-bold">{statusCounts[status] || 0}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── ORDERS PANEL ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Panel header */}
          <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-base font-bold text-gray-800">All Orders</span>
            {!loading && orders.length > 0 && (
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                {orders.length} order{orders.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.3s" }} />
              <span className="ml-2 text-gray-500 text-sm font-medium">Loading orders…</span>
            </div>

          /* Empty */
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">📋</span>
              <p className="text-base font-bold text-gray-500 mb-1">No orders yet</p>
              <p className="text-sm text-gray-400">Orders will appear here once customers start placing them.</p>
            </div>

          /* Table */
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Order ID</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Total</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">

                      {/* Order ID */}
                      <td className="px-7 py-4">
                        <span className="text-xs font-semibold font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                          {order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">
                            {(order.user?.name || "U")[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{order.user?.name || "Unknown"}</span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-purple-600">₹{Number(order.totalPrice).toLocaleString()}</span>
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColors[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Update dropdown */}
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all cursor-pointer appearance-none pr-8"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}