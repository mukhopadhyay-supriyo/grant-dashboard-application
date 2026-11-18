import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Alert({ user, logout }) {
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <Topbar user={user} onLogout={logout} />
        Alerts and notification will be here
      </main>
    </>
  );
}
