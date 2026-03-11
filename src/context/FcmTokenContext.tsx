import React, { createContext, useContext, useState } from "react";


interface FcmTokenContextType {
  fcmToken: number | null;
  setFcmToken: (token: number | null) => void;
}

const FcmTokenContext = createContext<FcmTokenContextType>({
  fcmToken: null,
  setFcmToken: () => {},
});

export const useFcmToken = () => useContext(FcmTokenContext);

export const FcmTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fcmToken, setFcmToken] = useState<number | null>(null);

  return (
    <FcmTokenContext.Provider value={{ fcmToken, setFcmToken }}>
      {children}
    </FcmTokenContext.Provider>
  );
};