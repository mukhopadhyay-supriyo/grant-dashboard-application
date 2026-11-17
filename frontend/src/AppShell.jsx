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
import Topbar from "./component/Topbar.jsx";
import Toolbar from "./component/Toolbar.jsx";
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

function transformChartData(apiData) {
  const { timestamps, series } = apiData;

  return timestamps.map((timestamp, index) => {
    const row = {
      timestamp: timestamp,
    };

    series.forEach((sensor) => {
      row[sensor.name] = sensor.values[index] ?? null;
    });

    return row;
  });
}

export default function AppShell({ user, onLogout }) {
  const [selected, setSelected] = useState(DEFAULT_SIGNALS);
  const [showSignals, setShowSignals] = useState(true);
  const [range, setRange] = useState("15 Min");
  const [hours, setHours] = useState(0.25);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [len, setLength] = useState(0);
  const [compressor, setCompressor] = useState(0);
  const [ambient, setAmbient] = useState(0);
  const [fanspeed, setFanspeed] = useState(0);
  const [pumpspeed, setPumpspeed] = useState(0);
  const [exp, setExp] = useState(0);

  const { start, end } = useMemo(() => {
    const end = new Date();
    const start = new Date(end.getTime() - hours * 3600000);
    return { start, end };
  }, [hours]);
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
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchSeries(
          start,
          end,
          user.deviceid,
          signals.map((s) => s.key),
        );
        // console.log(result);
        setData(transformChartData(result));
        setLength(data.length - 1);
        setCompressor(data[len].Comp_Speed_Target);
        setAmbient(data[len].Ambient_temp);
        setFanspeed(data[len].Fan_Tach);
        setExp(data[len].Stepper_Position);
        setPumpspeed(data[len].Pump_Speed_Target);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [start, end]);

  // console.log(data[length].Ambient_temp);
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <Topbar user={user} onLogout={onLogout} />
        <Toolbar />
        <section className="metrics-grid">
          <MetricCard
            icon={Gauge}
            label="Compressor"
            value={`${compressor} rpm`}
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
            value={`${exp}  rpm`}
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
