import {
  Activity,
  Bell,
  ChartNoAxesCombined,
  CircleHelp,
  House,
  Settings,
  SlidersHorizontal,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-mark">
        <Activity size={23} strokeWidth={2.4} />
      </div>
      <div className="brand-word">
        telemetry<span>cloud</span>
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
