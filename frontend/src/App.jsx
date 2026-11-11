import AppShell from "./AppShell";
import { useMemo, useState, useEffect } from "react";
import Login from "./component/Login";

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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  if (!user)
    return (
      <Login
        onSuccess={(u) => {
          setUser(u);
          console.log("Logged in as", u.email);
        }}
      />
    );

  return (
    <AppShell
      user={user}
      onLogout={() => {
        setUser(null);
        localStorage.removeItem("user");
      }}
    />
  );
}
