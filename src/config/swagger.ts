import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Usinas e Inversores',
    version: '1.0.0',
    description: 'Documentação automática com Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
    },
  ],
};

// Configuração do swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['src/shared/infra/routes/index.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
