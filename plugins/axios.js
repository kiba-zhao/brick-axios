/**
 * @fileOverview axios插件
 * @name axios.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * @module
 */

const assert = require('assert');
const {PACKAGE_NAME} = require('../lib/constants');
const {Provider,isProviderStoreKey,createExtractFunction,createDefineFunction} = require('brick-engine');
const { EngineModule,ProviderStoreKey} = require('brick-engine'); // eslint-disable-line no-unused-vars
const axios = require('axios');
const {AxiosRequestConfig} = require('axios'); // eslint-disable-line no-unused-vars
const {isObject} = require('lodash');

const MODULE_KEY = `${PACKAGE_NAME}:plugins:AxiosPlugin`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

const AXIOS_SCOPE = Symbol('AXIOS_SCOPE');
const AXIOS_PROVIDER = Symbol('AXIOS_PROVIDER');

const extractAxiosMetadataQueue = createExtractFunction('extractAxiosMetadataQueue', { scope: AXIOS_SCOPE });

/**
 * axios元数据
 *  @typedef {Object} AxiosMetadata
 * @property {ProviderStoreKey} [id] axios提供器id
 * @property {AxiosRequestConfig} [config] axios配置
 *
 */

class AxiosPlugins {

  /**
   * 组件处理插件构造函数
   * @class
   * @param {Provider} provider 提供器
   */
  constructor(provider) {

    assert(
      provider instanceof Provider,
      `[${MODULE_KEY}] constructor Error: wrong provider`
    );

    this[AXIOS_PROVIDER] = provider;

  }

  /**
   *检查是否为匹配模块
   * @param {EngineModule} module 检查的模块
   * @return {boolean} true:匹配/false:不匹配
   */
  match(module) {

    debug('match %s', module);

    const metadataQueue = extractAxiosMetadataQueue(module);
    if (metadataQueue.length > 0) {
      return metadataQueue.every(isAxiosMetadata);
    }
    return false;

  }

  /**
   * 使用模块方法
   * @param {EngineModule} module 使用的模块
   */
  async use(module) {

    debug('use %s', module);

    /** @type {Provider} **/
    const provider = this[AXIOS_PROVIDER];
    /** @type {AxiosMetadata[]} **/
    const metadataQueue = extractAxiosMetadataQueue(module);
    for (const metadata of metadataQueue) {
      const { id, config } = metadata;
      provider.define(id || module,[],axios.create.bind(this,config || {}));
    }
  }
  
}

exports.AxiosPlugins = AxiosPlugins;

/**
 * 是否为axios元数据
 * @param {AxiosMetadata} metadata 元数据
 * @return {boolean} true:是/false:否
 */
function isAxiosMetadata(metadata) {
  
  debug('isAxiosMetadata %s', metadata);

  if (!isObject(metadata)) {
    return false;
  }

  if (metadata.id !== undefined && !isProviderStoreKey(metadata.id)) {
    return false;
  }

  if (metadata.config !== undefined && !isAxiosConfig(metadata.config)) {
    return false;
  }

  return true;
}

/**
 * 是否为axios配置
 * @param {AxiosRequestConfig} config
 * @return {boolean} true:是/false:否
 */
function isAxiosConfig(config) {
  return isObject(config);
}


/**
 * @see {@link module:lib/engine~EngineModule} 引擎模块类型
 * @see {@link module:plugins/axios~AxiosMetadata} axios元数据
 * @type {function(EngineModule,KoaErrorMetadata):EngineModule}
 */
const _defineAxios = createDefineFunction('defineAxios', { scope: AXIOS_SCOPE });


/**
 * 定义axios元数据
 * @see {@link module:lib/engine~EngineModule} 引擎模块类型
 * @see {@link module:plugins/axios~AxiosMetadata} axios元数据
 * @param {EngineModule} target 引擎模块对象
 * @param {...AxiosMetadata} metadatas axios元数据
 * @return {EngineModule} 引擎模块对象
 */
function defineAxios(target, ...metadatas) {

  debug('defineAxios: %s, %s', target, metadatas);

  assert(
    metadatas.length > 0 && metadatas.every(isAxiosMetadata),
    `[${MODULE_KEY}] defineAxios Error:  wrong metadata args`
  );

  return _defineAxios(target, ...metadatas);
}

exports.defineAxios = defineAxios;
