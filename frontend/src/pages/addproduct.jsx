import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Addproduct() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    sizes: "",
    gender: "",
    images: [{ url: "", altText: "" }],
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const navigate = useNavigate();

  const showAlert = (msg, type = "success") => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/admin/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleSaveProduct = async () => {
    try {
      setSaveLoading(true);
      const productData = {
        ...newProduct,
        sizes: newProduct.sizes.split(",").map((s) => s.trim()),
      };

      if (editingProductId) {
        const res = await api.put(`/update/${editingProductId}`, productData);
        setProducts(products.map((p) =>
          p._id === editingProductId ? res.data.product : p
        ));
        setEditingProductId(null);
        showAlert("Product updated successfully!", "success");
      } else {
        const res = await api.post("/createproduct", productData);
        setProducts([...products, res.data]);
        showAlert("Product added successfully!", "success");
      }

      setNewProduct({
        name: "", description: "", price: "", category: "",
        brand: "", sizes: "", gender: "",
        images: [{ url: "", altText: "" }],
      });
    } catch (err) {
      console.error("Error saving product", err.response?.data || err);
      showAlert("Failed to save product. Please try again.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      sizes: product.sizes.join(", "),
      gender: product.gender,
      images: product.images,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/delete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      showAlert("Product deleted.", "success");
    } catch (err) {
      console.error("Error deleting product", err);
      showAlert("Failed to delete product.", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewProduct({
      name: "", description: "", price: "", category: "",
      brand: "", sizes: "", gender: "",
      images: [{ url: "", altText: "" }],
    });
  };

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all";

  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50">

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

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-12 h-[70px] flex items-center justify-between shadow-sm">
        <h1
          className="text-2xl font-bold text-purple-600 tracking-tight select-none cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => navigate("/admin")}
        >
          Cartify <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-2 align-middle">Admin</span>
        </h1>
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-sm font-medium text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-all"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* ── BODY ── */}
      <div className="max-w-6xl mx-auto px-8 py-10 flex gap-7 items-start">

        {/* ── LEFT: FORM ── */}
        <div className="w-[390px] flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            {editingProductId ? "✏️ Edit Product" : "➕ Add Product"}
          </h2>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">
                {editingProductId ? "Update details below" : "Fill in product details"}
              </span>
              {editingProductId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors font-semibold"
                >
                  ✕ Cancel
                </button>
              )}
            </div>

            <div className="px-6 py-6 flex flex-col gap-4">

              <div>
                <label className={labelClass}>Product Name</label>
                <input type="text" placeholder="e.g. Nike Air Max" className={inputClass}
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea placeholder="Describe the product..." rows={3}
                  className={`${inputClass} resize-none`}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input type="number" placeholder="0.00" className={inputClass}
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Brand</label>
                  <input type="text" placeholder="e.g. Nike" className={inputClass}
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Category</label>
                  <input type="text" placeholder="e.g. Shoes" className={inputClass}
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select className={`${inputClass} appearance-none cursor-pointer`}
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}>
                    <option value="">Select</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Sizes <span className="normal-case font-normal text-gray-500">(comma separated, optional)</span>
                </label>
                <input type="text" placeholder="S, M, L, XL" className={inputClass}
                  value={newProduct.sizes}
                  onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })} />
              </div>

              <div>
                <label className={labelClass}>Image URL</label>
                <input type="text" placeholder="https://..." className={inputClass}
                  value={newProduct.images[0].url}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [{ ...newProduct.images[0], url: e.target.value }] })} />
              </div>

              <div>
                <label className={labelClass}>Image Alt Text</label>
                <input type="text" placeholder="Short description of image" className={inputClass}
                  value={newProduct.images[0].altText}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [{ ...newProduct.images[0], altText: e.target.value }] })} />
              </div>

              {/* Image preview */}
              {newProduct.images[0].url && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex items-center justify-center h-36 overflow-hidden">
                  <img
                    src={newProduct.images[0].url}
                    alt="preview"
                    className="max-h-full object-contain"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}

              <button
                onClick={handleSaveProduct}
                disabled={saveLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm shadow-md hover:shadow-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-1"
              >
                {saveLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  editingProductId ? "✓ Update Product" : "+ Add Product"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: PRODUCT LIST ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Manage Products</h2>
            {products.length > 0 && (
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                {products.length} product{products.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">📦</span>
              <p className="text-base font-bold text-gray-500 mb-1">No products yet</p>
              <p className="text-sm text-gray-400">Add your first product using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.isArray(products) && products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Image */}
                  <div className="bg-gray-50 border-b border-gray-100 h-44 flex items-center justify-center p-4">
                    <img
                      src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
                      alt={product.images?.[0]?.altText || product.name}
                      className="h-36 w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</p>
                    <p className="text-base font-bold text-purple-600 mb-2">₹{Number(product.price).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mb-4">
                      {product.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{product.category}</span>
                      )}
                      {product.brand && (
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold">{product.brand}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-amber-50 hover:bg-amber-400 text-amber-700 hover:text-white border border-amber-300 hover:border-amber-400 rounded-lg py-2 text-xs font-bold transition-all duration-150"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex-1 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-lg py-2 text-xs font-bold transition-all duration-150"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}