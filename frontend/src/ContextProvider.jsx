import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { fetchSeries, fetchHealthDB } from "./api";
import { signals } from "./Columns.js";

const ApplicationContext = createContext(null);

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const STORAGE_KEY = "grant-user";

const DEFAULT_SIGNALS = [
  "Suction_temp",
  "Discharge_temp",
  "Ambient_temp",
  "Flow_temp",
  "Return_temp",
];
// Runs once on start-up: look for a saved login
function loadUser() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const user = JSON.parse(saved);
    // "Remember for 30 days": forget it once it's older than that
    if (user.expires && Date.now() > user.expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return user;
  } catch {
    return null; // storage blocked or corrupted: just show the login page
  }
}

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

export function ContextProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [showSignals, setShowSignals] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("15 Mins");
  const [data, setData] = useState(null);
  const [hours, setHours] = useState(0.25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [len, setLength] = useState(0);
  const [compressor, setCompressor] = useState(0);
  const [ambient, setAmbient] = useState(0);
  const [fanspeed, setFanspeed] = useState(0);
  const [pumpspeed, setPumpspeed] = useState(0);
  const [exp, setExp] = useState(0);
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(DEFAULT_SIGNALS);
  const [dbok, setDbok] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  // console.log(now);
  const { start, end } = useMemo(() => {
    const end = new Date();
    const start = new Date(end.getTime() - hours * 3600000);
    return { start, end };
  }, [hours]);

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
        const chartdata = transformChartData(result);
        setData(chartdata);

        if (chartdata.length === 0) return; // nothing in this range

        const first = chartdata[0];
        setLength(chartdata.length - 1);
        setCompressor(first.Comp_Speed_Target);
        setAmbient(first.Ambient_temp);
        setFanspeed(first.Fan_Speed_Target);
        setExp(first.Stepper_Position);
        setPumpspeed(first.Pump_Speed_Target);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [start, end]);

  const handleLogin = (u) => {
    const storage = u.remember ? localStorage : sessionStorage;
    const toSave = u.remember
      ? { ...u, expires: Date.now() + THIRTY_DAYS_MS }
      : u;
    storage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setUser(toSave);
    // setRange("30 Mins");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };
  return (
    <ApplicationContext.Provider
      value={{
        user,
        setUser,
        showSignals,
        setShowSignals,
        error,
        setError,
        range,
        setRange,
        handleLogin,
        handleLogout,
        data,
        setData,
        hours,
        setHours,
        search,
        setSearch,
        loading,
        setLoading,
        len,
        setLength,
        compressor,
        setCompressor,
        ambient,
        setAmbient,
        fanspeed,
        setFanspeed,
        pumpspeed,
        setPumpspeed,
        exp,
        setExp,
        page,
        setPage,
        selected,
        setSelected,
        dbok,
        setDbok,
        now,
        setNow,
      }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useProvider() {
  return useContext(ApplicationContext);
}
