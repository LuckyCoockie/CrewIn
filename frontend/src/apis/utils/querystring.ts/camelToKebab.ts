// 카멜케이스를 케밥케이스로 변환하는 함수
function camelToKebab(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// 객체의 키를 변환하는 함수
export function convertKeysToKebabCase(
  obj: Record<string, any>
): Record<string, any> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const kebabKey = camelToKebab(key);
    acc[kebabKey] = value;
    return acc;
  }, {} as Record<string, any>);
}
