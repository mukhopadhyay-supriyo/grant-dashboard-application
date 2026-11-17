import AppShell from "./AppShell";
import { useMemo, useState, useEffect } from "react";
import Login from "./component/Login";
import { useProvider } from "./ContextProvider";

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

export default function App() {
  const { user, setUser } = useProvider();

  const handleLogin = (u) => {
    const storage = u.remember ? localStorage : sessionStorage;
    const toSave = u.remember
      ? { ...u, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 }
      : u;
    storage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setUser(toSave);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(sessionStorage);
    setUser(null);
  };

  // console.log(user.email);

  if (!user) return <Login onSuccess={handleLogin} />;
  return (
    <div className="app-shell">
      <AppShell user={user} onLogout={handleLogout} />
    </div>
  );
}
