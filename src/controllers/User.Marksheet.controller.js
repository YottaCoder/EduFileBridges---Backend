import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserModel } from "../models/User.model.js";

const uploadMarksheet = asyncHandler( async(req, res) => {
        const User = await req.user._id;

        const existeduser = await UserModel.findById(user);

        if(!existeduser){
            throw new ApiError(404, "User does not exist");
        }

        
})

export {
    uploadMarksheet
}