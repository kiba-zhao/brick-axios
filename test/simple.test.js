/**
 * @fileOverview 简单示例测试
 * @name simple.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const {axiosSetup,defineAxios} = require('..');
const { createEngine, Provider } = require('brick-engine');
const { Engine } = require('brick-engine'); // eslint-disable-line no-unused-vars
const {AxiosInstance,AxiosError} = require('axios'); // eslint-disable-line no-unused-vars
const nock = require('nock');
const faker = require('faker');

const AXIOS_ID = Symbol('AXIOS_ID');

describe('simple',()=>{

  /** @type {Provider} **/
  let provider;
  
  beforeEach(async () => {
    
    provider = new Provider();
    const engine = await createEngine(provider);

    const target = {};
    axiosSetup(target);
    defineAxios(target,{id:AXIOS_ID,config:{baseURL:faker.internet.url()}});
    await engine.install(target);

    expect(provider.contains(AXIOS_ID)).toBeTruthy();
  });

  it('get',async ()=>{

    /** @type {AxiosInstance[]} **/
    const [axios] = await provider.require({id:AXIOS_ID});
    
    const path = `/${faker.random.word()}`;
    const body = JSON.parse(faker.datatype.json());

    nock(axios.defaults.baseURL)
      .get(path)
      .reply(200,body);
    
    const res = await axios.get(path);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(body);
  });

  it('post',async ()=>{

    /** @type {AxiosInstance[]} **/
    const [axios] = await provider.require({id:AXIOS_ID});
    
    const path = `/${faker.random.word()}`;
    const body = JSON.parse(faker.datatype.json());
    const resBody = JSON.parse(faker.datatype.json());

    nock(axios.defaults.baseURL)
      .post(path,body)
      .reply(201,resBody);
    
    const res = await axios.post(path,body);
    expect(res.status).toBe(201);
    expect(res.data).toEqual(resBody);
  });

    it('post Error',async ()=>{

    /** @type {AxiosInstance[]} **/
    const [axios] = await provider.require({id:AXIOS_ID});
    
    const path = `/${faker.random.word()}`;
    const body = JSON.parse(faker.datatype.json());
    const resBody = faker.random.words();

    nock(axios.defaults.baseURL)
      .post(path,body)
        .reply(500,resBody);

      /** @type {AxiosError} **/
      let error;
      try {
        await axios.post(path, body);
      } catch (e) {
        error = e;
      }

      expect(error.response.status).toBe(500);
      expect(error.response.data).toEqual(resBody);
  });

  
  
});
