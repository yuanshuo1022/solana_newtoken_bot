/**
 * @swagger
 * /sol/price:
 *   get:
 *     summary: 通过代币地址获取代币价格
 *     description: 根据提供的代币地址获取代币的当前价格
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         required: true
 *         description: 代币地址
 *     responses:
 *       200:
 *         description: 成功获取代币价格
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     SOL:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: 代币ID
 *                         mintSymbol:
 *                           type: string
 *                           description: 代币符号
 *                         vsToken:
 *                           type: string
 *                           description: 对比代币地址
 *                         vsTokenSymbol:
 *                           type: string
 *                           description: 对比代币符号
 *                         price:
 *                           type: number
 *                           description: 代币价格
 *                 timeTaken:
 *                   type: number
 *                   description: 请求处理时间
 *             examples:
 *               application/json:
 *                 value:
 *                   data: 
 *                     SOL: 
 *                       id: "So11111111111111111111111111111111111111112"
 *                       mintSymbol: "SOL"
 *                       vsToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
 *                       vsTokenSymbol: "USDC"
 *                       price: 169.250305012
 *                   timeTaken: 0.0012606469972524792
 *       400:
 *         description: 缺少必要参数 ids
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required parameter  ids
 *       502:
 *         description: 错误的网关
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad Gateway
 *                 details:
 *                   type: string
 *                   example: Network response was not ok
 *       500:
 *         description: 内部服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *                 details:
 *                   type: string
 *                   example: An unexpected error occurred
 */


/**
 * @swagger
 * /sol/price-pump:
 *   get:
 *     summary: 获取pump代币的价格K线
 *     description: 获取pump代币的价格K线，返回数组中数据间隔5分钟
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         required: true
 *         description: pump代币地址
 *     responses:
 *       200:
 *         description: 成功抓取
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mint:
 *                     type: string
 *                     description: Token mint address
 *                   timestamp:
 *                     type: integer
 *                     description: Timestamp of the data point
 *                   open:
 *                     type: number
 *                     format: float
 *                     description: Open price
 *                   high:
 *                     type: number
 *                     format: float
 *                     description: High price
 *                   low:
 *                     type: number
 *                     format: float
 *                     description: Low price
 *                   close:
 *                     type: number
 *                     format: float
 *                     description: Close price
 *                   volume:
 *                     type: integer
 *                     description: Volume of tokens traded
 *                   slot:
 *                     type: integer
 *                     description: Slot number
 *             examples:
 *               application/json:
 *                 value:
 *                   - mint: "5wWtyvmmSE75AwqYZWnxoFAUPFLbW52cEyycsDvbJUTW"
 *                     timestamp: 1716824100
 *                     open: 2.7957999999999998e-8
 *                     high: 3.396720858824057e-8
 *                     low: 2.7957999999999998e-8
 *                     close: 3.190863732843416e-8
 *                     volume: 5182343233
 *                     slot: 268273769
 *                   - mint: "5wWtyvmmSE75AwqYZWnxoFAUPFLbW52cEyycsDvbJUTW"
 *                     timestamp: 1716824400
 *                     open: 3.190863732843416e-8
 *                     high: 4.273879679139625e-8
 *                     low: 2.994264202285433e-8
 *                     close: 3.956315611344618e-8
 *                     volume: 10693665276
 *                     slot: 268273915
 *       400:
 *         description: 缺少必要参数ids
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required parameter ids
 *       502:
 *         description: 错误的网关
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad Gateway
 *                 details:
 *                   type: string
 *                   example: Network response was not ok
 *       500:
 *         description: 内部服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *                 details:
 *                   type: string
 *                   example: An unexpected error occurred
 */

/**
 * @swagger
 * /sol/price-by-symbol:
 *   get:
 *     summary: 通过代币symbol获取价格
 *     description: 根据提供的代币symbol获取代币的当前市场价格和相关信息
 *     parameters:
 *       - in: query
 *         name: symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: 代币symbol
 *     responses:
 *       200:
 *         description: 成功获取代币价格
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: 请求的时间戳
 *                     error_code:
 *                       type: integer
 *                       description: 错误代码
 *                     error_message:
 *                       type: string
 *                       nullable: true
 *                       description: 错误消息
 *                     elapsed:
 *                       type: integer
 *                       description: 请求耗时
 *                     credit_count:
 *                       type: integer
 *                       description: 请求消耗的积分
 *                     notice:
 *                       type: string
 *                       nullable: true
 *                       description: 通知信息
 *                 data:
 *                   type: object
 *                   properties:
 *                     SOL:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: 代币ID
 *                         name:
 *                           type: string
 *                           description: 代币名称
 *                         symbol:
 *                           type: string
 *                           description: 代币符号
 *                         slug:
 *                           type: string
 *                           description: 代币标识
 *                         num_market_pairs:
 *                           type: integer
 *                           description: 市场交易对数量
 *                         date_added:
 *                           type: string
 *                           format: date-time
 *                           description: 上市日期
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: 代币标签
 *                         max_supply:
 *                           type: number
 *                           nullable: true
 *                           description: 最大供应量
 *                         circulating_supply:
 *                           type: number
 *                           description: 流通供应量
 *                         total_supply:
 *                           type: number
 *                           description: 总供应量
 *                         is_active:
 *                           type: integer
 *                           description: 是否活跃
 *                         infinite_supply:
 *                           type: boolean
 *                           description: 是否无限供应
 *                         platform:
 *                           type: object
 *                           nullable: true
 *                           description: 平台信息
 *                         cmc_rank:
 *                           type: integer
 *                           description: CMC排名
 *                         is_fiat:
 *                           type: integer
 *                           description: 是否为法币
 *                         self_reported_circulating_supply:
 *                           type: number
 *                           nullable: true
 *                           description: 自报告流通供应量
 *                         self_reported_market_cap:
 *                           type: number
 *                           nullable: true
 *                           description: 自报告市场总值
 *                         tvl_ratio:
 *                           type: number
 *                           nullable: true
 *                           description: TVL比率
 *                         last_updated:
 *                           type: string
 *                           format: date-time
 *                           description: 最后更新时间
 *                         quote:
 *                           type: object
 *                           properties:
 *                             USD:
 *                               type: object
 *                               properties:
 *                                 price:
 *                                   type: number
 *                                   description: 价格
 *                                 volume_24h:
 *                                   type: number
 *                                   description: 24小时交易量
 *                                 volume_change_24h:
 *                                   type: number
 *                                   description: 24小时交易量变化
 *                                 percent_change_1h:
 *                                   type: number
 *                                   description: 1小时价格变化
 *                                 percent_change_24h:
 *                                   type: number
 *                                   description: 24小时价格变化
 *                                 percent_change_7d:
 *                                   type: number
 *                                   description: 7天价格变化
 *                                 percent_change_30d:
 *                                   type: number
 *                                   description: 30天价格变化
 *                                 percent_change_60d:
 *                                   type: number
 *                                   description: 60天价格变化
 *                                 percent_change_90d:
 *                                   type: number
 *                                   description: 90天价格变化
 *                                 market_cap:
 *                                   type: number
 *                                   description: 市场总值
 *                                 market_cap_dominance:
 *                                   type: number
 *                                   description: 市场总值占比
 *                                 fully_diluted_market_cap:
 *                                   type: number
 *                                   description: 完全稀释的市场总值
 *                                 tvl:
 *                                   type: number
 *                                   nullable: true
 *                                   description: TVL
 *                                 last_updated:
 *                                   type: string
 *                                   format: date-time
 *                                   description: 最后更新时间
 *       400:
 *         description: 缺少必要参数  symbol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required parameter  symbol
 *       502:
 *         description: 错误的网关
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad Gateway
 *                 details:
 *                   type: string
 *                   example: Network response was not ok
 *       500:
 *         description: 内部服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *                 details:
 *                   type: string
 *                   example: An unexpected error occurred
 */

/**
 * @swagger
 * /sol/get-amounts:
 *   post:
 *     summary: 获取交易对的最小金额
 *     description: 根据输入和输出代币地址、金额及滑点，获取交易对的最小金额
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inputMint:
 *                 type: string
 *                 description: 输入代币地址
 *                 example: 'So11111111111111111111111111111111111111112'
 *               outputMint:
 *                 type: string
 *                 description: 输出代币地址
 *                 example: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
 *               amount:
 *                 type: number
 *                 description: 输入代币的数量
 *                 example: 1
 *               slippageBps:
 *                 type: number
 *                 description: 滑点，以基点（bps）表示
 *                 example: 0.01
 *     responses:
 *       200:
 *         description: 成功获取交易对的最小金额
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quote:
 *                   type: object
 *                   description: 交易对报价详情
 *                 outputMint:
 *                   type: string
 *                   description: 输出代币地址
 *                 outputMintDecimals:
 *                   type: number
 *                   description: 输出代币的小数位数
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 错误信息
 *       500:
 *         description: 内部服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: 错误信息
 *                 details:
 *                   type: string
 *                   description: 错误详情
 */
module.exports = {}; // 导出一个空对象以确保正确引入
