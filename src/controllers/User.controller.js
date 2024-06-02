import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserModel } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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

        if ([ email, password ].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All Fields are required");
        }
    
        const existedUser = await UserModel.findOne({ email });

        if(!existedUser){
            throw new ApiError(404, "User Not Found");
        }

        return res.status(201).json(
            new ApiResponse(200, existedUser, "User Found")
        );

});

export { registerUser, loginUser };
