import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Plant from '../models/Plant';

interface MongoServerError extends Error {
    code?: number;
    keyValue?: Record<string, any>;
}

const PlantsController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, name } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'O campo id é obrigatório' });
            }

            if (!name) {
                return res.status(400).json({ error: 'O campo name é obrigatório' });
            }

            const newPlant = await Plant.create({ id, name });
            return res.status(201).json(newPlant);
        } catch (error: unknown) {
            if (isMongoServerError(error) && error.code === 11000) {
                return res.status(409).json({ error: 'Id de usina já existente!' });
            }

            if (error instanceof Error) {
                return next(error);
            }

            return next(new Error('Erro desconhecido'));
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({ error: 'ID da usina é obrigatório' });
            }

            if (updateData.id) {
                return res.status(400).json({ error: 'Não é permitido alterar o ID da usina' });
            }

            const updatedPlant = await Plant.findOneAndUpdate(
                { id },
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedPlant) {
                return res.status(404).json({ error: 'Usina não encontrada' });
            }

            return res.status(200).json(updatedPlant);
        } catch (error: unknown) {
            if (error instanceof mongoose.Error.ValidationError) {
                return res.status(400).json({ error: error.message });
            }

            if (error instanceof Error) {
                return next(error);
            }

            return next(new Error('Erro desconhecido ao atualizar usina'));
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID da usina é obrigatório' });
            }

            const deletedPlant = await Plant.findOneAndDelete({ id });

            if (!deletedPlant) {
                return res.status(404).json({ error: 'Usina não encontrada' });
            }

            return res.status(200).json({ message: 'Usina removida com sucesso' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next(error);
            }

            return next(new Error('Erro desconhecido ao remover usina'));
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const plants = await Plant.find();
            return res.status(200).json(plants);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next(error);
            }

            return next(new Error('Erro desconhecido ao buscar usinas'));
        }
    },

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID da usina é obrigatório' });
            }

            const plant = await Plant.findOne({ id });

            if (!plant) {
                return res.status(404).json({ error: 'Usina não encontrada' });
            }

            return res.status(200).json(plant);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next(error);
            }

            return next(new Error('Erro desconhecido ao buscar usina'));
        }
    },
};

function isMongoServerError(error: unknown): error is MongoServerError {
    return error instanceof Error && 'code' in error;
}

export default PlantsController;
