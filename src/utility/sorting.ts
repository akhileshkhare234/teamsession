export const sortByKey = (array: any[], key: string) => {
  return array.sort((a, b) => {
    const keyA = a[key] ? a[key].toLowerCase() : "";
    const keyB = b[key] ? b[key].toLowerCase() : "";
    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  });
};
export const sortByKeys = (array: any[]) => {
  return array.sort((a, b) => b.loginTimestamp - a.loginTimestamp);
};
