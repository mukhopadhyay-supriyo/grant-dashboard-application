import {
  Activity,
  SlidersHorizontal,
  Download,
  CalendarDays,
  ChevronDown,
  FileClock,
} from "lucide-react";
import HealthBadge from "./HealthBadge";
import HealthBadgeDB from "./HealthBadgeDB";
import { useProvider } from "../ContextProvider";

import "../App.css";

export default function ToolbarChartArea() {
  const { setShowSignals, data, selected, now } = useProvider();

  const exportCsv = () => {
    const csv = [
      "timestamp," + selected.join(","),
      ...data.map((row) =>
        [row.timestamp, ...selected.map((k) => row[k])].join(","),
      ),
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "telemetry-export.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  // console.log(now);
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
            <FileClock size={15} />
            <span>{now.toLocaleTimeString("en-IE")}</span>{" "}
            <ChevronDown size={14} />
          </button>
        </div>
      </section>
    </>
  );
}
