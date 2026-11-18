import { useMemo } from "react";
import { Activity, CalendarDays, Download, Gauge, Search } from "lucide-react";

import Sidebar from "./Sidebar";
import MetricCard from "./MetricCard";
import Topbar from "./Topbar.jsx";
import Toolbar from "./Toolbar.jsx";
import ToolbarChartArea from "./ToolbarChartArea.jsx";
import Chart from "./Chart.jsx";
import "../App.jsx";
import { useProvider } from "../ContextProvider";
import { signals } from "../Columns.js";
const RANGES = [
  { label: "15 Mins", hours: 0.25 },
  { label: "30 Mins", hours: 0.5 },
  { label: "1 Hour", hours: 1 },
  { label: "8 hours", hours: 8 },
];

export default function ChartPage({ user, onLogout }) {
  // alert(user.email);

  const {
    showSignals,
    range,
    setRange,
    error,
    data,
    setHours,
    search,
    setSearch,
    loading,
    compressor,
    ambient,
    fanspeed,
    pumpspeed,
    exp,
    selected,
    setSelected,
  } = useProvider();

  // console.log(start);
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

  // console.log(data[length].Ambient_temp);
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <Topbar user={user} onLogout={onLogout} />
        <ToolbarChartArea />
        <section className="metrics-grid">
          <MetricCard
            icon={Gauge}
            label="Compressor"
            value={`${compressor} Hz`}
            detail="Compressor Frequesncy"
          />
          <MetricCard
            icon={Activity}
            label="Ambient temperature"
            value={`${ambient / 100}  °C`}
            detail="Outside Temperature"
          />
          <MetricCard
            icon={Gauge}
            label="Fan Speed"
            value={`${fanspeed}  rpm`}
            detail="Fan Rotating Speed"
          />
          <MetricCard
            icon={Gauge}
            label="Expansion Valve"
            value={`${exp}  steps`}
            detail="Expansion Valve Stepper Position"
          />
          <MetricCard
            icon={Gauge}
            label="Pump Speed"
            value={`${pumpspeed}  rpm`}
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
              <p>Heatpump data over time · sample interval 1 Second</p>
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
                // onClick={exportCsv}
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
    </>
  );
}
