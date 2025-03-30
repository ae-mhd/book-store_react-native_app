import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
    // get the token from the header in Authorization

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(401);
            throw new Error("Not authorized");
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");

    }

}

export default protectRoute