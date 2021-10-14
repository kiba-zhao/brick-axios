# brick-axios #
基于[brick-engine](https://github.com/kiba-zhao/brick-engine)的[axios](https://github.com/axios/axios)工具包.

## Install ##

``` shell
npm install --save brick-axios
```

## Usage ##

**Setup**

``` javascript

const {defineApplication} = require('brick-engine');
const {axiosSetup} = require('brick-axios');

const app = {};

axiosSetup(app);
defineApplication(exports, app);
```

**Define Axios Instance**

``` javascript

const { defineAxios } = require('brick-axios');
const { AXIOS_ID } = require('./constants');

class Module {
    
}

exports.Module = Module;
defineAxios(Module,{id:AXIOS_ID,config:{baseURL:'http://localhost'}});
```

**Use  Axios Instance**

``` javascript

const { AXIOS_ID } = require('./constants');
const { defineProviderFactory } = require('brick-engine');

class Service {

    constructor(axios) {
        this.axios = axios;
    }

    async create(entity){
        const res = await this.axios.post('/simple');
        return res.data;
    }
}

exports.Service = Service;
defineProviderFactory(Service,{deps:[{id:AXIOS_ID}]});

```
## Documentations ##
使用`jsdoc`生成注释文档

``` shell
git clone https://github.com/kiba-zhao/brick-axios.git
cd brick-axios
npm install
npm run docs
open docs/index.html
```

## License ##
[MIT](LICENSE)
