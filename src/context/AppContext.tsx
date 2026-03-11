import React, { createContext, useMemo, useState, useCallback } from "react";

export interface AppContextProps {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  selectedImages: any[];
  setSelectedImages: React.Dispatch<React.SetStateAction<any[]>>;
  isGroupingEnabled: boolean;
  setIsGroupingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AppContextProvider = createContext({} as AppContextProps);

export const AppContext = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isGroupingEnabled, setIsGroupingEnabled] = useState<boolean>(false);
  // const [refresh, setRefresh] = useState(false);
  // const refresh = window.location.reload();

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const appContextValue = useMemo(
    () => ({
      login,
      logout,
      isLoggedIn,
      selectedImages,
      setSelectedImages,
      setIsGroupingEnabled,
      isGroupingEnabled,
      // refresh,
    }),
    [
      isLoggedIn,
      login,
      logout,
      selectedImages,
      isGroupingEnabled,
      setSelectedImages,
      setIsGroupingEnabled,
      // refresh,
    ]
  );
  return (
    <AppContextProvider.Provider value={appContextValue}>
      {children}
    </AppContextProvider.Provider>
  );
};
