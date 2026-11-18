// import AppShell from "./AppShell";
import Login from "./component/Login.jsx";
import Home from "./component/Home.jsx";
import Signals from "./component/Signals.jsx";
import Alert from "./component/Alert.jsx";
import ChartPage from "./component/ChartPage.jsx";
import { useProvider } from "./ContextProvider";

export default function App() {
  const { user, handleLogout, handleLogin, page } = useProvider();

  // console.log(page);

  if (!user) return <Login onSuccess={handleLogin} />;
  if (page === "home") return <Home user={user} onLogout={handleLogout} />;
  if (page === "alerts") return <Alert user={user} onLogout={handleLogout} />;
  if (page === "signals")
    return <Signals user={user} onLogout={handleLogout} />;
  if (page === "charts")
    return (
      <div className="app-shell">
        <ChartPage user={user} onLogout={handleLogout} />
      </div>
    );
}
