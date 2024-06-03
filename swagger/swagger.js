// swagger在线网站：https://editor.swagger.io/#

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const path = require('path')

const swaggerInit = (app) => {
  //options是swaggerJSDoc的配置项
  const swaggerDefinition  = {
    openapi: '3.0.0',
      info: {
        title: '代币交易、新币监控api文档',
        version: '1.0.0',
        description: 'solana等api文档',
      },
      servers: [
        {
          url: 'http://localhost:18001', // API 服务器地址
          description: '开发服务器',
        },
        {
          url:"http://127.0.0.1:18001", // 后期更换ip
          description: '测试服务器',
        },
      ],
  }
  // Options for the swagger docs
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: ['./api/sol/swagger/*.js'], 
};
  const swaggerSpec = swaggerJSDoc(options)

  // 可以访问 xxx/swagger.json 看到生成的swaggerJSDoc
  app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  // 可以访问 xxx/docs 看到生成的swagger接口文档
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = swaggerInit