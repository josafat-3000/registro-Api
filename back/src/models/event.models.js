import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    nombreVisita: {
        type: String,
        required: true
    },
    asunto: {
        type: String,
        required: true
    },
    empresa: {
        type: String,
        required: true
    },
    vehiculo: {
        type: Boolean,
        required: true
    },
    placas: {
        type: String,
        default: "none",
        required: true
    },
    modelo: {
        type: String,
        default: "none",
        required: true
    },
    color: {
        type: String,
        default: "none",
        required: true
    },
    llegada: {
        type: Date,
        required: true
    },
    salida: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Event", eventSchema);
