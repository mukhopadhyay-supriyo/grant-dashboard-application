import { useMemo, useState, useEffect } from "react";
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
import HealthBadge from "./component/HealthBadge.jsx";
import HealthBadgeDB from "./component/HealthBadgeDB.jsx";
import "./api.js";
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
            <div className="avatar">SM</div>
          </div>
        </header>
        <section className="page-toolbar">
          <div className="toolbar-title">
            <Activity size={18} />
            <span>Heat pump system</span>
            <HealthBadge />
            <HealthBadgeDB />
            {/* <span className="device-chip">
              <Wifi size={13} /> Connected
            </span> */}
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
            label="Compressor"
            value={`500 rpm`}
            detail="Compressor Frequesncy"
          />
          <MetricCard
            icon={Activity}
            label="Ambient temperature"
            value={`20 °C`}
            detail="Outside Temperature"
          />
          <MetricCard
            icon={Gauge}
            label="Fan Speed"
            value="300 rpm"
            detail="Fan Rotating Speed"
          />
          <MetricCard
            icon={Gauge}
            label="Expansion Valve"
            value="200"
            detail="Expansion Valve Stepper Position"
          />
          <MetricCard
            icon={Gauge}
            label="Pump Speed"
            value="622 rpm"
            detail="Pump Speed"
          />
          <MetricCard
            icon={CalendarDays}
            label="Time window"
            value={range}
            detail="Window scale"
          />
        </section>
        <section>
          <healthBadge />
        </section>
        This is Grant Dashboard
      </main>
    </div>
  );
}
