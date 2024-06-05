const axios = require('axios');
const fetch = require('cross-fetch');
/**
* http请求、重试机制
* @param {json} config 配置请求参数
* @param {int} maxRetries 最大重试次数
* @param {int} retryDelay 重试间隔时间 ms
* @returns {json} response.data
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


/**
* http请求
* @param {string} url 配置请求参数
* @returns {json} response
*/
async function fetchResJson(url) {
    try {
        console.log("请求url:", url)
        const response = await fetch(url);
        // 检查网络请求是否成功
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }
        // 解析 JSON 数据
        const data = await response.json();
        return data;
    } catch (error) {
        // 可以在这里处理错误日志记录或其他操作
        console.error('Fetching JSON data failed:', error);
        throw error;
    }
}
/**
* 解析json中的url
* @param {Json}  请求toen元数据json
* @returns {json} 社交信息json
*/
async function parseTokenJson(tokenJson) {
    let jsonData = {
    };
    jsonData.is_pump = false;
    if (tokenJson.createdOn && tokenJson.createdOn.includes("pump.fun")) {
        jsonData.is_pump = true;
    }
    if (tokenJson.twitter || tokenJson.X) {
        jsonData.twitter = tokenJson.twitter || tokenJson.X;
    }
    if (tokenJson.telegram || tokenJson.TG) {
        jsonData.telegram = tokenJson.telegram || tokenJson.TG;
    }
    if (tokenJson.website || tokenJson.site) {
        jsonData.website = tokenJson.website || tokenJson.site;
    }
    if (tokenJson.discord) {
        jsonData.discord = tokenJson.discord;
    }

    // 解析JSON
    const data = tokenJson;
    // 提取description中的URL
    const description = data.description;
    if(!description){
        return jsonData;
    }
    // 查找URL的正则表达式
    const urlRegex = /https?:\/\/\S+/g;
    const urls = description.match(urlRegex);

    // 判断是否是Twitter和Telegram的地址
    if (urls) {
        urls.forEach(url => {
            if (url.includes("t.me") || url.includes("tg.me")) {
                jsonData.telegram = url;
                console.log(`Telegram address: ${url}`);
            } else if (url.includes("x.com") || url.includes("twitter.com")) {
                jsonData.twitter = url;
            } else if (url.includes("discord.com")) {
                jsonData.discord = url
            } else {
                jsonData.website = url
            }
        });
    }
    return jsonData;
}
/**
* 判断是否相等
* @param {T}  校验信息
* @param {T}  校验信息
* @returns {T} 相等返回param1，不相等返回param2
*/
async function isEquals(verifyInfo, conInfo, param1, param2) {
    if (verifyInfo == conInfo) {
        return param1;
    } else {
        return param2;
    }
}
/**
* 判断是否是同一地址
* @param {string}  账户地址
* @param {string}  账户地址
* @returns {bool} 
*/
async function isEqualsAddress(Address1, Address2) {
    if (Address1.toLowerCase() == Address2.toLowerCase()) {
        return true
    }
    return false
}


module.exports =
{
    fetchWithRetry,
    parseTokenJson,
    isEqualsAddress,
    isEquals,
    fetchResJson
}