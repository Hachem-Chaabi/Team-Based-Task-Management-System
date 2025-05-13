import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'API Documentation',
    description: 'This is the API documentation',
    version: '1.0.0',
    contact: {
      name: 'Hachem Chaabi',
    },
  },
  servers: [
    {
      url: 'https://team-based-task-management-system.onrender.com',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/docs/**/*.yaml'],
};

export default swaggerJSDoc(options);
