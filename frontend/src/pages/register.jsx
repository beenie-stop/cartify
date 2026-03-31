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
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();

  const showAlert = (msg, type = "success") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(""), 3000);
  };

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
        showAlert("Registration successful! Redirecting to login…", "success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showAlert(data.message || "Registration failed", "error");
      }
    } catch (error) {
      showAlert("Something went wrong. Please try again.", "error");
      console.error(error);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all";

  const labelClass =
    "block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

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

      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden flex min-h-[600px]">

        {/* ── LEFT: ILLUSTRATION ── */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border-r border-purple-100 items-center justify-center p-12 relative overflow-hidden">

          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-100 rounded-full opacity-50 pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-fuchsia-100 rounded-full opacity-40 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <img
              src={RegisterImage}
              alt="Register Illustration"
              className="w-full max-w-[300px] drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-2">Join Cartify</h2>
            <p className="text-sm text-gray-400 max-w-[220px] leading-relaxed">
              Create your account and start shopping thousands of products today.
            </p>
          </div>
        </div>

        {/* ── RIGHT: FORM ── */}
        <div className="w-full lg:w-[52%] flex flex-col justify-center px-10 py-10">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-7">
            <img
              src={Cartify_logo}
              alt="Cartify Logo"
              className="w-12 h-12 object-contain mb-3 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h1 className="text-2xl font-bold text-purple-600 tracking-tight">Create Account</h1>
            <p className="text-sm text-gray-400 mt-1">Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 2: Phone + Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 3: DOB + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 4: Role */}
            <div>
              <label className={labelClass}>Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-sm text-center text-gray-400 mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 font-semibold hover:underline">
              Sign In
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}