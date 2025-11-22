import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from './logout'; // make sure this exists

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">Admin Dashboard</h1>
        <div>
          <Logout />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div
          onClick={() => navigate("/add")}
          className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Add Products
          </h2>
          <p className="text-gray-600">
           Add all the products that u want to list
          </p>
        </div>

       
        <div
          onClick={() => navigate("/status")}
          className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            See Order Status
          </h2>
          <p className="text-gray-600">
            Check the orders
          </p>
        </div>
      </div>
    </div>
  );
}
