import React, { useState, useEffect } from "react";
import api from "../api";

export default function Addproduct() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
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

  // Fetch products + orders
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/all");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await api.get("/allorder");
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  // Add or Update product
  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...newProduct,
        sizes: newProduct.sizes.split(",").map((s) => s.trim()),
      };

      if (editingProductId) {
        // Update existing product
        const res = await api.put(`/update/${editingProductId}`, productData);
        setProducts(products.map((p) => (p._id === editingProductId ? res.data : p)));
        setEditingProductId(null);
      } else {
        // Add new product
        const res = await api.post("/createproduct", productData);
        setProducts([...products, res.data]);
      }

      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        sizes: "",
        gender: "",
        images: [{ url: "", altText: "" }],
      });
    } catch (err) {
      console.error("Error saving product", err.response?.data || err);
    }
  };

  // Edit product
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
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/delete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  // Update order status
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/api/orders/${id}`, { status });
      setOrders(orders.map((order) => (order._id === id ? res.data.order : order)));
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Admin Dashboard</h1>

      {/* Add / Edit Product Form */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingProductId ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Product Name"
            className="border px-3 py-2 rounded-lg"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="border px-3 py-2 rounded-lg"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            className="border px-3 py-2 rounded-lg"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="border px-3 py-2 rounded-lg"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Brand"
            className="border px-3 py-2 rounded-lg"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
          />
          <input
            type="text"
            placeholder="Sizes (comma separated/Optional)"
            className="border px-3 py-2 rounded-lg"
            value={newProduct.sizes}
            onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
          />
          <select
            className="border px-3 py-2 rounded-lg"
            value={newProduct.gender}
            onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
          <input
            type="text"
            placeholder="Image URL"
            className="border px-3 py-2 rounded-lg"
            value={newProduct.images[0].url}
            onChange={(e) =>
              setNewProduct({ ...newProduct, images: [{ ...newProduct.images[0], url: e.target.value }] })
            }
          />
          <input
            type="text"
            placeholder="Image Alt Text"
            className="border px-3 py-2 rounded-lg"
            value={newProduct.images[0].altText}
            onChange={(e) =>
              setNewProduct({ ...newProduct, images: [{ ...newProduct.images[0], altText: e.target.value }] })
            }
          />
          <button
            onClick={handleSaveProduct}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </section>

      {/* Product List */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 flex flex-col">
             <img
  src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
  alt={product.images?.[0]?.altText || product.name}
  className="h-40 w-full object-contain bg-gray-100 rounded-md"
/>

              <h3 className="mt-2 font-bold">{product.name}</h3>
              <p className="text-gray-600">₹{product.price}</p>
              <p className="text-sm">{product.category}</p>
              <p className="text-sm">{product.brand}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Orders List */}
      {/* ... keep your existing orders table here ... */}
    </div>
  );
}
