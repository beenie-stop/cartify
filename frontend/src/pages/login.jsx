import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImage from "../assets/login.png";
import Cartify_logo from "../assets/Cartify_logo.png";
import Alert from "../components/alert";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        setAlert({
          show: true,
          message: "Login successful!",
          description: "You are being redirected to your dashboard.",
          type: "success",
        });

        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        setAlert({
          show: true,
          message: "Login failed",
          description: data.message || "Invalid credentials",
          type: "error",
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: "Error",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
      console.error(error);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-800 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden flex min-h-[560px]">

        {/* ── LEFT: FORM ── */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-10 py-12">

          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={Cartify_logo}
              alt="Cartify Logo"
              className="w-14 h-14 object-contain mb-3 hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-2xl font-bold text-purple-600 tracking-tight">Cartify</h1>
            <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
          </div>

          {/* Alert */}
          {alert.show && (
            <div className="mb-5">
              <Alert
                message={alert.message}
                description={alert.description}
                type={alert.type}
                onClose={() => setAlert({ ...alert, show: false })}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Email Address
              </label>
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.15 21.15 0 015.06-5.94" />
                      <path d="M1 1l22 22" />
                      <path d="M14.12 14.12a3 3 0 01-4.24-4.24" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-sm text-center text-gray-400 mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-purple-600 font-semibold hover:underline">
              Create one
            </a>
          </p>
        </div>

        {/* ── RIGHT: ILLUSTRATION ── */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border-l border-purple-100 items-center justify-center p-12 relative overflow-hidden">

          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-100 rounded-full opacity-50 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-fuchsia-100 rounded-full opacity-40 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <img
              src={LoginImage}
              alt="Login Illustration"
              className="w-full max-w-[320px] drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-2">Welcome Back!</h2>
            <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed">
              Sign in to explore thousands of products and track your orders.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}