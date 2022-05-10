function simpleStringHash(str: string): number {
  // @ts-ignore
  const hashValue = str.split('').reduce((acc: number, cur: string) => {
    return acc + cur.charCodeAt(0);
  }, 0);

  return hashValue;
}

export default simpleStringHash;
