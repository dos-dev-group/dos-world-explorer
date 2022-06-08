export default function copyDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
