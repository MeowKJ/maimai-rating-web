export function isValidNumber(value: string): boolean {
  // 使用正则表达式匹配大于6位小于12位的整数
  return /^\d{7,11}$/.test(value);
}
