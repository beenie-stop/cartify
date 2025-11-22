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
      href: "#",
      price: "Rs.1099",
      imageSrc:
        "https://m.media-amazon.com/images/I/41pcgq-l9ML._SY300_SX300_QL70_FMwebp_.jpg",
      imageAlt:
        "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
    },
    {
      id: 2,
      name: "Saree",
      href: "#",
      price: "Rs.3499",
      imageSrc:
        "https://mysilklove.com/cdn/shop/files/13_71294545-7f77-40c3-be79-8f671ffc82ba.jpg?v=1720778654&width=2048",
      imageAlt:
        "Olive drab green insulated bottle with flared screw lid and flat top.",
    },
    {
      id: 3,
      name: "Men Shirt",
      href: "#",
      price: "Rs.799",
      imageSrc:
        "https://m.media-amazon.com/images/I/71qIpxFJFKL._SX569_.jpg",
      imageAlt:
        "Person using a pen to cross a task off a productivity paper card.",
    },
    {
      id: 4,
      name: "Showpiece",
      href: "#",
      price: "Rs.7999",
      imageSrc:
        "https://m.media-amazon.com/images/I/81APY4xn0JL._SX679_.jpg",
      imageAlt:
        "Hand holding black machined steel mechanical pencil with brass tip and top.",
    },
    {
      id: 5,
      name: "Focus Card Tray",
      href: "#",
      price: "Rs.2464",
      imageSrc:
        "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-05.jpg",
      imageAlt: "Paper card sitting upright in walnut card holder on desk.",
    },
    {
      id: 6,
      name: "Round Coffee Table",
      href: "#",
      price: "Rs.14999",
      imageSrc:
        "https://m.media-amazon.com/images/I/51UHGP1WxLL._SY300_SX300_QL70_FMwebp_.jpg",
      imageAlt:
        "Stack of 3 small drab green cardboard paper card refill boxes with white text.",
    },
    {
      id: 7,
      name: "Brass Scissors",
      href: "#",
      price: "Rs.1150",
      imageSrc:
        "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-07.jpg",
      imageAlt:
        "Brass scissors with geometric design, black steel finger holes, and included upright brass stand.",
    },
    {
      id: 8,
      name: "Realme Buds Wireless",
      href: "#",
      price: "Rs.1499",
      imageSrc:
        "https://m.media-amazon.com/images/I/412-YzPRcPL._SX679_.jpg",
      imageAlt:
        "Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.",
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="text-gray-600 body-font shadow-md">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          {/* Logo + Brand Name */}
          <a
            href="/"
            className="flex items-center text-gray-900 mb-4 md:mb-0"
          >
            <img
              src={Cartify_logo}
              alt="Cartify Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="ml-3 tracking-wide text-2xl font-bold text-purple-600">
              Cartify
            </span>
          </a>

          <div className="ml-auto flex">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center bg-[#450693] hover:bg-[#6B21A8] 
           border-0 py-1 px-3 mx-2 focus:outline-none 
           rounded text-white text-base transition-colors duration-300"
            >
              Login
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>

            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center bg-[#450693] hover:bg-[#6B21A8] 
           border-0 py-1 px-3 mx-2 focus:outline-none 
           rounded text-white text-base transition-colors duration-300"
            >
              Register
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

     
    {/* Hero Section */}
<div className="dark:bg-purple-800 bg-[#F9F9F9] w-full">
  <section className="dark:bg-gray-800 bg-[#F9F9F9] px-8 lg:px-16 py-20 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
   
    <div className="order-2 md:order-1 max-w-[531px] flex flex-col items-center text-center md:text-left md:items-start gap-9">
      <h1 className="text-[#450693] dark:text-[#A855F7] text-3xl md:text-4xl lg:text-6xl font-medium font-[cursive]">
        Your One-Stop Shop for Everyday Essentials
      </h1>

      <p className="dark:text-gray-400 text-black text-base md:text-lg lg:text-xl font-normal sm:leading-7">
        Cartify is a modern e-commerce platform built to bring you quality
        products at unbeatable prices. We believe shopping should be
        simple, enjoyable, and trustworthy. From everyday essentials to
        unique finds, our goal is to deliver convenience, affordability,
        and style — all in one place.
      </p>

      <button
        onClick={() => navigate("/register")}
        className="cursor-pointer px-5 py-3 md:px-7 md:py-4 lg:px-9 lg:py-5 
                  bg-[#450693] hover:bg-[#6D28D9] 
                  dark:bg-[#A78BFA] dark:hover:bg-[#7C3AED] 
                  rounded-2xl text-white text-base md:text-lg lg:text-xl 
                  font-normal leading-7 transition-colors duration-300"
      >
        Shop Now
      </button>
    </div>

    {/* Right Image Section */}
    <div className="order-1 md:order-2 w-full md:w-1/2 flex justify-center">
    <img
  src={cart}
  alt="Online Shopping Illustration"
  className="w-full max-w-md md:max-w-lg object-contain rounded-2xl shadow-lg"
/>

    </div>
  </section>
</div>


      {/* Products Grid */}
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <a key={product.id} href={product.href} className="group">
                <img
                  alt={product.imageAlt}
                  src={product.imageSrc}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                />
                <h3 className="mt-4 text-sm text-gray-700">
                  {product.name}
                </h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.price}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
