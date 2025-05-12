import mongoose from "mongoose";

const inversorSchema = new mongoose.Schema({
    inversor_id: {
        type: String,
        required: true,
        unique: true
    },

    inversor_localizacao: {
        type: String,
        required: true,
        unique: false
    }

})

const Inversor = mongoose.model('Inversor', inversorSchema)

export default Inversor;