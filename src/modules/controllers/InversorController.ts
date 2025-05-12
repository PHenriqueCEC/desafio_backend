import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Inversor from '../models/Inversor';

interface MongoServerError extends Error {
    code?: number;
    keyValue?: Record<string, any>;
}

const InversorController = {
   
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { inversor_id, inversor_localizacao } = req.body;

            if(!inversor_id) {
                return res.status(400).json({ error: 'O campo inversor_id é obrigatório!' });
            }

            if(!inversor_localizacao) {
                return res.status(400).json({ error: 'O campo inversor_localizacao é obrigatório'})
            }

            const newInversor = await Inversor.create({ inversor_id, inversor_localizacao });
            return res.status(201).json(newInversor);

        } catch (error: unknown) {
            if(isMongoServerError(error) && error.code === 11000) {
                return res.status(409).json({ error: "inversor_id já existente!"})
            }

            if(error instanceof Error) {
                return next(error);
            }

            return next(new Error('Erro desconhecido!'))
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { inversor_id } = req.params;
            const updateLocalizacao = req.body;

            if(!inversor_id) {
                return res.status(400).json({ error: 'inversor_id é obrigatório!'});
            }

            if(updateLocalizacao.id) {
                return res.status(400).json({ error: 'Não é permitido alterar o inversor_id'});
            }

            const updateInversor = await Inversor.findOneAndUpdate(
                { inversor_id },
                updateLocalizacao,
                { new: true, runValidators: true}
            );

            if(!updateInversor) { 
                return res.status(404).json({ error: "Inversor não encontrado!"});
            }

            return res.status(200).json(updateInversor);

        } catch(error: unknown) {
            if(error instanceof mongoose.Error.ValidationError) {
                return res.status(400).json({ error: error.message});
            }

            if(error instanceof Error) {
                return next(error);
            }
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { inversor_id } = req.params; // Assuming you're passing the ID as a URL parameter
    
            if (!inversor_id) {
                return res.status(400).json({ error: 'O campo inversor_id é obrigatório!' });
            }
    
            const deletedInversor = await Inversor.findOneAndDelete({ inversor_id });
    
            if (!deletedInversor) {
                return res.status(404).json({ error: 'Inversor não encontrado!' });
            }
    
            return res.status(200).json({ message: 'Inversor deletado com sucesso!', deletedInversor });
    
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next(error);
            }
    
            return next(new Error('Erro desconhecido ao deletar inversor!'));
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const inversor = await Inversor.find();
            return res.status(200).json(inversor);
        } catch (error: unknown) {
            if(error instanceof Error) {
                return next(error)
            }
        }

        return next(new Error('Erro desconhecido ao buscar inversor'))
    },

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { inversor_id } = req.params;

            if(!inversor_id) {
                return res.status(400).json({ error: 'inversor_id é obrigatório!'});
            }

            const inversor = await Inversor.findOne({ inversor_id })

            if(!inversor) {
                return res.status(404).json({ error: 'Inversor não encontrado'})
            }

            return res.status(200).json(inversor);

        } catch(error: unknown) {
            if(error instanceof Error) {
                return next(error);
            }
        }

        return next(new Error('Erro desconhecido ao buscar inversor'))
    }
};

function isMongoServerError(error: unknown): error is MongoServerError {
    return error instanceof Error && 'code' in error;
}

export default InversorController;

