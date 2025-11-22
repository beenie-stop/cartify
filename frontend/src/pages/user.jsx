import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // 🔥 Alert States
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/all");
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/viewcart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const totalQty = res.data.cart.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(totalQty);
        localStorage.setItem("cartCount", totalQty);
      } catch (err) {
        console.error("Error fetching cart", err);
      }
    };

    fetchProducts();
    fetchCart();
  }, []);

  // 🔥 ADD TO CART WITH INLINE ALERT
  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAlertMsg("Please login first!");
        setAlertType("error");
        setTimeout(() => setAlertMsg(""), 2000);
        navigate("/login");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/addtocart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const totalQty = res.data.cart.reduce((acc, item) => acc + item.qty, 0);
      setCartCount(totalQty);
      localStorage.setItem("cartCount", totalQty);

      setAlertMsg("Product added to cart!");
      setAlertType("success");
      setTimeout(() => setAlertMsg(""), 2000);
    } catch (err) {
      setAlertMsg("Failed to add to cart!");
      setAlertType("error");
      setTimeout(() => setAlertMsg(""), 2000);
    }
  };

  const goToCart = () => {
    navigate("/cart");
  };

  return (
    <>
      {/* 🔥 ALERT TOAST */}
      {alertMsg && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg text-white shadow-lg z-50
          ${alertType === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {alertMsg}
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-purple-600 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Cartify
          </h1>

          <input
            type="text"
            placeholder="Search products..."
            className="border rounded-lg px-3 py-2 w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex items-center space-x-4">
            <button
              onClick={goToCart}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <span className="mr-2">🛒</span>
              Cart {cartCount}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors duration-300 flex items-center justify-center"
              title="Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14c3.866 0 7 1.343 7 3v2H5v-2c0-1.657 3.134-3 7-3zm0-10a4 4 0 110 8 4 4 0 010-8z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Products Grid */}
        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products
            .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/productDetails/${product._id}`)}
                className="bg-white shadow-lg rounded-xl p-4 flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
                  alt={product.images?.[0]?.altText || product.name}
                  className="h-48 w-full object-contain bg-gray-100 rounded-md"
                />

                <h2 className="mt-3 font-semibold text-lg">{product.name}</h2>
                <p className="text-gray-600">₹{product.price}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product._id);
                  }}
                  className="mt-auto bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Add to Cart
                </button>
              </div>
            ))}
        </main>
      </div>
    </>
  );
}
