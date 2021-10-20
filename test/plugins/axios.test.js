/**
 * @fileOverview axios插件测试
 * @name axios.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { MODULE_KEY, AxiosPlugin, defineAxios } = require('../../plugins/axios');
const { Provider, injectMetadata } = require('brick-engine');
const faker = require('faker');

describe('plugins/axios', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-axios:plugins:AxiosPlugin');
  });

  describe('AxiosPlugin', () => {

    /** @type {Provider} **/
    let provider;

    /** @type {AxiosPlugin} **/
    let plugin;

    beforeEach(() => {

      provider = new Provider();
      plugin = new AxiosPlugin(provider);

    });

    describe('defineWinston', () => {

      it('fatal', () => {

        const target = () => { };
        const WRONG_METADATA = `[${MODULE_KEY}] defineAxios Error:  wrong metadata args`;

        expect(() => defineAxios(target)).toThrow(WRONG_METADATA);
        expect(() => defineAxios(target, Symbol())).toThrow(WRONG_METADATA);
        expect(() => defineAxios(target, { id: null })).toThrow(WRONG_METADATA);
        expect(() => defineAxios(target, { id: Symbol(), config: Symbol() })).toThrow(WRONG_METADATA);
        expect(() => defineAxios(target, { id: Symbol(), interceptors: Symbol() })).toThrow(WRONG_METADATA);

      });

    });


    describe('match', () => {

      it('success', () => {

        const target = () => { };
        defineAxios(target, { id: Symbol() });

        const res = plugin.match(target);
        expect(res).toBeTruthy();

        const target1 = () => { };
        defineAxios(target1, {
          id: Symbol(),
          config: JSON.parse(faker.datatype.json()),
        });

        const res1 = plugin.match(target1);
        expect(res1).toBeTruthy();

      });

      it('failed', () => {

        const target = () => { };
        const metadata = Symbol('metadata');
        injectMetadata(target, metadata, { scope: Symbol() });

        const res = plugin.match(target);
        expect(res).toBeFalsy();

      });

    });

    describe('use', () => {

      it('simple', async () => {

        const defineFn = jest.spyOn(provider, 'define');
        const id = Symbol('id');
        const target = () => { };

        defineAxios(target, { id });

        await plugin.use(target);

        expect(defineFn).toBeCalledTimes(1);
        expect(defineFn).toBeCalledWith(id, [], expect.anything());

      });

      it('interceptor', async () => {

        const request = jest.fn();
        const response = jest.fn();
        const requestId = Symbol('requestId');
        const responseId = Symbol('responseId');
        const id = Symbol('id');
        const target = () => { };

        request.mockReturnValue({ type: 'request', fulfilled: () => {}, rejected: () => {} });
        response.mockReturnValue({ type: 'response', fulfilled: () => {}, rejected: () => {} });
        provider.define(requestId, [], request);
        provider.define(responseId, [], response);
        defineAxios(target, { id, interceptors: [ requestId, responseId ] });

        await plugin.use(target);
        await provider.require({ id });

        expect(request).toBeCalledTimes(1);
        expect(response).toBeCalledTimes(1);
      });

      it('interceptor error', async () => {

        const factory = jest.fn();
        const interceptorId = Symbol('interceptorId');
        const type = faker.datatype.uuid();
        const id = Symbol('id');
        const target = () => { };

        factory.mockReturnValue({ type });
        provider.define(interceptorId, [], factory);
        defineAxios(target, { id, interceptors: [ interceptorId ] });

        await plugin.use(target);

        const WRONG_INTERCEPTOR_TYPE = `[${MODULE_KEY}] createAxios Error: wrong interceptor type ${type}`;

        await expect(provider.require({ id })).rejects.toThrow(WRONG_INTERCEPTOR_TYPE);
        expect(factory).toBeCalledTimes(1);

      });

    });

  });

});

