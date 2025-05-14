import express, { RequestHandler } from 'express';
import PlantsController from '../../../modules/controllers/PlantsController';
import InversorController from '../../../modules/controllers/InversorController';
import GenerationInverterRangeData from '../../../modules/controllers/GenerationInverterRangeData';
import AverageTemperaturePerDay from '../../../modules/controllers/AverageTemperaturePerDay'
import MaximumPowerDay from '../../../modules/controllers/MaximumPowerDay';
import PlantGenerationDateRange from '../../../modules/controllers/PlantGenerationDateRangeController';


const routes = express.Router();

/**
 * @swagger
 * /plants:
 *   post:
 *     summary: Cria uma nova usina (usina solar)
 *     tags:
 *       - Plants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 7
 *               name:
 *                 type: string
 *                 example: Nova Usina
 *     responses:
 *       201:
 *         description: Planta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: Requisição inválida (dados ausentes ou mal formatados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: O campo name é obrigatório
 *             examples:
 *               Campo name ausente:
 *                 summary: Exemplo de requisição com campo ausente
 *                 value:
 *                   error: O campo name é obrigatório
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao salvar a planta no banco de dados
 *             examples:
 *               Erro interno:
 *                 summary: Exemplo de erro de servidor
 *                 value:
 *                   error: Erro ao salvar a planta no banco de dados
 */

routes.post("/plants", PlantsController.create as RequestHandler);
/**
 * @swagger
 * /plants:
 *   get:
 *     summary: Lista todas as usinas cadastradas
 *     tags:
 *       - Plants
 *     responses:
 *       200:
 *         description: Lista de usinas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Usina Solar A
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar a lista de usinas no banco de dados
 */

routes.get("/plants", PlantsController.getAll as RequestHandler); 
/**
 * @swagger
 * /plants/{id}:
 *   get:
 *     summary: Retorna os dados de uma usina específica
 *     tags:
 *       - Plants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da usina
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Dados da usina encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 7
 *                 name:
 *                   type: string
 *                   example: Nova Usina
 *       404:
 *         description: Usina não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usina com ID 7 não encontrada
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar a usina no banco de dados
 */

routes.get("/plants/:id", PlantsController.getOne as RequestHandler);
/**
 * @swagger
 * /plants/{id}:
 *   put:
 *     summary: Atualiza uma usina existente
 *     tags:
 *       - Plants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da usina a ser atualizada
 *         example: 7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nova Usina Atualização
 *     responses:
 *       200:
 *         description: Usina atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: Requisição inválida (dados ausentes ou mal formatados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: O campo name é obrigatório
 *             examples:
 *               Campo name ausente:
 *                 summary: Exemplo de requisição inválida
 *                 value:
 *                   error: O campo name é obrigatório
 *       404:
 *         description: Usina não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usina com ID 7 não encontrada
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao atualizar a usina no banco de dados
 *             examples:
 *               Erro interno:
 *                 summary: Exemplo de erro de servidor
 *                 value:
 *                   error: Erro ao atualizar a usina no banco de dados
 */

routes.put("/plants/:id", PlantsController.update as RequestHandler);
/**
 * @swagger
 * /plants/{id}:
 *   delete:
 *     summary: Remove uma usina existente
 *     tags:
 *       - Plants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da usina a ser removida
 *         example: 7
 *     responses:
 *       200:
 *         description: Usina removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usina removida com sucesso
 *       404:
 *         description: Usina não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usina com ID 7 não encontrada
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao remover a usina no banco de dados
 *             examples:
 *               Erro interno:
 *                 summary: Exemplo de erro de servidor
 *                 value:
 *                   error: Erro ao remover a usina no banco de dados
 */

routes.delete("/plants/:id", PlantsController.delete as RequestHandler);

//INVERSOR ROUTES
/**
 * @swagger
 * /inversor:
 *   post:
 *     summary: Cadastra um novo inversor
 *     tags:
 *       - Inversor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inversor_id
 *               - inversor_localizacao
 *             properties:
 *               inversor_id:
 *                 type: integer
 *                 example: 9
 *               inversor_localizacao:
 *                 type: string
 *                 example: RJ
 *     responses:
 *       201:
 *         description: Inversor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inversor_id:
 *                   type: integer
 *                 inversor_localizacao:
 *                   type: string
 *       400:
 *         description: Requisição inválida (dados ausentes ou mal formatados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: O campo inversor_localizacao é obrigatório
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Erro ao criar o inversor no banco de dados
 */

routes.post("/inversor", InversorController.create as RequestHandler);
/**
 * @swagger
 * /inversor:
 *   get:
 *     summary: Retorna todos os inversores
 *     tags:
 *       - Inversor
 *     responses:
 *       200:
 *         description: Lista de inversores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   inversor_id:
 *                     type: integer
 *                     example: 10
 *                   inversor_localizacao:
 *                     type: string
 *                     example: RJ
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Erro ao buscar os inversores
 */

routes.get("/inversor", InversorController.getAll as RequestHandler); 
/**
 * @swagger
 * /inversor/{inversor_id}:
 *   get:
 *     summary: Retorna os dados de um inversor específico
 *     tags:
 *       - Inversor
 *     parameters:
 *       - in: path
 *         name: inversor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do inversor que será buscado
 *     responses:
 *       200:
 *         description: Dados do inversor retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inversor_id:
 *                   type: integer
 *                   example: 10
 *                 inversor_localizacao:
 *                   type: string
 *                   example: RJ
 *       404:
 *         description: Inversor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Inversor com ID 10 não encontrado
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Erro ao buscar os dados do inversor
 */

routes.get("/inversor/:inversor_id", InversorController.getOne as RequestHandler); 
/**
 * @swagger
 * /inversor/{inversor_id}:
 *   put:
 *     summary: Atualiza a localização de um inversor existente
 *     tags:
 *       - Inversor
 *     parameters:
 *       - in: path
 *         name: inversor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do inversor a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inversor_localizacao
 *             properties:
 *               inversor_localizacao:
 *                 type: string
 *                 example: SP
 *     responses:
 *       200:
 *         description: Inversor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inversor_id:
 *                   type: integer
 *                 inversor_localizacao:
 *                   type: string
 *       400:
 *         description: Requisição inválida (dados ausentes ou mal formatados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: O campo inversor_localizacao é obrigatório
 *       404:
 *         description: Inversor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Inversor com ID 9 não encontrado
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Erro ao atualizar o inversor
 */

routes.put("/inversor/:inversor_id", InversorController.update as RequestHandler);
/**
 * @swagger
 * /inversor/{inversor_id}:
 *   delete:
 *     summary: Remove um inversor existente
 *     tags:
 *       - Inversor
 *     parameters:
 *       - in: path
 *         name: inversor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do inversor a ser removido
 *     responses:
 *       200:
 *         description: Inversor removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Inversor removido com sucesso
 *       404:
 *         description: Inversor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Inversor com ID 9 não encontrado
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Erro ao remover o inversor
 */

routes.delete("/inversor/:inversor_id", InversorController.delete as RequestHandler);

//OUTRAS ROTAS
/**
 * @swagger
 * /geracaoInversorRangeDeData/{inversor_id}/{data_inicio}/{data_fim}:
 *   get:
 *     summary: Retorna a geração máxima de energia de um inversor em um intervalo de datas
 *     tags:
 *       - Geração Inversor
 *     parameters:
 *       - name: inversor_id
 *         in: path
 *         required: true
 *         description: ID do inversor
 *         schema:
 *           type: integer
 *           example: 5
 *       - name: data_inicio
 *         in: path
 *         required: true
 *         description: Data de início do intervalo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-01
 *       - name: data_fim
 *         in: path
 *         required: true
 *         description: Data de fim do intervalo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-31
 *     responses:
 *       200:
 *         description: Geração máxima de energia do inversor no intervalo de datas solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inversor_id:
 *                   type: integer
 *                   example: 5
 *                 data_inicio:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T00:00:00.000Z"
 *                 data_fim:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-31T23:59:59.999Z"
 *                 total_potencia:
 *                   type: integer
 *                   example: 50830775
 *                 potencia_maxima:
 *                   type: integer
 *                   example: 126033
 *                 total_leituras:
 *                   type: integer
 *                   example: 1611
 *       400:
 *         description: Requisição inválida (parâmetros mal formatados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Data de início não pode ser posterior a data final!"
 *       404:
 *         description: Não encontrado (dados não encontrados para o intervalo e inversor especificados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Nenhuma leitura encontrada para os critérios informados."
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Erro ao processar a geração de energia"
 */

routes.get("/geracaoInversorRangeDeData/:inversor_id/:data_inicio/:data_fim", GenerationInverterRangeData.getMaximumInverterPower as unknown as RequestHandler); 
/**
 * @swagger
 * /temperaturaMediaInversor/{inversor_id}/{data_inicio}/{data_fim}:
 *   get:
 *     summary: Retorna a média de temperatura diária de um inversor em um intervalo de datas
 *     tags:
 *       - Temperatura Inversor
 *     parameters:
 *       - name: inversor_id
 *         in: path
 *         required: true
 *         description: ID do inversor
 *         schema:
 *           type: integer
 *           example: 5
 *       - name: data_inicio
 *         in: path
 *         required: true
 *         description: Data de início do intervalo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-01
 *       - name: data_fim
 *         in: path
 *         required: true
 *         description: Data de fim do intervalo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-31
 *     responses:
 *       200:
 *         description: Média de temperatura diária do inversor no intervalo de datas solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inversor_id:
 *                   type: integer
 *                   example: 5
 *                 data_inicio:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T00:00:00.000Z"
 *                 data_fim:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-31T23:59:59.999Z"
 *                 temperaturas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dia:
 *                         type: string
 *                         example: "2025-01-01"
 *                       media_temperatura:
 *                         type: number
 *                         format: float
 *                         example: 29.73
 *       400:
 *         description: Requisição inválida (parâmetros mal formatados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Data de início não pode ser posterior a data final!"
 *       404:
 *         description: Não encontrado (dados não encontrados para o intervalo e inversor especificados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Nenhuma leitura encontrada para os critérios informados."
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Erro ao processar a média de temperatura"
 */

routes.get("/temperaturaMediaInversor/:inversor_id/:data_inicio/:data_fim", AverageTemperaturePerDay.getAverageTemperature as unknown as RequestHandler); 
/**
 * @swagger
 * /potenciaMaximaDia/{inversor_id}/{data_inicio}/{data_fim}:
 *   get:
 *     summary: Retorna a potência máxima diária de um inversor em um intervalo de datas
 *     tags:
 *       - Potência Máxima
 *     parameters:
 *       - name: inversor_id
 *         in: path
 *         required: true
 *         description: ID do inversor
 *         schema:
 *           type: integer
 *           example: 5
 *       - name: data_inicio
 *         in: path
 *         required: true
 *         description: Data de início do intervalo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-01
 *       - name: data_fim
 *         in: path
 *         required: true
 *         description: Data de fim do intervalo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-31
 *     responses:
 *       200:
 *         description: Potência máxima diária do inversor no intervalo de datas solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inversor_id:
 *                   type: integer
 *                   example: 5
 *                 data_inicio:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T00:00:00.000Z"
 *                 data_fim:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-31T23:59:59.999Z"
 *                 maximas_diarias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dia:
 *                         type: string
 *                         example: "2025-01-01"
 *                       potencia:
 *                         type: integer
 *                         example: 126033
 *                 soma_maximas:
 *                   type: integer
 *                   example: 876812
 *       400:
 *         description: Requisição inválida (parâmetros mal formatados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Data de início não pode ser posterior a data final!"
 *       404:
 *         description: Não encontrado (dados não encontrados para o intervalo e inversor especificados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Nenhuma leitura encontrada para os critérios informados."
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Erro ao processar a potência máxima diária"
 */

routes.get("/potenciaMaximaDia/:inversor_id/:data_inicio/:data_fim", MaximumPowerDay.getMaximumPowerDay as unknown as RequestHandler); 
/**
 * @swagger
 * /geracaoUsina/{inversor_id}/{data_inicio}/{data_fim}:
 *   get:
 *     summary: Retorna a geração total da usina em um intervalo de datas e por inversor
 *     tags:
 *       - Geração Usina
 *     parameters:
 *       - name: inversor_id
 *         in: path
 *         required: true
 *         description: ID da usina
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: data_inicio
 *         in: path
 *         required: true
 *         description: Data de início do intervalo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-01
 *       - name: data_fim
 *         in: path
 *         required: true
 *         description: Data de fim do intervalo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-31
 *     responses:
 *       200:
 *         description: Geração total da usina no intervalo de datas solicitado e geração por inversor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usina_id:
 *                   type: integer
 *                   example: 1
 *                 data_inicio:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T00:00:00.000Z"
 *                 data_fim:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-31T23:59:59.999Z"
 *                 soma_total_usina:
 *                   type: integer
 *                   example: 190008230
 *                 soma_por_inversor:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: integer
 *                         example: 1
 *                       total:
 *                         type: integer
 *                         example: 46502028
 *       400:
 *         description: Requisição inválida (parâmetros mal formatados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Data de início não pode ser posterior a data final!"
 *       404:
 *         description: Não encontrado (dados não encontrados para o intervalo e usina especificados)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Nenhuma leitura encontrada para os critérios informados."
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Erro ao processar a geração da usina"
 */

routes.get("/geracaoUsina/:inversor_id/:data_inicio/:data_fim", PlantGenerationDateRange.getPlantGenerationDateRange as unknown as RequestHandler); 





export default routes;