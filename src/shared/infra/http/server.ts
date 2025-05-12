import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import cors from 'cors';
import routes from '../routes';

const mongoUri = 'mongodb://localhost:27017/desafiobackend';

const app = express();

// Middlewares do Express
app.use(cors());
app.use(express.json());

const leituraSchema = new mongoose.Schema({
  datetime: Date,
  inversor_id: Number,
  potencia_ativa_watt: Number,
  temperatura_celsius: Number
});

const Leitura = mongoose.model('Leitura', leituraSchema);

// Modelo para controle de população no MongoDB
const configSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  value: mongoose.Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now }
});

const Config = mongoose.model('Config', configSchema);

// Função para popular o banco de dados
async function popularBanco() {
  const POPULATION_FLAG = 'database_populated_v1'; // Versione a flag
  
  try {
    // Verifica se já foi populado
    const populationConfig = await Config.findOne({ name: POPULATION_FLAG });
    if (populationConfig) {
      console.log('✅ Banco já foi populado anteriormente');
      return;
    }

    // Verifica se já existem dados
    const existingDataCount = await Leitura.countDocuments();
    if (existingDataCount > 0) {
      console.log('📊 Banco já contém dados - marcando como populado');
      await Config.create({ name: POPULATION_FLAG, value: true });
      return;
    }
    const filePath = path.join(__dirname, '../../../../sample/metrics.json');
    console.log(`📂 Lendo arquivo de dados: ${filePath}`);
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const dados = JSON.parse(fileContent);

    const dadosConvertidos = dados.map((item: any) => ({
      datetime: new Date(item.datetime?.$date || item.datetime),
      inversor_id: item.inversor_id,
      potencia_ativa_watt: item.potencia_ativa_watt,
      temperatura_celsius: item.temperatura_celsius
    }));

    // Insere os dados em lote
    const batchSize = 1000;
    for (let i = 0; i < dadosConvertidos.length; i += batchSize) {
      const batch = dadosConvertidos.slice(i, i + batchSize);
      await Leitura.insertMany(batch);
      console.log(`⏳ Inseridos ${Math.min(i + batchSize, dadosConvertidos.length)}/${dadosConvertidos.length} registros`);
    }

    // Marca como populado
    await Config.create({ 
      name: POPULATION_FLAG, 
      value: true,
      metadata: {
        recordsInserted: dadosConvertidos.length,
        date: new Date()
      }
    });

    console.log(`🎉 Banco populado com sucesso! ${dadosConvertidos.length} registros inseridos.`);

  } catch (error) {
    console.error('❌ Erro ao popular o banco:', error);
    throw error;
  }
}

// Configuração do servidor
async function startServer() {
  try {
    // Conecta ao MongoDB com configurações otimizadas
    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
      wtimeoutMS: 2500
    });
    
    console.log('🛢️  Conectado ao MongoDB');

    // Popula o banco se for a primeira vez
    try {
      await popularBanco();
    } catch (error) {
      console.error('⚠️  Aviso: Problema ao popular banco, mas continuando...', error);
    }
    
    app.use('/api', routes);
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Acesse: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('💥 Falha crítica ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();

// Tratamento de sinais para shutdown graceful
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('\n🛑 Servidor encerrado');
  process.exit(0);
});