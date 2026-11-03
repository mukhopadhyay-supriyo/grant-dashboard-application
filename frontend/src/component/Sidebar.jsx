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

function Sidebar() {
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
      <button className="side-item" title="Home">
        <House size={19} />
      </button>
      <button className="side-item active" title="Charts">
        <ChartNoAxesCombined size={20} />
      </button>
      <button className="side-item" title="Signals">
        <SlidersHorizontal size={19} />
      </button>
      <button className="side-item" title="Alerts">
        <Bell size={19} />
      </button>
      <div className="side-spacer" />
      <button className="side-item" title="Settings">
        <Settings size={19} />
      </button>
      <button className="side-item" title="Help">
        <CircleHelp size={19} />
      </button>
      <div className="sidebar-footer">v0.1</div>
    </aside>
  );
}

export default Sidebar;
