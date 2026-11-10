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
          />

          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 10, fill: "#8b95a5" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />

          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            wrapperStyle={{ zIndex: 10 }}
            allowEscapeViewBox={{ x: false, y: true }}
            contentStyle={{
              border: "1px solid #e4e9f0",
              borderRadius: 10,
              boxShadow: "0 8px 24px #15243b12",
              fontSize: 12,
            }}
            labelStyle={{ fontWeight: 700, color: "#243247" }}
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
