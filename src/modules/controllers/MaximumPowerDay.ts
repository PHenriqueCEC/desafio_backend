import { Request, Response, NextFunction } from 'express';
import LeituraInversor from '../models/Leitura';

const MaximumPowerDay = {
    async getMaximumPowerDay(req: Request, res: Response, next: NextFunction) {
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
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            dia: { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } }
                        },
                        max_potencia_dia: { $max: "$potencia_ativa_watt" }
                    }
                },
                {
                    $sort: { "_id.dia": 1 }
                },
                {
                    $group: {
                        _id: null,
                        maximas_diarias: {
                            $push: {
                                dia: "$_id.dia",
                                potencia: "$max_potencia_dia"
                            }
                        },
                        soma_maximas: { $sum: "$max_potencia_dia" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        maximas_diarias: 1,
                        soma_maximas: 1
                    }
                }
            ]);
    
            if (resultado.length === 0) {
                return res.status(404).json({ message: 'Nenhuma leitura encontrada para os critérios informados.' });
            }
    
            const { maximas_diarias, soma_maximas } = resultado[0];
    
            return res.status(200).json({
                inversor_id: Number(inversor_id),
                data_inicio: dataInicio.toISOString(),
                data_fim: dataFim.toISOString(),
                maximas_diarias,
                soma_maximas
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar potência máxima diária do inversor.' });
        }
    }
    
    
}

export default MaximumPowerDay