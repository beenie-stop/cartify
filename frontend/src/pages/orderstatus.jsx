import React, { useState, useEffect } from "react";
import api from "../api"; 

export default function Orderstatus() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    sizes: "",
    gender: "",
    images: [{ url: "", altText: "" }],
  });

  // Fetch products + orders
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/all");  
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await api.get("/allorder"); 
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/updatestatus/${id}`, { status }); 
      setOrders(
        orders.map((order) => (order._id === id ? res.data.order : order))
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Admin Dashboard
      </h1>

    

      {/* Orders List */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border">
                <td className="p-2">{order._id}</td>
                <td className="p-2">{order.user?.name || "Unknown"}</td>
                <td className="p-2">₹{order.totalPrice}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
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
      </section>
    </div>
  );
}
