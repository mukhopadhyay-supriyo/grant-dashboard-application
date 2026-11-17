import { useCallback, useState } from "react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import { signals } from "../Columns";

// Format timestamp for X-axis
const formatTick = (ms) =>
  new Date(Number(ms)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

// Format values for tooltip
const formatValue = (v) =>
  typeof v === "number"
    ? v.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })
    : "–";

// Custom tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const columns = payload.length > 30 ? 3 : payload.length > 12 ? 2 : 1;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">
        {new Date(Number(label)).toLocaleString()}
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

// Initial zoom state
const initialState = {
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: null,
  refAreaRight: null,
  yDomain: ["auto", "auto"],
};

// Calculate Y-axis domain for selected timestamps
const getAxisYDomain = (from, to, data, selectedSignals) => {
  const selectedData = data.filter((d) => {
    const timestamp = Number(d.timestamp);

    return timestamp >= from && timestamp <= to;
  });

  const values = selectedData.flatMap((d) =>
    selectedSignals.map((key) => Number(d[key])).filter(Number.isFinite),
  );

  if (values.length === 0) {
    return ["auto", "auto"];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  // Add some space above and below the data
  const padding = Math.max((max - min) * 0.05, 0.1);

  return [min - padding, max + padding];
};

export default function Chart({ data, selectedSignals }) {
  const chartData = data ?? [];

  const [zoomGraph, setZoomGraph] = useState(initialState);

  const { left, right, refAreaLeft, refAreaRight, yDomain } = zoomGraph;

  // Zoom into selected area
  const zoom = useCallback(() => {
    setZoomGraph((prev) => {
      let { refAreaLeft, refAreaRight } = prev;

      if (
        refAreaLeft == null ||
        refAreaRight == null ||
        refAreaLeft === refAreaRight
      ) {
        return {
          ...prev,
          refAreaLeft: null,
          refAreaRight: null,
        };
      }

      // Ensure left timestamp is smaller
      if (Number(refAreaLeft) > Number(refAreaRight)) {
        [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
      }

      const from = Number(refAreaLeft);
      const to = Number(refAreaRight);

      const newYDomain = getAxisYDomain(from, to, chartData, selectedSignals);

      return {
        ...prev,
        refAreaLeft: null,
        refAreaRight: null,
        left: from,
        right: to,
        yDomain: newYDomain,
      };
    });
  }, [chartData, selectedSignals]);

  // Reset zoom
  const zoomOut = useCallback(() => {
    setZoomGraph(initialState);
  }, []);

  // Record starting timestamp
  const onMouseDown = useCallback((e) => {
    if (e?.activeLabel == null) return;

    setZoomGraph((prev) => ({
      ...prev,
      refAreaLeft: Number(e.activeLabel),
      refAreaRight: null,
    }));
  }, []);

  // Record ending timestamp
  const onMouseMove = useCallback((e) => {
    if (e?.activeLabel == null) return;

    setZoomGraph((prev) => {
      if (prev.refAreaLeft == null) return prev;

      return {
        ...prev,
        refAreaRight: Number(e.activeLabel),
      };
    });
  }, []);

  // Handle empty data after all hooks
  if (chartData.length === 0) {
    return <p>No data for this time range.</p>;
  }

  return (
    <>
      <button type="button" className="btn-update" onClick={zoomOut}>
        Zoom Out
      </button>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 12,
              right: 16,
              bottom: 2,
              left: 0,
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={zoom}>
            <CartesianGrid stroke="#e9edf2" vertical horizontal />

            <XAxis
              dataKey="timestamp"
              type="number"
              domain={[left, right]}
              allowDataOverflow
              tick={{ fontSize: 10, fill: "#8b95a5" }}
              tickLine={false}
              axisLine={{ stroke: "#d9dfe7" }}
              minTickGap={35}
              tickFormatter={formatTick}
            />

            <YAxis
              type="number"
              domain={yDomain}
              allowDataOverflow
              tick={{ fontSize: 10, fill: "#8b95a5" }}
              tickLine={false}
              axisLine={false}
              width={55}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{
                stroke: "#c8ced8",
                strokeDasharray: "4 4",
              }}
              wrapperStyle={{
                zIndex: 10,
                outline: "none",
              }}
              isAnimationActive={false}
            />

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

            {refAreaLeft != null && refAreaRight != null && (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                stroke="var(--color-border-2)"
                fill="var(--color-solid-7a)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
