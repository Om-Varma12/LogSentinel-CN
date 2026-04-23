import { motion } from "framer-motion";
import { useIncidentsStream } from "@/hooks/useIncidentsStream";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Shield, TrendingUp, AlertTriangle, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";

const COLORS = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  blue: "#3b82f6",
  purple: "#a855f7",
  cyan: "#06b6d4",
};

export default function Analytics() {
  const { incidents, terminal } = useIncidentsStream();

  // Severity distribution
  const severityData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    incidents.forEach((inc) => counts[inc.level]++);
    return [
      { name: "High", value: counts.HIGH, color: COLORS.red },
      { name: "Medium", value: counts.MEDIUM, color: COLORS.amber },
      { name: "Low", value: counts.LOW, color: COLORS.green },
    ].filter((d) => d.value > 0);
  }, [incidents]);

  // MITRE tactic distribution
  const mitreData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((inc) => {
      const tactic = inc.mitre_name || "Unknown";
      counts[tactic] = (counts[tactic] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [incidents]);

  // Endpoint distribution
  const endpointData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((inc) => {
      const endpoint = inc.endpoint.split("/")[1] || inc.endpoint;
      counts[endpoint] = (counts[endpoint] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.slice(0, 15), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [incidents]);

  // Action distribution
  const actionData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((inc) => {
      counts[inc.action] = (counts[inc.action] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace("_", " "),
      value,
    }));
  }, [incidents]);

  // Time series data (group by recent time buckets)
  const timeSeriesData = useMemo(() => {
    const buckets: Record<string, { high: number; medium: number; low: number }> = {};
    incidents.slice(0, 20).forEach((inc) => {
      const timeKey = inc.ts.slice(0, 8) || "Recent";
      if (!buckets[timeKey]) buckets[timeKey] = { high: 0, medium: 0, low: 0 };
      buckets[timeKey][inc.level.toLowerCase() as "high" | "medium" | "low"]++;
    });
    return Object.entries(buckets)
      .reverse()
      .map(([time, counts]) => ({
        time,
        high: counts.high,
        medium: counts.medium,
        low: counts.low,
        total: counts.high + counts.medium + counts.low,
      }));
  }, [incidents]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 1.02, 0.73, 1] } }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.21, 1.02, 0.73, 1] } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full bg-soc-bg p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="w-10 h-10 rounded-lg bg-soc-surface border border-soc-border flex items-center justify-center hover:border-soc-border-strong transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-soc-text-secondary" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-soc-text">Analytics</h1>
            <p className="text-sm text-soc-text-tertiary mt-1">Real-time incident insights</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-soc-surface border border-soc-border">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-soc-green"
          />
          <span className="text-xs font-medium text-soc-text-secondary">LIVE UPDATES</span>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 gap-4 mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="bg-soc-surface border border-soc-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-soc-blue-muted flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-soc-blue" />
            </div>
            <span className="text-xs font-medium text-soc-text-tertiary uppercase tracking-wider">Total</span>
          </div>
          <div className="font-display text-3xl font-bold text-soc-text">{incidents.length}</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-soc-surface border border-soc-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-soc-red-muted flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-soc-red" />
            </div>
            <span className="text-xs font-medium text-soc-text-tertiary uppercase tracking-wider">High</span>
          </div>
          <div className="font-display text-3xl font-bold text-soc-red">
            {incidents.filter((i) => i.level === "HIGH").length}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-soc-surface border border-soc-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-soc-amber-muted flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-soc-amber" />
            </div>
            <span className="text-xs font-medium text-soc-text-tertiary uppercase tracking-wider">Critical</span>
          </div>
          <div className="font-display text-3xl font-bold text-soc-amber">
            {incidents.filter((i) => i.score >= 80).length}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-soc-surface border border-soc-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-soc-green-muted flex items-center justify-center">
              <Shield className="w-5 h-5 text-soc-green" />
            </div>
            <span className="text-xs font-medium text-soc-text-tertiary uppercase tracking-wider">Monitored</span>
          </div>
          <div className="font-display text-3xl font-bold text-soc-green">
            {incidents.filter((i) => i.action === "MONITOR").length}
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Grid - Asymmetric Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-5"
      >
        {/* Severity Pie Chart - Left Column */}
        <motion.div
          variants={chartVariants}
          className="col-span-4 row-span-2 bg-soc-surface border border-soc-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon className="w-5 h-5 text-soc-blue" />
            <div>
              <h3 className="font-display text-sm font-semibold text-soc-text">Severity</h3>
              <p className="text-xs text-soc-text-quaternary">Distribution by level</p>
            </div>
          </div>
          <div className="h-[280px]">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltipContent
                hideLabel
                indicator="dot"
                payload={severityData}
              />
            </PieChart>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-soc-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Time Series Area Chart - Right Top, spans 8 cols */}
        <motion.div
          variants={chartVariants}
          className="col-span-8 bg-soc-surface border border-soc-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-soc-green" />
            <div>
              <h3 className="font-display text-sm font-semibold text-soc-text">Timeline</h3>
              <p className="text-xs text-soc-text-quaternary">Incident trends over time</p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.red} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.red} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis tick={{ fontSize: 10, fill: "#71717a" }} />
                <ChartTooltipContent
                  hideLabel
                  indicator="dot"
                  payload={timeSeriesData}
                />
                <Area
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke={COLORS.red}
                  fill="url(#colorHigh)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="medium"
                  stackId="1"
                  stroke={COLORS.amber}
                  fill="url(#colorMedium)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke={COLORS.green}
                  fill="url(#colorLow)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.red }} />
              <span className="text-xs text-soc-text-secondary">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.amber }} />
              <span className="text-xs text-soc-text-secondary">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.green }} />
              <span className="text-xs text-soc-text-secondary">Low</span>
            </div>
          </div>
        </motion.div>

        {/* MITRE Bar Chart - Right Bottom Left */}
        <motion.div
          variants={chartVariants}
          className="col-span-4 bg-soc-surface border border-soc-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-soc-purple" />
            <div>
              <h3 className="font-display text-sm font-semibold text-soc-text">MITRE Tactics</h3>
              <p className="text-xs text-soc-text-quaternary">Top attack patterns</p>
            </div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mitreData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 9, fill: "#71717a" }} />
                <ChartTooltipContent hideLabel indicator="dot" payload={mitreData} />
                <Bar dataKey="value" fill={COLORS.blue} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Action Donut Chart - Right Bottom Right */}
        <motion.div
          variants={chartVariants}
          className="col-span-4 bg-soc-surface border border-soc-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-soc-amber" />
            <div>
              <h3 className="font-display text-sm font-semibold text-soc-text">Actions</h3>
              <p className="text-xs text-soc-text-quaternary">Response distribution</p>
            </div>
          </div>
          <div className="h-[180px]">
            <PieChart>
              <Pie
                data={actionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {actionData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                  />
                ))}
              </Pie>
              <ChartTooltipContent hideLabel indicator="dot" payload={actionData} />
            </PieChart>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {actionData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: Object.values(COLORS)[index % Object.values(COLORS).length] }}
                />
                <span className="text-[10px] text-soc-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Endpoint Bar Chart - Full Width Bottom */}
        <motion.div
          variants={chartVariants}
          className="col-span-12 bg-soc-surface border border-soc-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-soc-cyan" />
            <div>
              <h3 className="font-display text-sm font-semibold text-soc-text">Top Endpoints</h3>
              <p className="text-xs text-soc-text-quaternary">Most targeted endpoints</p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={endpointData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis tick={{ fontSize: 10, fill: "#71717a" }} />
                <ChartTooltipContent hideLabel indicator="dot" payload={endpointData} />
                <Bar dataKey="value" fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex justify-center mt-8"
      >
        <Link
          to="/"
          className="text-xs text-soc-text-tertiary hover:text-soc-text-secondary transition-colors"
        >
          Back to Monitor
        </Link>
      </motion.div>
    </motion.div>
  );
}
