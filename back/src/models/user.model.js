import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type: String,
      required: true,
      default: "Empleado",
    },
    status: {
      type: String,
      required: true,
      default: 'UNVERIFIED'
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
