import mongoose from "mongoose";
import Cart from "../model/cartSchema.js";
import Product from "../model/productSchema.js";

export const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Valid Product ID is required" });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        let cart = await Cart.findOne({ user: req.user.userId });

        if (!cart) {
            cart = new Cart({
                user: req.user.userId,
                items: [{ product: product._id, quantity }],
                totalItems: quantity,
            });
        } else {
            const itemIndex = cart.items.findIndex(item =>
                item.product.toString() === product._id.toString()
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: product._id, quantity });
            }

            cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        }

        await cart.save();
        await cart.populate("items.product");

        const cartItems = cart.items.map(item => ({
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
            qty: item.quantity,
        }));

        res.status(200).json({ message: "Added to cart", cart: cartItems });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ message: error.message || "server error" });
    }
};

export const viewCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }) // 👈 make consistent
      .populate("items.product");

    if (!cart) {
      res.setHeader("Cache-Control", "no-store"); 
      return res.json({ cart: [] });
    }

    const formatted = cart.items.map((item) => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      images: item.product.images,
      qty: item.quantity,
    }));

    res.setHeader("Cache-Control", "no-store"); // 🚫 prevent caching
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.json({ cart: formatted });
  } catch (err) {
    console.error("Error fetching cart", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

export const updateCartItem = async (req, res) => {
    const { type } = req.body;
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    if (!["inc", "dec"].includes(type)) {
        return res.status(400).json({ error: "Type must be 'inc' or 'dec'" });
    }

    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item) return res.status(404).json({ error: "Item not found in cart" });

        if (type === "inc") item.quantity += 1;
        else item.quantity = Math.max(1, item.quantity - 1);

        cart.totalItems = cart.items.reduce((acc, i) => acc + i.quantity, 0);
        await cart.save();
        await cart.populate("items.product");

        const cartItems = cart.items.map(item => ({
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
            qty: item.quantity,
        }));

        res.status(200).json({ cart: cartItems });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(400).json({ message: err.message || "server error" });
    }
};

export const removeFromCart = async (req, res) => {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = cart.items.filter(i => i.product.toString() !== productId);
        cart.totalItems = cart.items.reduce((acc, i) => acc + i.quantity, 0);

        await cart.save();
        await cart.populate("items.product");

        const cartItems = cart.items.map(item => ({
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
            qty: item.quantity,
        }));

        res.status(200).json({ message: "Removed from the cart", cart: cartItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
