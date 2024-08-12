// DataProviderFactory.ts
import ApiDataProvider from "./ApiDataProvider";
import LuoXue from "./LuoXue";
import DivingFish from "./DivingFish";

export class DataProviderFactory {
  static createProvider(username: string): ApiDataProvider | null {
    if (isValidNumber(username)) {
      return new LuoXue(username); // 假设 LuoXue 类接收用户名作为构造参数
    } else {
      return new DivingFish(username); // 假设 DivingFish 类接收用户名作为构造参数
    }
  }
}

export function isValidNumber(value: string): boolean {
  // 使用正则表达式匹配大于6位小于12位的整数
  return /^\d{7,11}$/.test(value);
}
