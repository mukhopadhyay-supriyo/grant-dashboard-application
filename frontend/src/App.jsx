// import AppShell from "./AppShell";
import Login from "./component/Login.jsx";
import Home from "./component/Home.jsx";
import Signals from "./component/Signals.jsx";
import Alert from "./component/Alert.jsx";
import ChartPage from "./component/ChartPage.jsx";
import InstallationPage from "./component/InstallationPage.jsx";
import { useProvider } from "./ContextProvider";

export default function App() {
  const { user, handleLogout, handleLogin, page, now, setNow } = useProvider();

  // console.log(now);

  if (!user) return <Login onSuccess={handleLogin} />;
  if (page === "home")
    return (
      <div className="app-shell">
        <Home user={user} onLogout={handleLogout} />
      </div>
    );
  if (page === "alerts")
    return (
      <div className="app-shell">
        <Alert user={user} onLogout={handleLogout} />
      </div>
    );
  if (page === "signals")
    return (
      <div className="app-shell">
        <Signals user={user} onLogout={handleLogout} />
      </div>
    );
  if (page === "charts")
    return (
      <div className="app-shell">
        <ChartPage user={user} onLogout={handleLogout} />
      </div>
    );
  if (page === "installation")
    return (
      <div className="app-shell">
        <InstallationPage user={user} onLogout={handleLogout} />
      </div>
    );
}
