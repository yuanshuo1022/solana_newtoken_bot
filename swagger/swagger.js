// swagger.js

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 定义
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'solana打新后端程序',
    version: '1.0.0',
    description: 'sol监控新币、swap等API',
  },
  servers: [
    {
      url: 'http://localhost:18001', // API 服务器地址
      description: '开发服务器',
    },
  ],
};

// Swagger 配置选项
const options = {
  swaggerDefinition,
  apis: ['../api/**/*.js'], // 写你 API 路由文件的路径
};

// 初始化 swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
