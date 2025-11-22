import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Cartify_logo from "../assets/Cartify_logo.png";

export default function Thankyou() {
  const { id } = useParams(); // order ID from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-purple-700 animate-pulse">
        Loading your order...
      </p>
    );

  if (!order)
    return (
      <p className="text-center mt-20 text-lg text-red-500">
        Order not found.
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FF] to-[#E9D5FF] px-6 py-10">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <img
            src={Cartify_logo}
            alt="Cartify Logo"
            className="w-24 h-24 mx-auto object-contain mb-4"
          />
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">
            Thank You for Ordering!
          </h1>
          <p className="text-gray-600 text-lg">
            Your order has been placed successfully 🎉
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-purple-50 p-6 rounded-xl mb-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Order Summary
          </h2>
          <p className="text-gray-700">
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Status:</span> {order.status}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total Amount:</span> ₹
            {order.totalPrice}
          </p>
        </div>

        {/* Shipping Address */}
        <div className="bg-purple-50 p-6 rounded-xl mb-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Shipping Address
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.addressLine}, {order.shippingAddress.city}
            <br />
           
          </p>
        </div>

        {/* Items Ordered */}
        <div className="bg-purple-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Items Ordered
          </h2>
          <ul className="divide-y divide-gray-200">
            {order.orderItems.map((item) => (
              <li
                key={item.product._id}
                className="py-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.product.images?.[0]?.url ||
                      item.product.images?.[0] ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.product.name}
                    </p>
                    <p className="text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  ₹{item.product.price * item.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
