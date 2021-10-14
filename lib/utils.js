/**
 * @fileOverview 工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { PACKAGE_NAME } = require('./constants');
const { definePlugin, Provider } = require('brick-engine');
const { AxiosPlugins } = require('../plugins/axios');

const MODULE_KEY = `${PACKAGE_NAME}:lib:utils`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);


/**
 * 安装axios插件
 * @see {@link module:engine/engine~EngineModule} 引擎模块类型
 * @param {EngineModule} module 引擎模块
 */
function axiosSetup(module) {

  debug('axiosSetup %s', module);

  definePlugin(module, { deps: [{ id: Provider }], factory: AxiosPlugins });

}

exports.axiosSetup = axiosSetup;
