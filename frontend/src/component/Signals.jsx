import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Signals({ user, logout }) {
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <Topbar user={user} onLogout={logout} />
        Signals list will be shown here
      </main>
    </>
  );
}
