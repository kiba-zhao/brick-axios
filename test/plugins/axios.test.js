/**
 * @fileOverview axios插件测试
 * @name axios.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const {MODULE_KEY,AxiosPlugins,defineAxios} = require('../../plugins/axios');
const { Provider, injectMetadata } = require('brick-engine');
const faker = require('faker');

describe('plugins/axios',()=>{
  
  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-axios:plugins:AxiosPlugin');
  });

  describe('AxiosPlugin',()=>{

    /** @type {Provider} **/
    let provider;

    /** @type {KoaErrorPlugin} **/
    let plugin;

    beforeEach(() => {

      provider = new Provider();
      plugin = new AxiosPlugins(provider);

    });

    describe('match',()=>{

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

    describe('use',()=>{

      it('simple', async () => {

        const defineFn = jest.spyOn(provider, 'define');
        const id = Symbol('id');
        const target = () => { };

        defineAxios(target, { id });

        await plugin.use(target);

        expect(defineFn).toBeCalledTimes(1);
        expect(defineFn).toBeCalledWith(id, [], expect.anything());

      });
      
    });
    
  });
  
});
