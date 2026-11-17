import AppShell from "./AppShell";
import Login from "./component/Login";
import { useProvider } from "./ContextProvider";

export default function App() {
  const { user, handleLogout, handleLogin } = useProvider();

  // console.log(user.email);

  if (!user) return <Login onSuccess={handleLogin} />;
  return (
    <div className="app-shell">
      <AppShell user={user} onLogout={handleLogout} />
    </div>
  );
}
