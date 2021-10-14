/**
 * axios拦截器
 */
export type AxiosInterceptor = {
    /**
     * 拦截器类型:request/response
     */
    type: string;
    /**
     * 履行方法
     */
    fulfilled: Function;
    /**
     * 异常方法
     */
    rejected: Function;
};
/**
 * axios元数据
 */
export type AxiosMetadata = {
    /**
     * axios提供器id
     */
    id?: any;
    /**
     * axios配置
     */
    config?: AxiosRequestConfig;
    /**
     * 拦截器提供器Id
     */
    interceptors?: any[];
};
export const MODULE_KEY: string;
/**
 * axios元数据
 *  @typedef {Object} AxiosMetadata
 * @property {ProviderStoreKey} [id] axios提供器id
 * @property {AxiosRequestConfig} [config] axios配置
 * @property {ProviderStoreKey[]} [interceptors] 拦截器提供器Id
 *
 */
export class AxiosPlugins {
    /**
     * 组件处理插件构造函数
     * @class
     * @param {Provider} provider 提供器
     */
    constructor(provider: Provider);
    /**
     *检查是否为匹配模块
     * @param {EngineModule} module 检查的模块
     * @return {boolean} true:匹配/false:不匹配
     */
    match(module: any): boolean;
    /**
     * 使用模块方法
     * @param {EngineModule} module 使用的模块
     */
    use(module: any): Promise<void>;
    [AXIOS_PROVIDER]: Provider;
}
/**
 * 定义axios元数据
 * @see {@link module:lib/engine~EngineModule} 引擎模块类型
 * @see {@link module:plugins/axios~AxiosMetadata} axios元数据
 * @param {EngineModule} target 引擎模块对象
 * @param {...AxiosMetadata} metadatas axios元数据
 * @return {EngineModule} 引擎模块对象
 */
export function defineAxios(target: any, ...metadatas: AxiosMetadata[]): any;
import { AxiosRequestConfig } from "axios";
declare const AXIOS_PROVIDER: unique symbol;
import { Provider } from "brick-engine";
export {};
