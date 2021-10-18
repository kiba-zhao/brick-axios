/**
 * @fileOverview 包目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { axiosSetup } = require('./lib/utils');
const { AxiosPlugin, defineAxios } = require('./plugins/axios');

module.exports = {
  axiosSetup,
  AxiosPlugin, defineAxios,
};
