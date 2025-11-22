import User from '../model/userschema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const register = async (req, res) => {
  try {
    const { name, email, password, role, dob, gender, phone_number } = req.body;
    if (!name) return res.status(400).send({ message: "Please Provide Name" });
    if (!email) return res.status(400).send({ message: "Please Provide email" });
    if (!password) return res.status(400).send({ message: "Please Provide password" });
    if (!dob) return res.status(400).send({ message: "Please Provide dob" });
    if (!role) return res.status(400).send({ message: "Please Provide role" });
    if (!gender) return res.status(400).send({ message: "Please Provide gender" });
    if (!phone_number) return res.status(400).send({ message: "Please Provide phone number" });

    if (!emailRegex.test(email)) return res.status(400).send({ message: "email invalid" });
    if (!passwordRegex.test(password)) return res.status(400).send({ message: "password invalid" });

    let existUser = await User.findOne({ email });
    if (existUser) return res.status(400).send({ message: "user already exist" });

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await User.create({ 
      name, 
      email, 
      dob, 
      gender, 
      role, 
      password: hashedPassword, 
      phone_number 
    });

    res.status(200).send({ 
      message: 'user created successfully', 
      newUser 
    });
  }
  catch (err) {
    console.error("Register error:", err);
    res.status(500).send({ message: "Something went wrong in the server" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ message: "Please Provide email" });
    if (!password) return res.status(400).send({ message: "Please Provide password" });

    if (!emailRegex.test(email)) return res.status(400).send({ message: "Invalid email" });

    let existUser = await User.findOne({ email });
    if (!existUser) return res.status(401).send({ message: "register first" });

    let validPassword = await bcrypt.compare(password, existUser.password);
    if (!validPassword) return res.status(400).send({ message: "Invalid credentials" });

    let payload = {
      userId: existUser._id,
      email: existUser.email,
      role: existUser.role
    };

    let token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 🔥 Updated response: send token + role + user info
    res.status(200).send({
      message: 'Login successful',
      token: token,
      role: existUser.role,
      user: {
        id: existUser._id,
        name: existUser.name,
        email: existUser.email,
        role: existUser.role,
      }
    });

  } catch (err) {
    console.log("Login error", err);
    res.status(500).send({ message: "Something went wrong in the server" });
  }
};
