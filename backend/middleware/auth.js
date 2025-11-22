import jwt from 'jsonwebtoken';

export const authentication = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    console.log("Auth Header received (backend):", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Incoming token (backend):", token);

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

export const admin = async (req, res, next) => {
    if (req.user && req.user.role == "admin") {
        next();
    } else {
        res.status(403).send({ message: "not authorized" })
    }
}

