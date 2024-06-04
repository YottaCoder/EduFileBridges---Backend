import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserModel } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessTokensAndRefreshTokens = async(userId) => {
    try {
            const user =  await UserModel.findById(userId);
            const accessToken = await user.generateAccessToken()
            const refreshToken = await user.generateRefreshToken()

            user.refreshToken = refreshToken;
            await user.save({validateBeforeSave : false});

            return { accessToken, refreshToken }

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required");
    }

    const existedUser = await UserModel.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User Already Exists");
    }

    const createdUser = await UserModel.create({ username, email, password });

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while user Register");
    }

    // Fetch the created user by its _id
    const fetchedUser = await UserModel.findById(createdUser._id).select("-password -refreshToken");

    if (!fetchedUser) {
        throw new ApiError(500, "Something went wrong while fetching the created user");
    }

    return res.status(201).json(
        new ApiResponse(200, fetchedUser, "User Registered Successfully")
    );
});

const loginUser = asyncHandler( async (req, res) => {

        const { email, password} = req.body;

        if(!email){
            throw new ApiError(400, "Email is required")
        }
    
        const User = await UserModel.findOne({ email });

        if(!User){
            throw new ApiError(404, "User does not exist");
        }

        const isPasswordValid = await User.isPasswordCorrect(password);

        if(!isPasswordValid){
            throw new ApiError(401, "Invalid user credentials");
        }

        const { accessToken, refreshToken } =  await generateAccessTokensAndRefreshTokens(User._id);

        const loggedInUser = await UserModel.findById(User._id)
        .select(" -password -refreshToken ")

        const option = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    User: loggedInUser, accessToken, 
                    refreshToken
                },
                "User Logged In Successfully"
            )
        )

});

const logoutUser = asyncHandler( async(req, res) => {
    await UserModel.findByIdAndUpdate(
        req.User._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, "User Logout"))

});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken, process.env.ACCESS_TOKEN_SECRET
     )
 
     const User = await UserModel.findById(decodedToken._id);
 
     if(!User){
         throw new ApiError(401, "Invalid Refresh Token")
     }
 
     if(incomingRefreshToken !== User?.refreshToken){
         throw new ApiError(401, "Refresh token is expired or used")
     }
 
     const option = {
         httpOnly : true,
         secure : true
     }
 
     const {accessToken, newRefreshToken} =  await generateAccessTokensAndRefreshTokens(User._id)
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, option)
     .cookie("refreshToke", newRefreshToken, option)
     .json(
         new ApiResponse(
             200,
             {accessToken, refreshToken: newRefreshToken},
             "Access token refreshed"
         )
     )
 
   } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
   }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken};