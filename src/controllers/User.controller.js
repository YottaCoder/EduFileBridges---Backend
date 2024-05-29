import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserModel } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler ( async (req, res) => {
    const {username, email, password} = req.body 

    if(
        [username, email, password].some((field) => 
            field?.trim() ==="" )
    ){
        throw new ApiError(400, "All Fields are required")
    }

    const existedUser = await UserModel.findOne({
        email
    })

    if (existedUser) {
        throw new ApiError(409, "User Alredy Exists")
    }


    const User = UserModel.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(User._id).select(
        "-password -refreshToken"
    )

    if(createdUser){
        throw new ApiError(500, "Something went wrong while user Register")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})

export { registerUser }