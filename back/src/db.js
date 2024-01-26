import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        mongoose.connect('mongodb://localhost/merndb');
        console.log(">>DB esta conectado");
    }catch (error){
        console.log(error);
    }
};
