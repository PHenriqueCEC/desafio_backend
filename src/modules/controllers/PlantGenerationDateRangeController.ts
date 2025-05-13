import { Request, Response, NextFunction } from 'express';
import LeituraInversor from '../models/Leitura';

const PlantGenerationDateRange = {
    async getPlantGenerationDateRange(req: Request, res: Response, next:NextFunction) {
        try {
            const {inversor_id, data_inicio, data_fim } = req.params;

            if(!inversor_id || !data_inicio || !data_fim) {
                return res.status(400).json({
                    error: 'Os parâmetros "inversor_id", "data_inicio" e "data_fim" são obrigatórios'
                })
            }

            let inversores: number[] = [];
            if(Number(inversor_id) === 1) {
                inversores = [1, 2, 3, 4]
            }

            else if(Number(inversor_id) === 2) {
                inversores = [5, 6, 7, 8]
            }

            else {
                return res.status(400).json({ error: 'ID Usina inválido' })
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
                    inversor_id: { $in: inversores },
                    datetime: { $gte: dataInicio, $lte: dataFim }
                  }
                },
                {
                  $facet: {
                    soma_total_usina: [
                      { $group: { _id: null, total: { $sum: "$potencia_ativa_watt" } } }
                    ],
                    soma_por_inversor: [
                      { $group: { _id: "$inversor_id", total: { $sum: "$potencia_ativa_watt" } } },
                      { $sort: { _id: 1 } }
                    ]
                  }
                }
              ])

            if (resultado.length === 0) {
                return res.status(404).json({ message: 'Nenhuma leitura encontrada para os critérios informados.' });
            }

            const resultadoFormatado = resultado[0];

            const somaTotal = resultadoFormatado.soma_total_usina[0]?.total || 0;
            const somaPorInversor = resultadoFormatado.soma_por_inversor || [];
            
            return res.status(200).json({
                usina_id: Number(inversor_id),
                data_inicio: dataInicio.toISOString(),
                data_fim: dataFim.toISOString(),
                soma_total_usina: somaTotal,
                soma_por_inversor: somaPorInversor
            });


        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar potência máxima diária do inversor.' })
        }
    }
}

export default PlantGenerationDateRange