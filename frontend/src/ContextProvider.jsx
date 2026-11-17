import { createContext, useContext, useState } from "react";

const ApplicationContext = createContext(null);

export function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showSignals, setShowSignals] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("15 Min");
  return (
    <ApplicationContext.Provider
      value={{
        user,
        setUser,
        showSignals,
        setShowSignals,
        error,
        setError,
        range,
        setRange,
      }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useProvider() {
  return useContext(ApplicationContext);
}
