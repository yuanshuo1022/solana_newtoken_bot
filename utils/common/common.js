const axios = require('axios');

  /**
 * http请求、重试机制
 * @param {json} config 配置请求参数
 * @param {int} maxRetries 最大重试次数
 * @param {int} retryDelay 重试间隔时间 ms
 * @returns {json} 社交信息
 */
async function fetchWithRetry(config, maxRetries = 3, retryDelay = 1000) {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            let response = await axios.request(config);
            return response.data;
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts} failed: ${error.message}`);
            if (attempts >= maxRetries) {
                throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}



module.exports={fetchWithRetry}