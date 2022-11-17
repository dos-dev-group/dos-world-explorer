// eslint-disable-next-line no-useless-escape
const specialPattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
export default function checkHasSpecialChar(str: string) {
  if (specialPattern.test(str) === true) {
    return true;
  }
  return false;
}
