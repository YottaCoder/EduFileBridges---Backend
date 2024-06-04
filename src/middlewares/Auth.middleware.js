import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.model.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
   try {
     const token = req.cookies?.accessToken || 
     req.header("Authorization")?.replace("Bearer ", "");
 
     if(!token){
         throw new ApiError(401, "Unauthorized request")
     }
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
     const User = await UserModel.findById(decodedToken?._id)
     .select(" -password -refreshToken ")
 
     if(!User){
         throw new ApiError(401, "Invalid Access Token")
     }
 
     req.User = User;
     next()

   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access token")
   }

})