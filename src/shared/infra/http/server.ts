import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

const mongoUri = 'mongodb://localhost:27017/desafiobackend'; // substitua pelo seu URI do seu db

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Conectado ao MongoDB');
    return popularBanco();
  })
  .catch(err => {
    console.error('Erro na conexão com o MongoDB:', err);
  });

const leituraSchema = new mongoose.Schema({
  datetime: Date,
  inversor_id: Number,
  potencia_ativa_watt: Number,
  temperatura_celsius: Number
});

const Leitura = mongoose.model('Leitura', leituraSchema);

async function popularBanco() {
  try {
    const filePath = path.join(__dirname, '../../../../sample/metrics.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const dados = JSON.parse(fileContent);

    
    const dadosConvertidos = dados.map((item: any) => ({
      datetime: new Date(item.datetime?.$date || item.datetime),
      inversor_id: item.inversor_id,
      potencia_ativa_watt: item.potencia_ativa_watt,
      temperatura_celsius: item.temperatura_celsius
    }));

    await Leitura.insertMany(dadosConvertidos);
    console.log('Dados do arquivo inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao ler ou inserir os dados:', error);
  } finally {
    mongoose.disconnect();
  }
}
