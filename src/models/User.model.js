import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import  bcrypt from "bcrypt";

const UserSchema  = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        unique: false
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: [true, "Email is Already USed!!"],
        uppercase: false,
        validate: {
            validator: function(v) {
                return validator.isEmail(v);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    refreshToken: {
        type: String
    }
}, {timestamp : true} );


//Password Hasing
UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


//compare Entered password and database password
UserSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};


//Generate Access Token
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//Generate Refresh Token
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const UserModel = mongoose.model("User", UserSchema);