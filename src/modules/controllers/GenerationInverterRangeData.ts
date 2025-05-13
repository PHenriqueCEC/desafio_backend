import { Request, Response, NextFunction } from 'express';
import LeituraInversor from '../models/Leitura';

const GenerationInverterRangeData = {
    async getMaximumInverterPower(req: Request, res: Response, next: NextFunction) {
        try {
            const { inversor_id, data_inicio, data_fim } = req.params;
    
            if (!inversor_id || !data_inicio || !data_fim) {
                return res.status(400).json({
                    error: 'Os parâmetros "inversor_id", "data_inicio" e "data_fim" são obrigatórios.'
                });
            }
    
            // Converter datas no formato YYYY-MM-DD para objetos Date
            const dataInicio = new Date(`${data_inicio}T00:00:00.000Z`);
            const dataFim = new Date(`${data_fim}T23:59:59.999Z`);
            
    
            if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
            }
            
            if(dataFim < dataInicio) {
                return res.status(400).json({ error: 'Data de início não pode ser posterior a data final!'})
            }

            const resultado = await LeituraInversor.aggregate([
                {
                    $match: {
                        inversor_id: Number(inversor_id),
                        datetime: {
                            $gte: dataInicio,
                            $lte: dataFim
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total_potencia: { $sum: "$potencia_ativa_watt"},
                        potencia_maxima: { $max: "$potencia_ativa_watt" },
                        total_leituras: { $sum: 1 }
                    }
                }
            ]);
            
    
            if (resultado.length === 0) {
                return res.status(404).json({ message: 'Nenhuma leitura encontrada para os critérios informados.' });
            }
    
            const { total_potencia, potencia_maxima, total_leituras } = resultado[0];
    
            return res.status(200).json({
                inversor_id: Number(inversor_id),
                data_inicio: dataInicio.toISOString(),
                data_fim: dataFim.toISOString(),
                total_potencia,
                potencia_maxima,
                total_leituras
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar leituras do inversor.' });
        }
    }
    
};

export default GenerationInverterRangeData;
