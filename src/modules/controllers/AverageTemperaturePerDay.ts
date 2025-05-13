import { Request, Response, NextFunction } from 'express';
import LeituraInversor from '../models/Leitura';

const AverageTemperaturePerDay = { 
    async getAverageTemperature(req: Request, res: Response, next: NextFunction) {
        try {
            const { inversor_id, data_inicio, data_fim } = req.params;
    
            if (!inversor_id || !data_inicio || !data_fim) {
                return res.status(400).json({
                    error: 'Os parâmetros "inversor_id", "data_inicio" e "data_fim" são obrigatórios.'
                });
            }
    
            const dataInicio = new Date(`${data_inicio}T00:00:00.000Z`);
            const dataFim = new Date(`${data_fim}T23:59:59.999Z`);
    
            if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
            }
    
            if (dataFim < dataInicio) {
                return res.status(400).json({ error: 'Data de início não pode ser posterior à data final!' });
            }
    
            const resultado = await LeituraInversor.aggregate([
                {
                    $match: {
                        inversor_id: Number(inversor_id),
                        datetime: {
                            $gte: dataInicio,
                            $lte: dataFim
                        },
                        temperatura_celsius: { $ne: null } // Ignora nulos
                    }
                },
                {
                    $group: {
                        _id: {
                            dia: { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } }
                        },
                        media_temperatura: { $avg: "$temperatura_celsius" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        dia: "$_id.dia",
                        media_temperatura: { $round: ["$media_temperatura", 2] }
                    }
                },
                {
                    $sort: { dia: 1 }
                }
            ]);
    
            if (resultado.length === 0) {
                return res.status(404).json({ message: 'Nenhuma leitura encontrada para os critérios informados.' });
            }
    
            return res.status(200).json({
                inversor_id: Number(inversor_id),
                data_inicio: dataInicio.toISOString(),
                data_fim: dataFim.toISOString(),
                temperaturas: resultado 
            });
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao calcular média de temperatura por dia.' });
        }
    }
    
}

export default AverageTemperaturePerDay