import express, { RequestHandler } from 'express';
import PlantsController from '../../../modules/controllers/PlantsController';
import InversorController from '../../../modules/controllers/InversorController';

const routes = express.Router();

// PLANTS ROUTES
routes.post("/plants", PlantsController.create as RequestHandler);
routes.get("/plants", PlantsController.getAll as RequestHandler); 
routes.get("/plants/:id", PlantsController.getOne as RequestHandler); 
routes.put("/plants/:id", PlantsController.update as RequestHandler);
routes.delete("/plants/:id", PlantsController.delete as RequestHandler);

//INVERSOR ROUTES
routes.post("/inversor", InversorController.create as RequestHandler);
routes.get("/inversor", InversorController.getAll as RequestHandler); 
routes.get("/inversor/:inversor_id", InversorController.getOne as RequestHandler); 
routes.put("/inversor/:inversor_id", InversorController.update as RequestHandler);
routes.delete("/inversor/:inversor_id", InversorController.delete as RequestHandler);

export default routes;