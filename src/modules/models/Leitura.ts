import mongoose from "mongoose";

const leituraSchema = new mongoose.Schema({
  datetime: {
    type: Date,
    required: true
  },
  inversor_id: {
    type: Number,
    required: true
  },
  potencia_ativa_watt: Number,
  temperatura_celsius: Number
});

const LeituraInversor = mongoose.model('LeituraInversor', leituraSchema, 'leituras');
export default LeituraInversor;
