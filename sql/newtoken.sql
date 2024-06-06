/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80031
 Source Host           : localhost:3306
 Source Schema         : newtoken

 Target Server Type    : MySQL
 Target Server Version : 80031
 File Encoding         : 65001

 Date: 06/06/2024 13:59:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for price_data
-- ----------------------------
DROP TABLE IF EXISTS `price_data`;
CREATE TABLE `price_data`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `mint` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '代币地址',
  `start_price` decimal(20, 14) NULL DEFAULT NULL COMMENT '开始5min 收盘价',
  `end_price` decimal(20, 14) NULL DEFAULT NULL COMMENT '最后5min 收盘价',
  `price_change` decimal(10, 5) NULL DEFAULT NULL COMMENT '涨跌幅',
  `time_diff` decimal(8, 2) NULL DEFAULT NULL COMMENT '分钟',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 191 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for pump_kline
-- ----------------------------
DROP TABLE IF EXISTS `pump_kline`;
CREATE TABLE `pump_kline`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `mint` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '代币地址',
  `timestamp` bigint NULL DEFAULT NULL COMMENT '时间',
  `open` decimal(20, 10) NULL DEFAULT NULL COMMENT '开盘价',
  `high` decimal(20, 10) NULL DEFAULT NULL COMMENT '最高价',
  `low` decimal(20, 10) NULL DEFAULT NULL COMMENT '最低价',
  `close` decimal(20, 10) NULL DEFAULT NULL COMMENT '收盘价',
  `volume` bigint NULL DEFAULT NULL COMMENT '数量',
  `slot` bigint NULL DEFAULT NULL COMMENT '槽',
  `insert_time` datetime NULL DEFAULT NULL COMMENT '插入时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2516 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for pump_newtokens
-- ----------------------------
DROP TABLE IF EXISTS `pump_newtokens`;
CREATE TABLE `pump_newtokens`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `mint` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '代币地址',
  `token_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '代币名称',
  `symbol` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '代币符号',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '描述',
  `image_uri` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '代币图片路径',
  `metadata_uri` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '元数据路径',
  `twitter` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '推特',
  `telegram` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'tg',
  `bonding_curve` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '曲线账户',
  `associated_bonding_curve` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '关联曲线账户',
  `creator` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '创建者',
  `created_timestamp` bigint NULL DEFAULT NULL COMMENT '创建时间戳',
  `raydium_pool` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'raydium池子账户地址',
  `complete` tinyint(1) NULL DEFAULT NULL COMMENT '是否完成',
  `virtual_sol_reserves` bigint NULL DEFAULT NULL COMMENT '虚拟sol储备量',
  `virtual_token_reserves` bigint NULL DEFAULT NULL COMMENT '虚拟代币储备量',
  `total_supply` bigint NULL DEFAULT NULL COMMENT '供应量',
  `website` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '官方网站',
  `show_name` tinyint(1) NULL DEFAULT NULL COMMENT '展示名字',
  `king_of_the_hill_timestamp` bigint NULL DEFAULT NULL,
  `market_cap` decimal(18, 8) NULL DEFAULT NULL COMMENT '市值',
  `nsfw` tinyint(1) NULL DEFAULT NULL COMMENT '是否不适合工作时观看内容',
  `market_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `inverted` tinyint(1) NULL DEFAULT NULL,
  `usd_market_cap` decimal(18, 8) NULL DEFAULT NULL COMMENT '市值usdt',
  `insert_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '插入时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mint`(`mint` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1059 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for raydium_newpool
-- ----------------------------
DROP TABLE IF EXISTS `raydium_newpool`;
CREATE TABLE `raydium_newpool`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `token_address` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '代币合约地址',
  `lp_address` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'lp地址',
  `pool_open_time` bigint NULL DEFAULT NULL COMMENT '开始交易时间戳',
  `supply` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '供应量',
  `decimals` int NOT NULL COMMENT '精度',
  `pool_amount` decimal(30, 9) NULL DEFAULT NULL COMMENT '流动性池储备',
  `pool_actual_supply` decimal(30, 9) NULL DEFAULT NULL COMMENT '实际流动性池储备',
  `is_mint` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '是否有mint权限',
  `is_freeze` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '是否有冻结权限',
  `burn_pct` int NULL DEFAULT NULL COMMENT 'burn百分比',
  `burn_amount` decimal(30, 5) NULL DEFAULT NULL COMMENT 'burn数量',
  `twitter` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `telegram` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `discord` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `website` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_pump` tinyint NULL DEFAULT NULL COMMENT '是否是pump',
  `insert_time` datetime NULL DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `token_address`(`token_address` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4223 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '机器人-被跟单地址买卖记录表' ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
