import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  Download,
  Filter,
  Gauge,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Sidebar from "./component/Sidebar";
import MetricCard from "./component/MetricCard";
import "./App.css";
export default function App() {
  const [showSignals, setShowSignals] = useState(true);
  const [range, setRange] = useState("8 hours");
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">MONITORING / SYSTEMS</div>
            <h1>Telemetry dashboard</h1>
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
            <div className="avatar">SM</div>
          </div>
        </header>
        <section className="page-toolbar">
          <div className="toolbar-title">
            <Activity size={18} />
            <span>Heat pump system</span>
            <span className="device-chip">
              <Wifi size={13} /> Connected
            </span>
          </div>
          <div className="toolbar-actions">
            <button
              className="secondary-button"
              onClick={() => setShowSignals((v) => !v)}>
              <SlidersHorizontal size={15} /> Signals
            </button>
            {/* <button className="secondary-button" onClick={exportCsv}>
              <Download size={15} /> Export CSV
            </button> */}
            <button className="primary-button">
              <CalendarDays size={15} /> Oct 19, 2026 <ChevronDown size={14} />
            </button>
          </div>
        </section>
        <section className="metrics-grid">
          <MetricCard
            icon={Gauge}
            label="Flow temperature"
            value={`20 °C`}
            detail="Latest sample · illustrative"
          />
          <MetricCard
            icon={Activity}
            label="Return temperature"
            value={`20 °C`}
            detail="Latest sample · illustrative"
          />
          <MetricCard
            icon={Wifi}
            label="Active circuits"
            value="3 / 7"
            detail="Equipment state mock-up"
          />
          <MetricCard
            icon={CalendarDays}
            label="Time window"
            value={range}
            detail="97 sample points available"
          />
        </section>
        This is Grant Dashboard
      </main>
    </div>
  );
}
