const { Connection} = require('@solana/web3.js');

class RPCConnector {
    //构造函数
    constructor(endpoints) {
        this.endpoints = endpoints;
        this.currentEndpointIndex = 0;
    }
    //连接rpc
    async connect() {
        const currentEndpoint = this.endpoints[this.currentEndpointIndex];
        try {
            const connection = new Connection(currentEndpoint);
            const slot = await connection.getSlot();
            console.log("当前高度：",slot)
            console.log('Connected to RPC server:', currentEndpoint);
            return connection;
        } catch (error) {
            console.error('Connection to', currentEndpoint, 'failed:', error);
            // 切换到下一个节点
            new Promise(resolve => setTimeout(resolve, 2000));
            this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
            return this.connect(); // 递归调用连接方法
        }
    }
}
/**
* 获取连接器
* @param {string[]} endpoints rpc节点数组
* @returns {RPCConnector} rpc连接器
*/
async function rpcConnector(endpoints){
    const rpcConnector = new RPCConnector(endpoints);
    return rpcConnector;
}
/**
* 连接rpc
* @param {string[]} endpoints rpc节点数组
* @returns {Connect} rpc连接
*/
async function connection(endpoints){
    const rpcConnector = new RPCConnector(endpoints);
    return rpcConnector.connect();
}

module.exports={connection,rpcConnector}