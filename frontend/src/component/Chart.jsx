import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useMemo } from "react";
import { signals } from "../Columns";

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

const formatTick = (ms) =>
  new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatValue = (v) =>
  typeof v === "number"
    ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "–";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const columns = payload.length > 30 ? 3 : payload.length > 12 ? 2 : 1;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">
        {new Date(label).toLocaleString()}
      </div>
      <div
        className="chart-tooltip-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(170px, 1fr))`,
        }}>
        {payload.map((p) => {
          const meta = signals.find((s) => s.key === p.dataKey);
          return (
            <div className="chart-tooltip-row" key={p.dataKey}>
              <span className="signal-dot" style={{ background: p.color }} />
              <span className="chart-tooltip-name">{p.name}</span>
              <b>
                {formatValue(p.value)} {meta?.unit ?? ""}
              </b>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default function Chart({ data, selectedSignals }) {
  const chartData = useMemo(() => transformChartData(data), [data]);
  // const visibleSignals = useMemo(
  //   () => signals.filter((s) => selectedSignals.includes(s.key)),
  //   [selectedSignals],
  // );
  if (chartData.length === 0) {
    return <p>No data for this time range.</p>;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 12, right: 16, bottom: 2, left: 0 }}>
          <CartesianGrid stroke="#e9edf2" vertical horizontal />

          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 10, fill: "#8b95a5" }}
            tickLine={false}
            axisLine={{ stroke: "#d9dfe7" }}
            minTickGap={35}
            tickFormatter={formatTick}
          />

          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 10, fill: "#8b95a5" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />

          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "#c8ced8", strokeDasharray: "4 4" }}
            wrapperStyle={{ zIndex: 10, outline: "none" }}
            isAnimationActive={false}
          />

          {/* <Legend /> */}
          <ReferenceLine y={25} stroke="#c8ced8" strokeDasharray="4 4" />
          {signals
            .filter((s) => selectedSignals.includes(s.key))
            .map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}
