import {
  Activity,
  Bell,
  ChartNoAxesCombined,
  CircleHelp,
  House,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import logo from "../static/logo.jpg";

import { useProvider } from "../ContextProvider";

function Sidebar() {
  const { page, setPage } = useProvider();

  // const handleclick = (u) => {
  //   useEffect(() => {
  //     setPage(u);
  //   }, [page]);
  // };

  const NavButton = ({ id, title, children }) => (
    <button
      className={page === id ? "side-item active" : "side-item"}
      title={title}
      onClick={() => setPage(id)}>
      {children}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="brand-mark">
        {/* <Activity size={23} /> */}
        <img src={logo} alt="logo" width={35} />
      </div>
      <div className="brand-word">
        Grant<span>cloud</span>
      </div>
      <div className="side-rule" />
      <NavButton id="home" title="Home">
        <House size={20} />
      </NavButton>
      <NavButton id="charts" title="Charts">
        <ChartNoAxesCombined size={20} />
      </NavButton>
      <NavButton id="signals" title="Signals">
        <SlidersHorizontal size={20} />
      </NavButton>
      <NavButton id="alerts" title="Alerts">
        <Bell size={20} />
      </NavButton>
      <div className="side-spacer" />
      <NavButton id="settings" title="Settings">
        <Settings size={19} />
      </NavButton>
      <NavButton id="help" title="Help">
        <CircleHelp size={19} />
      </NavButton>
      {/* <button
        className={page === "charts" ? "side-rule active" : "side-rule"}
        title="Charts"
        onClick={() => setPage("charts")}>
        <ChartNoAxesCombined size={20} />
      </button>
      <button
        className={page === "signals" ? "side-rule active" : "side-rule"}
        title="Signals"
        onClick={() => setPage("signals")}>
        <SlidersHorizontal size={19} />
      </button>
      <button
        className={page === "alerts" ? "side-rule active" : "side-rule"}
        title="Alerts"
        onClick={() => setPage("alerts")}>
        <Bell size={19} />
      </button>
      <div className="side-spacer" />
      <button
        className="side-rule"
        title="Settings"
        onClick={() => setPage("settings")}>
        <Settings size={19} />
      </button>
      <button
        className="side-rule"
        title="Help"
        onClick={() => setPage("help")}>
        <CircleHelp size={19} />
      </button> */}
      <div className="sidebar-footer">v0.1</div>
    </aside>
  );
}

export default Sidebar;
