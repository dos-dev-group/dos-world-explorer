/* eslint-disable */
export default function copyDeep<T>(
  obj: T,
): T {
  const clone = {} as T;
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      clone[key] = (obj[key] as any).concat();
    } else if (typeof obj[key] == 'object' && obj[key] != null) {
      clone[key] = copyDeep(obj[key]);
    } else {
      clone[key] = obj[key];
    }
  }

  return clone;
}
