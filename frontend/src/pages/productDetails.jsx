import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams(); // product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/one/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to add products to cart.");
        navigate("/login");
        return;
      }

      // ✅ Send productId and quantity
      const res = await axios.post(
        "http://localhost:5000/addtocart",
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Product added to cart!");
      console.log(res.data);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Failed to add to cart. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 grid md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="flex justify-center items-center bg-gray-100 rounded-lg">
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full h-auto object-contain max-h-[500px]"
        />
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.brand}</p>
        <p className="text-purple-700 text-2xl font-semibold mb-6">₹{product.price}</p>
        <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

        <div className="mb-4">
          <span className="font-semibold">Category:</span> {product.category}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Gender:</span> {product.gender}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {product.sizes?.map((size) => (
            <span
              key={size}
              className="border px-3 py-1 rounded-lg text-sm font-medium bg-gray-100"
            >
              {size}
            </span>
          ))}
        </div>

        {/* ✅ Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
