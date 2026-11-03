import { useMemo, useState, useEffect } from "react";
import { fetchHealthDB } from "../api";
import { Database, DatabaseZap } from "lucide-react";

export default function HealthBadgeDB() {
  const [dbok, setDbok] = useState(null);
  //   alert("called");
  useEffect(() => {
    fetchHealthDB()
      .then(() => setDbok(true))
      .catch(() => setDbok(false));
  }, []);
  if (dbok === null)
    return (
      <span className="device-chip">
        <Database size={13} />
        checking...
      </span>
    );
  return (
    <span className="device-chip">
      {dbok ? (
        <>
          <DatabaseZap size={13} /> Connected
        </>
      ) : (
        <>
          <Database size={13} /> Disconnected
        </>
      )}
    </span>
  );
}
