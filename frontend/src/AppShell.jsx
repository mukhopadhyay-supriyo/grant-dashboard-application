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
  LogOut,
} from "lucide-react";

import Sidebar from "./component/Sidebar";
import MetricCard from "./component/MetricCard";
import HealthBadge from "./component/HealthBadge.jsx";
import HealthBadgeDB from "./component/HealthBadgeDB.jsx";
import { fetchSeries } from "./api.js";
import Chart from "./component/Chart.jsx";
import "./App.css";
import { columns } from "./Columns.js";

import { signals } from "./Columns.js";

const RANGES = [
  { label: "15 Min", hours: 0.25 },
  { label: "30 Min", hours: 0.5 },
  { label: "1 Hour", hours: 1 },
  { label: "8 hours", hours: 8 },
];

const DEFAULT_SIGNALS = [
  "Suction_temp",
  "Discharge_temp",
  "Ambient_temp",
  "Flow_temp",
  "Return_temp",
];

export default function AppShell() {
  const [selected, setSelected] = useState(DEFAULT_SIGNALS);
  const [showSignals, setShowSignals] = useState(true);
  const [range, setRange] = useState("15 Min");
  const [hours, setHours] = useState(0.25);
  const [search, setSearch] = useState("");

  const { start, end } = useMemo(() => {
    const end = new Date();
    const start = new Date(end.getTime() - hours * 3600000);
    return { start, end };
  }, [hours]);

  const toggleSignal = (key) =>
    setSelected((old) =>
      old.includes(key) ? old.filter((k) => k !== key) : [...old, key],
    );
  const filteredSignals = useMemo(
    () =>
      signals.filter((s) =>
        s.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchSeries(
          start,
          end,
          signals.map((s) => s.key),
        );
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [start, end]);

  const exportCsv = () => {
    const csv = [
      "timestamp," + selected.join(","),
      ...visibleData.map((row) =>
        [row.timestamp, ...selected.map((k) => row[k])].join(","),
      ),
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "telemetry-export.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  console.log(data);
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
            <button
              className="logout-pill"
              onClick={() => window.location.reload()}
              title="Logout">
              <LogOut size={17} /> Logout
            </button>
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
            <button className="secondary-button" onClick={exportCsv}>
              <Download size={15} /> Export CSV
            </button>
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
        <section className="chart-card">
          <div className="card-heading">
            <div>
              <h2>Sensor trends</h2>
              <p>Temperature signals over time · sample interval 5 minutes</p>
            </div>
            <div className="chart-controls">
              <div className="range-switch">
                {RANGES.map((r) => (
                  <button
                    className={range === r.label ? "chosen" : ""}
                    key={r.label}
                    onClick={() => {
                      setHours(r.hours);
                      setRange(r.label);
                    }}>
                    {r.label}
                  </button>
                ))}
              </div>
              <button
                className="icon-button"
                onClick={exportCsv}
                title="Export CSV">
                <Download size={16} />
              </button>
            </div>
          </div>
          <div className="chart-layout">
            {showSignals && (
              <aside className="signal-list">
                <div className="signal-list-title">
                  <span>Signals</span>
                  <span>
                    {selected.length}/{signals.length}
                  </span>
                </div>
                <label className="search-box">
                  <Search size={14} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Find a signal"
                  />
                </label>
                {filteredSignals.map((s) => (
                  <label className="signal-option" key={s.key}>
                    <input
                      type="checkbox"
                      checked={selected.includes(s.key)}
                      onChange={() => toggleSignal(s.key)}
                    />
                    <span
                      className="signal-dot"
                      style={{ background: s.color }}
                    />
                    <span className="signal-name">{s.label}</span>
                  </label>
                ))}
                <button
                  className="select-all"
                  onClick={() =>
                    setSelected(
                      selected.length === signals.length
                        ? []
                        : signals.map((s) => s.key),
                    )
                  }>
                  {selected.length === signals.length
                    ? "Clear all"
                    : "Select all signals"}
                </button>
              </aside>
            )}
            <div className="chart-wrap">
              {loading && <p>Loading telemetry data...</p>}

              {error && <p>Error: {error.message}</p>}

              {!loading && !error && (
                <Chart data={data} selectedSignals={selected} />
              )}
              <div className="chart-footnote">
                Illustrative data only · select signals to compare trends
              </div>
            </div>
          </div>
        </section>
        {/* <StatusTimeline /> */}
        <footer className="app-footer">
          <span>
            Industrial Monitor <b>·</b> Frontend prototype
          </span>
          <span>
            API integration pending <span className="footer-dot" />
          </span>
        </footer>
      </main>
    </div>
  );
}
