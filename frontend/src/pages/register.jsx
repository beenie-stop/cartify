import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterImage from "../assets/register.png";
import Cartify_logo from "../assets/Cartify_logo.png";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "male",
    role: "user",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FF] to-[#E9D5FF] text-gray-900 flex justify-center items-center px-4">
      <div className="max-w-screen-xl bg-white/80 backdrop-blur-md shadow-lg rounded-2xl flex flex-col lg:flex-row w-full overflow-hidden">
        
        
      {/* Left Side Image */}
<div className="flex-1 bg-purple-100 hidden lg:flex items-center justify-center">
  <div
    className="m-12 xl:m-16 w-full h-[450px] bg-contain bg-center bg-no-repeat"
    style={{
      backgroundImage: `url(${RegisterImage})`,
    }}
  ></div>
</div>


        {/* Right Side Form */}
        <div className="lg:w-1/2 xl:w-5/12 p-8 sm:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={Cartify_logo}
              alt="Cartify Logo"
              className="w-20 h-20 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:bg-white"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:bg-white"
            />

            {/* Phone Number */}
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="Phone Number"
              pattern="[0-9]{10}"
              maxLength={10}
              className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:bg-white"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:bg-white"
            />

            {/* DOB */}
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:bg-white"
            />

            {/* Gender */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:bg-white"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 tracking-wide font-semibold bg-purple-700 text-white w-full py-4 rounded-lg hover:bg-purple-500 transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 -ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              <span className="ml-2">
                {loading ? "Registering..." : "Register"}
              </span>
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
