import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Toolbar from "./Toolbar";
import MetricCard from "./MetricCard";
import { Activity, CalendarDays, Gauge } from "lucide-react";
import { useProvider } from "../ContextProvider";
import Clock from "./Clock";

export default function Home({ user, onLogout }) {
  const { compressor, ambient, fanspeed, exp, pumpspeed, range, dbok } =
    useProvider();
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <Topbar user={user} onLogout={onLogout} />
        <Toolbar />
        <section className="metrics-grid-home">
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
        <Clock />
      </main>
    </>
  );
}
