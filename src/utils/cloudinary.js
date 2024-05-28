import {v2 as cloudinary} from 'cloudinary';
import { response } from 'express';
import fs from 'fs';


 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDNAIRY_CLOUD_NAME, 
    api_key: process.env.CLOUDNAIRY_API_KEY, 
    api_secret: process.env.CLOUDNAIRY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload the file on 
        const Responce = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        //file has been uploaded successfull
        console.log("file is uploaded on cloudinary", Responce.url);

        return Responce;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operstion got failed

        return null;
    }
}

export { uploadOnCloudinary }