const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 18100 });

class WebSocketService {
    constructor() {
        this.heartbeatInterval = 30000; // 每30秒发送一个ping
    }

    async startServer() {
        server.on('connection', (client) => {
            console.log('Client connected');
            this.setupClient(client);
        });
    }

    setupClient(client) {
        client.isAlive = true;

        client.on('pong', () => {
            client.isAlive = true;
        });

        client.on('message', (message) => {
            console.log(`Received message => ${message}`);
        });

        client.on('close', () => {
            console.log('Client disconnected');
        });
    }

    async broadcastMessage(message) {
        try {
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                    console.log("Message sent successfully:", message);
                }
            });
        } catch (error) {
            console.error("Failed to send message:", error);
            return error;
        }
    }

    startHeartbeat() {
        setInterval(() => {
            server.clients.forEach(client => {
                if (!client.isAlive) {
                    return client.terminate();
                }

                client.isAlive = false;
                client.ping(() => {});
            });
        }, this.heartbeatInterval);
    }
}

const webSocketService = new WebSocketService();
webSocketService.startServer();
webSocketService.startHeartbeat();

module.exports = webSocketService;
