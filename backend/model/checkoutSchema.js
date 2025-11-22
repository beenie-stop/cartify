import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressLine: { type: String, required: true }, // renamed from 'address'
    city: { type: String, required: true },
    phone_number: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"]
    }
});


const checkoutItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: { type: Number, required: true }
});

const checkoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        checkoutItems: [checkoutItemSchema],
        shippingAddress: shippingAddressSchema,
        paymentMethod: {
            type: String,
            required: true,
            enum: ['PayPal', 'Stripe', 'Credit Card', 'Cash on Delivery']
        },
        totalPrice: { type: Number, required: true },
        status: { // Added status field for finalize checkout
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        },
        paymentStatus: {
            type: String,
            default: "pending"
        },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date }
    },
    {
        timestamps: true
    }
);

const Checkout = mongoose.model('checkout', checkoutSchema);
export default Checkout;
