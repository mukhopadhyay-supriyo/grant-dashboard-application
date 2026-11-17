import { RefreshCw, LogOut } from "lucide-react";
import { useState } from "react";

import "../App.css";

export default function Topbar({ user, onLogout }) {
  console.log(user.email);
  const [error, setError] = useState(null);

  const logout = () => {
    try {
      onLogout?.();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">MONITORING / SYSTEMS</div>
          <h1>Grant dashboard</h1>
        </div>
        <div className="topbar-actions">
          <span className="live-pill">
            <span /> Live data
          </span>
          <button
            className="icon-button"
            onClick={() => window.location.reload()}
            title="Refresh">
            <RefreshCw size={17} />
          </button>
          <div className="avatar" title={user.email}>
            {user.email?.slice(0, 2).toUpperCase()}
          </div>
          <button className="logout-pill" onClick={logout} title="Logout">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </header>
    </>
  );
}
