import { useMemo, useState, useEffect } from "react";
import { fetchHealth } from "../api";
import { Wifi, WifiOff } from "lucide-react";

export default function HealthBadge() {
  const [ok, setOk] = useState(null);
  //   alert("called");
  useEffect(() => {
    fetchHealth()
      .then(() => setOk(true))
      .catch(() => setOk(false));
  }, []);

  if (ok === null)
    return (
      <span className="device-chip">
        <Wifi size={13} />
        checking...
      </span>
    );

  return (
    <span className="device-chip">
      {ok ? (
        <>
          <Wifi size={13} /> Connected
        </>
      ) : (
        <>
          <WifiOff size={13} /> Disconnected
        </>
      )}
    </span>
  );
}
