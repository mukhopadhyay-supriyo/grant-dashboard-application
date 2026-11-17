import { createContext, useContext, useState } from "react";

const ApplicationContext = createContext(null);

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const STORAGE_KEY = "grant-user";
// Runs once on start-up: look for a saved login
function loadUser() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const user = JSON.parse(saved);
    // "Remember for 30 days": forget it once it's older than that
    if (user.expires && Date.now() > user.expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return user;
  } catch {
    return null; // storage blocked or corrupted: just show the login page
  }
}

export function ContextProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [showSignals, setShowSignals] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("15 Min");

  const handleLogin = (u) => {
    const storage = u.remember ? localStorage : sessionStorage;
    const toSave = u.remember
      ? { ...u, expires: Date.now() + THIRTY_DAYS_MS }
      : u;
    storage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setUser(toSave);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };
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
        handleLogin,
        handleLogout,
      }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useProvider() {
  return useContext(ApplicationContext);
}
