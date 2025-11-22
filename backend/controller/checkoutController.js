import mongoose from "mongoose";
import Checkout from "../model/checkoutSchema.js";
import Product from "../model/productSchema.js";
import Order from "../model/orderSchema.js";
import User from "../model/userschema.js";

export const addCheckout = async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod } = req.body;

  if (!checkoutItems || checkoutItems.length === 0)
    return res.status(400).json({ message: 'No order items' });

  try {
    let totalPrice = 0;
    const validatedItems = [];

    for (let item of checkoutItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });

      totalPrice += product.price * item.quantity;
      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // ✅ Create order immediately
    const order = new Order({
      user: req.user.userId,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
      status: 'Pending',
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: createdOrder,
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update Checkout
export const updateCheckout = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const checkoutId = req.params.id;

        const checkout = await Checkout.findById(checkoutId);
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        if (shippingAddress) checkout.shippingAddress = shippingAddress;
        if (paymentMethod) checkout.paymentMethod = paymentMethod;

        const updatedCheckout = await checkout.save();
        res.json({ success: true, checkout: updatedCheckout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update checkout' });
    }
};

