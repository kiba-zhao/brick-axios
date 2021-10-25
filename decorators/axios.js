/**
 * @fileOverview axios装饰器工厂
 * @name axios.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { EngineModule } = require('brick-engine'); // eslint-disable-line no-unused-vars
const { defineAxios } = require('../plugins/axios');
const { PACKAGE_NAME } = require('../lib/constants');

const MODULE_KEY = `${PACKAGE_NAME}:decorators:Axios`;
const debug = require('debug')(MODULE_KEY);


/**
 * axios装饰器工厂方法
 * @param {...AxiosMetadata} metadatas axios元数据
 * @return {function(EngineModule):void} axios装饰器
 */
function Axios(...metadatas) {

  debug('Axios %s', metadatas);

  return function(target) {
    defineAxios(target, ...metadatas);
  };

}

exports.Axios = Axios;
