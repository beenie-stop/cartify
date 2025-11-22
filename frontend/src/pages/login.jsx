import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImage from "../assets/login.png";
import Cartify_logo from "../assets/Cartify_logo.png";
import Alert from "../components/alert";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FF] to-[#E9D5FF] text-gray-900">
      <div className="max-w-screen-xl m-6 sm:m-10 bg-white shadow-2xl sm:rounded-2xl flex justify-center flex-1 overflow-hidden">
        {/* Left Side Form */}
        <div className="lg:w-1/2 xl:w-5/12 p-8 sm:p-12 flex flex-col justify-center items-center">
        
          <div className="flex justify-center mb-6">
            <img
              src={Cartify_logo}
              alt="Cartify Logo"
              className="w-20 h-20 object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full flex-1 mt-4">
              {alert.show && (
                <div className="mb-4">
                  <Alert
  message={alert.message}
  description={alert.description}
  type={alert.type} 
  onClose={() => setAlert({ ...alert, show: false })}
/>

                </div>
              )}

              {/* Email & Password */}
              <div className="mx-auto max-w-xs">
                <form onSubmit={handleSubmit}>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 focus:bg-white mt-5"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 tracking-wide font-semibold bg-purple-700 text-white w-full py-4 rounded-lg hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
                      {loading ? "Logging in..." : "Log In"}
                    </span>
                  </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-4">
                  Don’t have an account?{" "}
                  <a
                    href="/register"
                    className="text-purple-700 font-medium hover:underline"
                  >
                    Register
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="flex-1 bg-purple-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${LoginImage})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
