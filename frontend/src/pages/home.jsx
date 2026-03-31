import React from "react";
import { useNavigate } from "react-router-dom";
import Cartify_logo from "../assets/Cartify_logo.png";
import cart from "../assets/cart.png";

export default function Home() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Boat Headphones",
      price: "₹1,099",
      imageSrc: "https://m.media-amazon.com/images/I/41pcgq-l9ML._SY300_SX300_QL70_FMwebp_.jpg",
      imageAlt: "Boat Headphones",
    },
    {
      id: 2,
      name: "Saree",
      price: "₹3,499",
      imageSrc: "https://mysilklove.com/cdn/shop/files/13_71294545-7f77-40c3-be79-8f671ffc82ba.jpg?v=1720778654&width=2048",
      imageAlt: "Saree",
    },
    {
      id: 3,
      name: "Men Shirt",
      price: "₹799",
      imageSrc: "https://m.media-amazon.com/images/I/71qIpxFJFKL._SX569_.jpg",
      imageAlt: "Men Shirt",
    },
    {
      id: 4,
      name: "Showpiece",
      price: "₹7,999",
      imageSrc: "https://m.media-amazon.com/images/I/81APY4xn0JL._SX679_.jpg",
      imageAlt: "Showpiece",
    },
    {
      id: 5,
      name: "Focus Card Tray",
      price: "₹2,464",
      imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-05.jpg",
      imageAlt: "Focus Card Tray",
    },
    {
      id: 6,
      name: "Round Coffee Table",
      price: "₹14,999",
      imageSrc: "https://m.media-amazon.com/images/I/51UHGP1WxLL._SY300_SX300_QL70_FMwebp_.jpg",
      imageAlt: "Round Coffee Table",
    },
    {
      id: 7,
      name: "Brass Scissors",
      price: "₹1,150",
      imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-07.jpg",
      imageAlt: "Brass Scissors",
    },
    {
      id: 8,
      name: "Realme Buds Wireless",
      price: "₹1,499",
      imageSrc: "https://m.media-amazon.com/images/I/412-YzPRcPL._SX679_.jpg",
      imageAlt: "Realme Buds Wireless",
    },
  ];

  const features = [
    { icon: "🚚", title: "Free Delivery", desc: "On orders above ₹499" },
    { icon: "🔒", title: "Secure Payments", desc: "100% safe & encrypted" },
    { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free returns" },
    { icon: "🎧", title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-12 h-[70px] flex items-center justify-between shadow-sm">
        <a href="/" className="flex items-center gap-2.5 select-none">
          <img src={Cartify_logo} alt="Cartify Logo" className="w-9 h-9 object-contain" />
          <span className="text-2xl font-bold text-purple-600 tracking-tight">Cartify</span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 rounded-full px-5 py-2 text-sm font-semibold text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5 py-2 text-sm font-semibold shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started →
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* Left text */}
        <div className="max-w-xl">
          <span className="inline-flex items-center bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            🛍️ Welcome to Cartify
          </span>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
            Your One-Stop Shop for <span className="text-purple-600">Everyday</span> Essentials
          </h1>
          <p className="text-base text-gray-500 leading-relaxed mb-8">
            Cartify brings you quality products at unbeatable prices. Simple, enjoyable, and trustworthy shopping — from everyday essentials to unique finds, all in one place.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              Shop Now →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-gray-300 text-gray-700 font-semibold px-8 py-3.5 rounded-xl hover:border-purple-400 hover:text-purple-600 transition-all text-sm"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-shrink-0 w-full md:w-[44%] bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border border-purple-100 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-100 rounded-full opacity-40 pointer-events-none" />
          <img
            src={cart}
            alt="Online Shopping Illustration"
            className="relative z-10 w-full max-w-sm object-contain hover:scale-105 transition-transform duration-500 drop-shadow-xl"
          />
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <div className="max-w-6xl mx-auto px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Handpicked just for you</p>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="text-sm font-semibold text-purple-600 hover:underline"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate("/register")}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-200 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden group"
            >
              {/* Image */}
              <div className="bg-gray-50 border-b border-gray-100 h-48 flex items-center justify-center p-4">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-40 w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-snug">{product.name}</p>
                <p className="text-base font-bold text-purple-600 mb-4">{product.price}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate("/register"); }}
                  className="mt-auto w-full bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white border border-purple-200 hover:border-purple-600 rounded-lg py-2.5 text-xs font-semibold transition-all duration-200"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="max-w-6xl mx-auto px-8 pb-14">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white opacity-5 rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to start shopping?</h3>
            <p className="text-purple-200 text-sm">Join thousands of happy customers on Cartify today.</p>
          </div>
          <div className="relative z-10 flex gap-3 flex-shrink-0">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-purple-700 font-bold px-7 py-3 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-white/40 text-white font-semibold px-7 py-3 rounded-xl text-sm hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-200 px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Cartify_logo} alt="Cartify" className="w-6 h-6 object-contain" />
          <span className="text-sm font-bold text-purple-600">Cartify</span>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Cartify. All rights reserved.</p>
      </footer>

    </div>
  );
}