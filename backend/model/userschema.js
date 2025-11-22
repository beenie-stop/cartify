import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user']
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['female', 'male']
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"]
    }
}, { timestamps: true })

const User = mongoose.model('user', userSchema);
export default User;
