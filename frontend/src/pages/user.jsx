import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bestSellers, setBestSellers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sort, setSort] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, [search, category, minPrice, maxPrice, sort]);
  useEffect(() => { fetchCart(); fetchBestSellers(); }, []);

  useEffect(() => {
    if (bestSellers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === bestSellers.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [bestSellers]);

  const fetchProducts = async () => {
    try {
      let query = "?";
      if (search) query += `keyword=${search}&`;
      if (category) query += `category=${category}&`;
      if (minPrice) query += `minPrice=${minPrice}&`;
      if (maxPrice) query += `maxPrice=${maxPrice}&`;
      if (sort) query += `sort=${sort}&`;
      const res = await axios.get(`http://localhost:5000/all${query}`);
      setProducts(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchBestSellers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bestsellers");
      setBestSellers(res.data);
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
  };

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

  const selectClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Keyframe for toast slide-in ── */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .toast-enter { animation: slideIn 0.3s ease forwards; }
      `}</style>

      {/* ── TOAST ── */}
      {alertMsg && (
        <div
          className={`toast-enter fixed top-6 right-6 z-[9999] flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-white text-sm font-semibold shadow-2xl
            ${alertType === "success" ? "bg-emerald-500" : "bg-red-500"}`}
        >
          <span className="text-base">{alertType === "success" ? "✓" : "✕"}</span>
          {alertMsg}
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-12 h-[70px] flex items-center justify-between shadow-sm">
        <h1
          className="text-2xl font-bold text-purple-600 cursor-pointer tracking-tight select-none hover:opacity-75 transition-opacity"
          onClick={() => navigate("/dashboard")}
        >
          Cartify
        </h1>

        {/* Search */}
        <div className="relative w-[36%]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">⌕</span>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-gray-200 rounded-full pl-10 pr-5 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="relative w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-lg hover:border-purple-500 hover:bg-purple-50 hover:-translate-y-0.5 transition-all"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-lg hover:border-purple-500 hover:bg-purple-50 hover:-translate-y-0.5 transition-all"
          >
            👤
          </button>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      {bestSellers.length > 0 && (
        <div className="px-12 pt-8">
          <div className="relative bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border border-purple-100 rounded-3xl px-14 py-12 flex items-center justify-between gap-10 overflow-hidden">

            {/* Decorative blob */}
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-purple-100 rounded-full opacity-40 pointer-events-none" />

            {/* Left text */}
            <div className="relative z-10 max-w-lg">
              <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                🔥 Bestseller
              </span>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
                {bestSellers[currentIndex]?.name}
              </h2>
              <p className="text-2xl font-bold text-purple-600 mb-3">
                ₹{bestSellers[currentIndex]?.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mb-7">
                <span className="text-amber-500 font-semibold">
                  ⭐ {bestSellers[currentIndex]?.averageRating?.toFixed(1) || 0}
                </span>
                <span className="text-gray-400 text-sm">
                  ({bestSellers[currentIndex]?.reviews?.length || 0} reviews)
                </span>
              </div>
              <button
                onClick={() => navigate(`/productDetails/${bestSellers[currentIndex]?._id}`)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                Shop Now →
              </button>
            </div>

            {/* Right image */}
            <div className="relative z-10 flex-shrink-0 bg-white rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
              <img
                src={
                  bestSellers[currentIndex]?.images?.length > 0
                    ? bestSellers[currentIndex].images[0].url
                    : "https://via.placeholder.com/300"
                }
                alt="bestseller"
                className="w-60 h-60 object-contain"
              />
            </div>

            {/* Slider dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {bestSellers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-5 h-2 bg-purple-600"
                      : "w-2 h-2 bg-purple-200 hover:bg-purple-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BODY ── */}
      <div className="flex px-12 py-8 gap-7">

        {/* ── SIDEBAR ── */}
        <aside className="w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-5 pb-4 border-b border-gray-100">
              Filters
            </h2>

            <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Category
            </label>
            <select
              className={`${selectClass} mb-5`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {/* <option value="Men">Men</option>
              <option value="Women">Women</option> */}
              <option value="Electronics">Electronics</option>
              <option value="Cosmetics">Cosmetics</option>
              <option value="Shoes">Shoes</option>
              <option value="Furniture">Furniture</option>
               <option value="Sports">Sports</option>
            </select>

            <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Price Range
            </label>
            <div className="flex gap-2 mb-5">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Sort By
            </label>
            <select
              className={selectClass}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </aside>

        {/* ── PRODUCTS ── */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-lg font-bold text-gray-900">All Products</span>
              <span className="ml-2 text-sm text-gray-400">{products.length} items</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/productDetails/${product._id}`)}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-200 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden group"
              >
                {/* Image */}
                <div className="bg-gray-50 border-b border-gray-100 h-44 flex items-center justify-center p-4">
                  <img
                    src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
                    alt={product.name}
                    className="h-36 w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-base font-bold text-purple-600 mb-1.5">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                    {"★".repeat(Math.round(product.averageRating || 0))}
                    <span className="text-gray-400 ml-1">({product.numOfReviews || 0})</span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                    className="mt-auto w-full bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white border border-purple-200 hover:border-purple-600 rounded-lg py-2.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}