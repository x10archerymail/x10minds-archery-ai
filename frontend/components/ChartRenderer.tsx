import * as React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartData {
  type: "line" | "bar" | "pie" | "donut";
  title: string;
  data: any[];
  config: {
    xKey: string;
    yKeys: string[];
    colors?: string[];
  };
}

interface ChartRendererProps {
  chartData: ChartData;
  themeMode?: "dark" | "light";
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  chartData,
  themeMode = "dark",
}) => {
  const isDark = themeMode === "dark";
  const { type, title, data, config } = chartData;

  const defaultColors = ["#FFD700", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];
  const colors = config.colors || defaultColors;

  return (
    <div
      className={`w-full p-8 rounded-[2rem] border ${
        isDark
          ? "bg-black/40 border-white/5 shadow-2xl shadow-black/50"
          : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
      } my-6 transition-all`}
    >
      <h4
        className={`text-[10px] font-black tracking-[0.2em] uppercase mb-8 ${
          isDark ? "text-[#FFD700]" : "text-[#FFD700]"
        }`}
      >
        {title}
      </h4>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {(() => {
            switch (type) {
              case "line":
                return (
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "#333" : "#eee"}
                      vertical={false}
                    />
                    <XAxis
                      dataKey={config.xKey}
                      stroke={isDark ? "#888" : "#333"}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={isDark ? "#888" : "#333"}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#111" : "#fff",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend iconType="circle" />
                    {config.yKeys.map((key, i) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[i % colors.length]}
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          strokeWidth: 2,
                          fill: isDark ? "#000" : "#fff",
                        }}
                        activeDot={{ r: 6 }}
                        animationDuration={1500}
                      />
                    ))}
                  </LineChart>
                );
              case "bar":
                return (
                  <BarChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "#333" : "#eee"}
                      vertical={false}
                    />
                    <XAxis
                      dataKey={config.xKey}
                      stroke={isDark ? "#888" : "#333"}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={isDark ? "#888" : "#333"}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#111" : "#fff",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend iconType="circle" />
                    {config.yKeys.map((key, i) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={colors[i % colors.length]}
                        radius={[6, 6, 0, 0]}
                        animationDuration={1500}
                      />
                    ))}
                  </BarChart>
                );
              case "pie":
              case "donut":
                return (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={type === "donut" ? 60 : 0}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey={config.yKeys[0]}
                      nameKey={config.xKey}
                      animationDuration={1500}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#111" : "#fff",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                );
              default:
                return <div>Unsupported chart type</div>;
            }
          })()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
