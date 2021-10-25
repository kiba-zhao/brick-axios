/**
 * axios装饰器工厂方法
 * @param {...AxiosMetadata} metadatas axios元数据
 * @return {function(EngineModule):void} axios装饰器
 */
export function Axios(...metadatas: any[]): (arg0: any) => void;
