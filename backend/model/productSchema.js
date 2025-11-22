import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    sizes: {
        type: [String],
        required: true
    },
    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex"],
    },
    images: [{
        url: {
            type: String,
            required: true,
        },
        altText: {
            type: String
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, { timestamps: true })

const Product = mongoose.model('product', productSchema);
export default Product;
