import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const navigate = useNavigate();

  const showAlert = (msg, type = "success") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(""), 2500);
  };

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

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUserId(storedUser._id);
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("Please login to add products to cart.", "error");
        navigate("/login");
        return;
      }
      setCartLoading(true);
      await axios.post(
        "http://localhost:5000/addtocart",
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Product added to cart!", "success");
    } catch (err) {
      console.error("Error adding to cart:", err);
      showAlert("Failed to add to cart. Please try again.", "error");
    } finally {
      setCartLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("Login to add review", "error");
        navigate("/login");
        return;
      }
      setReviewLoading(true);
      await axios.post(
        `http://localhost:5000/review/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Review added successfully!", "success");
      setRating(0);
      setComment("");
      const res = await axios.get(`http://localhost:5000/one/${id}`);
      setProduct(res.data);
    } catch (error) {
      showAlert(error.response?.data?.message || "Error adding review", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/review/${id}/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Review deleted.", "success");
      const res = await axios.get(`http://localhost:5000/one/${id}`);
      setProduct(res.data);
    } catch (error) {
      showAlert("Error deleting review", "error");
    }
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0s" }} />
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.15s" }} />
        <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.3s" }} />
        <span className="ml-3 text-gray-400 text-sm font-medium">Loading product…</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">😕</span>
        <p className="text-base font-semibold text-gray-500">Product not found.</p>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-purple-600 font-semibold hover:underline">
          ← Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Keyframe for toast ── */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .toast-enter { animation: slideIn 0.3s ease forwards; }
      `}</style>

      {/* ── TOAST ── */}
      {alertMsg && (
        <div className={`toast-enter fixed top-6 right-6 z-[9999] flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-white text-sm font-semibold shadow-2xl
          ${alertType === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
          <span>{alertType === "success" ? "✓" : "✕"}</span>
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
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-all"
        >
          ← Back to Store
        </button>
      </header>

      {/* ── PRODUCT SECTION ── */}
      <div className="max-w-5xl mx-auto px-8 py-10">

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">

          {/* Image */}
          <div className="md:w-[45%] bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex items-center justify-center p-10 min-h-[380px]">
            <img
              src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
              alt={product.name}
              className="w-full max-h-[380px] object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Details */}
          <div className="md:w-[55%] p-8 flex flex-col justify-center">

            {/* Category badge */}
            <span className="inline-flex w-fit items-center bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>

            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-snug">{product.name}</h1>

            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-400 font-medium mb-3">{product.brand}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className={`text-base ${s <= Math.round(product.averageRating || 0) ? "text-amber-400" : "text-gray-200"}`}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-400">({product.numOfReviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-purple-600 mb-5">
              ₹{product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Meta */}
            <div className="flex gap-6 mb-6 text-sm">
              {product.gender && (
                <div>
                  <span className="text-gray-400 font-medium">Gender</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{product.gender}</p>
                </div>
              )}
              {product.category && (
                <div>
                  <span className="text-gray-400 font-medium">Category</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{product.category}</p>
                </div>
              )}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="border border-gray-200 bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-default"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {cartLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding…
                </>
              ) : (
                "🛒 Add to Cart"
              )}
            </button>
          </div>
        </div>

        {/* ── REVIEWS SECTION ── */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Customer Reviews</h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Write a review card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <span className="text-base font-semibold text-gray-800">Write a Review</span>
              </div>
              <div className="px-6 py-6">

                {/* Star picker */}
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Your Rating</p>
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className={`text-3xl cursor-pointer transition-all duration-150 hover:scale-110 ${
                        star <= (hover || rating) ? "text-amber-400" : "text-gray-200"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Your Comment</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none mb-4"
                />

                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewLoading || rating === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {reviewLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </div>

            {/* Reviews list card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <span className="text-base font-semibold text-gray-800">All Reviews</span>
                {product.reviews?.length > 0 && (
                  <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {product.reviews.length} review{product.reviews.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Empty */}
              {(!product.reviews || product.reviews.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <span className="text-4xl mb-3">💬</span>
                  <p className="text-sm font-semibold text-gray-400">No reviews yet</p>
                  <p className="text-xs text-gray-300 mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 px-6 max-h-[380px] overflow-y-auto">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="py-4 flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Avatar + name */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">
                            {(review.user?.name || "U")[0].toUpperCase()}
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{review.user?.name || "User"}</p>
                        </div>

                        {/* Stars */}
                        <div className="flex mb-1.5">
                          {[1,2,3,4,5].map((s) => (
                            <span key={s} className={`text-sm ${s <= review.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>

                        {/* Date */}
                        <p className="text-xs text-gray-300 mt-1.5">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>

                      {/* Delete (commented out as in original) */}
                      {/* {userId && review.user && userId === (review.user._id || review.user) && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-xs text-gray-300 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex-shrink-0"
                        >
                          🗑
                        </button>
                      )} */}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}