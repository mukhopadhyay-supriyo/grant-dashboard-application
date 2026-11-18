import { Activity, TimerReset } from "lucide-react";
import HealthBadge from "./HealthBadge";
import HealthBadgeDB from "./HealthBadgeDB";
import { useProvider } from "../ContextProvider";

import "../App.css";

export default function Toolbar() {
  const { setShowSignals, range, setHours, setRange } = useProvider();

  const navbutton = (id, key) => {
    <button className=""></button>;
  };
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
  return (
    <>
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
            onClick={() => {
              setHours(0.25);
              setRange("15 Mins");
            }}>
            <TimerReset size={15} /> 15 Mins
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              setHours(0.5);
              setRange("30 Mins");
            }}>
            <TimerReset size={15} /> 30 Mins
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              setHours(1);
              setRange("1 Hour");
            }}>
            <TimerReset size={15} /> 1 Hour
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              setHours(8);
              setRange("8 Hours");
            }}>
            <TimerReset size={15} /> 8 Hours
          </button>
          {/* <button
            className="secondary-button"
            onClick={() => setShowSignals((v) => !v)}>
            <SlidersHorizontal size={15} /> Signals
          </button> */}
          {/* <button className="secondary-button" onClick={exportCsv}>
            <Download size={15} /> Export CSV
          </button> */}
          {/* <button className="primary-button">
            <CalendarDays size={15} /> Oct 19, 2026 <ChevronDown size={14} />
          </button> */}
        </div>
      </section>
    </>
  );
}
