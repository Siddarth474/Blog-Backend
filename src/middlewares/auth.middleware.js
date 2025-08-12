import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = async (req, _, next) => {
    try {
        const token = req.header('Authorization')?.replace("Bearer ", "");
    
        if(!token) {
            throw new ApiError(401, "Invalid Authorization");
        }
    
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodeToken?._id).select('-password -refreshToken');
    
        if(!user) throw new ApiError(401, "Invalid Access Token");
    
        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
}
