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
import HealthBadge from "./HealthBadge";
import HealthBadgeDB from "./HealthBadgeDB";

import "../App.css";

export default function Toolbar() {
  const [showSignals, setShowSignals] = useState(true);
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
    </>
  );
}
