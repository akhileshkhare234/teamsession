const localStoragefn = () => {
  const setLocalStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  };

  // Get a value from local storage
  const getLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  };

  const saveRedirectUrl = (): void => {
    localStorage.setItem("redirectUrl", window.location.hash);
  };

  const redirectSessionUrl = (): void => {
    const url = getLocalStorage("redirectUrl");
    if (url) {
      window.location.assign(url);
    }
  };

  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
  };
  const isSessionUrlExists = (): boolean => {
    const url = getLocalStorage("redirectUrl");
    if (url) {
      return true;
    } else {
      return false;
    }
  };

  return {
    setLocalStorage,
    getLocalStorage,
    saveRedirectUrl,
    redirectSessionUrl,
    isSessionUrlExists,
    removeItem,
  };
};
const localStorageUtil = localStoragefn();
export default localStorageUtil;
