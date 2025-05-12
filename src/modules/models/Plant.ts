import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        unique: false
    }
});

const Plant = mongoose.model('Plant', plantSchema)

export default Plant; 