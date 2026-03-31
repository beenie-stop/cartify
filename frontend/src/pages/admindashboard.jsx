import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./logout";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      icon: "📦",
      title: "Add Products",
      description: "List new products to the store with images, pricing, and details.",
      label: "Manage Inventory",
      route: "/add",
      accent: "bg-purple-50 border-purple-100",
      iconBg: "bg-purple-100 text-purple-600",
      badge: "bg-purple-100 text-purple-600",
    },
    {
      icon: "🚚",
      title: "Order Status",
      description: "Review, track, and update the status of all customer orders.",
      label: "View Orders",
      route: "/status",
      accent: "bg-indigo-50 border-indigo-100",
      iconBg: "bg-indigo-100 text-indigo-600",
      badge: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-12 h-[70px] flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-bold text-purple-600 tracking-tight select-none">
          Cartify <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-2 align-middle">Admin</span>
        </h1>
        <Logout />
      </header>

      {/* ── BODY ── */}
      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Welcome banner */}
        <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-50 border border-purple-100 rounded-2xl px-10 py-8 mb-10 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-100 rounded-full opacity-40 pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Admin Panel
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back 👋</h2>
            <p className="text-sm text-gray-400">Manage your store — products, orders, and more.</p>
          </div>
          <div className="relative z-10 text-6xl hidden sm:block">🛍️</div>
        </div>

        {/* Action cards */}
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.route}
              onClick={() => navigate(card.route)}
              className={`cursor-pointer bg-white border rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-200 transition-all duration-200 overflow-hidden group`}
            >
              <div className="p-7">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 ${card.iconBg}`}>
                  {card.icon}
                </div>

                {/* Text */}
                <h2 className="text-base font-bold text-gray-900 mb-2">{card.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-5">{card.description}</p>

                {/* CTA row */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${card.badge}`}>
                    {card.label}
                  </span>
                  <span className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-200 text-lg">
                    →
                  </span>
                </div>
              </div>

              {/* Bottom accent bar */}
              <div className="h-1 w-0 group-hover:w-full bg-purple-500 transition-all duration-300 rounded-b-2xl" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}