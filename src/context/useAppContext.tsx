import { useContext } from "react";
import { AppContextProvider } from "./AppContext";

export function useAppContext() {
  const context = useContext(AppContextProvider);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
