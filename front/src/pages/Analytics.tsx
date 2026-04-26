import { motion } from "framer-motion";
import { useIncidentsStream } from "@/hooks/useIncidentsStream";
import { Shield, TrendingUp, AlertTriangle, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMemo, useRef } from "react";

const COLORS = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#10b981",
  blue: "#3b82f6",
  purple: "#a855f7",
  cyan: "#06b6d4",
};

// Superdesign color palette
const SD = {
  bg: "#050505",
  text: "#ebebeb",
  textMuted: "rgba(250,250,250,0.4)",
  textDimmest: "rgba(250,250,250,0.2)",
  glassBg: "rgba(255,255,255,0.02)",
  glassBorder: "rgba(255,255,255,0.1)",
  emerald: "#10b981",
  surface: "rgba(255,255,255,0.05)",
};

// Spotlight card cursor effect
function SpotlightCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current?.style.setProperty("--mouse-x", `${x}px`);
    ref.current?.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: SD.glassBg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${SD.glassBorder}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.12), transparent 40%)`,
        }}
        id="spotlight-glow"
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Shimmer border effect
function ShimmerCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <SpotlightCard className={className} delay={delay}>
      {children}
    </SpotlightCard>
  );
}

// SVG Donut chart component
function DonutChart({
  data,
  size = 240,
  strokeWidth = 12,
}: {
  data: { name: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const cx = 50;
  const cy = 50;

  let accumulatedOffset = 0;

  return (
    <div className="relative aspect-square w-full max-w-[240px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <circle cx={cx} cy={cy} r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        {data.map((entry, i) => {
          const pct = total > 0 ? entry.value / total : 0;
          const dashLen = circumference * (pct * 100) / 100;
          const dashOffset = circumference - accumulatedOffset;
          accumulatedOffset += dashLen;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="transparent"
              stroke={entry.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-3xl tabular-nums">{total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}</span>
        <span className="text-[9px] font-tech uppercase tracking-widest opacity-40">Total Events</span>
      </div>
    </div>
  );
}

// SVG Area chart (Timeline)
function TimelineChart({ data }: { data: { time: string; high: number; medium: number; low: number }[] }) {
  const width = 1000;
  const height = 300;
  const padding = 20;

  const maxVal = Math.max(...data.map((d) => d.high + d.medium + d.low), 1);
  const xStep = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => ({
    x: padding + i * xStep,
    y: padding + (height - padding * 2) * (1 - (d.high + d.medium + d.low) / maxVal),
  }));

  const pathD = points.length > 0
    ? `M ${points.map((p) => `${p.x},${p.y}`).join(" T ") || `M ${padding},${height - padding}`}`
    : `M ${padding},${height - padding}`;

  return (
    <div className="h-[240px] w-full relative">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: SD.emerald, stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: SD.emerald, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path d={`${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`} fill="url(#gradEmerald)" />
        <path d={pathD} fill="none" stroke={SD.emerald} strokeWidth="2" />
        {[0.25, 0.5, 0.75].map((pct, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + (height - padding * 2) * pct}
            x2={width - padding}
            y2={padding + (height - padding * 2) * pct}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-4 px-2">
        {data.length > 0 && data.map((d, i) => (
          <span key={i} className="text-[9px] font-tech uppercase" style={{ color: SD.textDimmest }}>{d.time}</span>
        ))}
      </div>
    </div>
  );
}

// MITRE horizontal bar
function MiterBarChart({ data }: { data: { name: string; value: number }[] }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-4">
      {data.slice(0, 4).map((item, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between text-[10px] uppercase font-tech" style={{ color: SD.textMuted }}>
            <span>{item.name}</span>
            <span>{item.value}</span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                background: COLORS.blue,
                width: `${(item.value / maxVal) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Top endpoints bar chart
function EndpointBars({ data }: { data: { name: string; value: number }[] }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-10 h-[200px] px-4 overflow-x-auto">
      {data.slice(0, 5).map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-4">
          <div className="w-full rounded-t-lg relative group h-full flex flex-col justify-end">
            <div
              className="w-full rounded-t-lg transition-all duration-1000"
              style={{
                height: `${(item.value / maxVal) * 100}%`,
                background: "rgba(6, 182, 212, 0.2)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 rounded-t-lg transition-all duration-1000"
              style={{ height: `${(item.value / maxVal) * 100}%`, background: COLORS.cyan }}
            />
          </div>
          <span className="text-[9px] font-tech uppercase truncate w-full text-center" style={{ color: SD.textDimmest }}>
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { incidents } = useIncidentsStream();

  const severityData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    incidents.forEach((inc) => counts[inc.level]++);
    return [
      { name: "High Severity", value: counts.HIGH, color: COLORS.red },
      { name: "Medium Severity", value: counts.MEDIUM, color: COLORS.amber },
      { name: "Low Severity", value: counts.LOW, color: COLORS.green },
    ];
  }, [incidents]);

  const mitreData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((inc) => {
      const tactic = inc.mitre_name || "Unknown";
      counts[tactic] = (counts[tactic] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [incidents]);

  const endpointData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((inc) => {
      const endpoint = inc.endpoint.split("/")[1] || inc.endpoint;
      counts[endpoint] = (counts[endpoint] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.slice(0, 15), value }))
      .sort((a, b) => b.value - a.value);
  }, [incidents]);

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

  const timeSeriesData = useMemo(() => {
    const buckets: Record<string, { high: number; medium: number; low: number }> = {};
    incidents.slice(0, 20).forEach((inc) => {
      const timeKey = inc.ts.slice(0, 8) || "Recent";
      if (!buckets[timeKey]) buckets[timeKey] = { high: 0, medium: 0, low: 0 };
      buckets[timeKey][inc.level.toLowerCase() as "high" | "medium" | "low"]++;
    });
    return Object.entries(buckets)
      .reverse()
      .map(([time, counts]) => ({ time, ...counts }));
  }, [incidents]);

  const totalIncidents = incidents.length;
  const highCount = incidents.filter((i) => i.level === "HIGH").length;
  const criticalCount = incidents.filter((i) => i.score >= 80).length;
  const monitoredCount = incidents.filter((i) => i.action === "MONITOR").length;

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: SD.bg }}
    >
      {/* Background blobs */}
      <div
        className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] z-0 pointer-events-none"
        style={{ background: "rgba(16, 185, 129, 0.1)" }}
      />
      <div
        className="fixed bottom-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full blur-[120px] z-0 pointer-events-none"
        style={{ background: "rgba(16, 185, 129, 0.05)" }}
      />

      {/* Fixed Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shrink-0 fixed top-0 left-0 right-0 h-20 z-50 flex items-center"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${SD.glassBorder}`,
        }}
      >
        <div className="max-w-7xl w-full mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${SD.glassBorder}` }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: "rgba(255,255,255,0.6)" }} />
            </Link>
            <div className="h-8 w-[1px]" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div>
              <h1 className="font-serif text-2xl tracking-tighter" style={{ color: SD.text }}>Analytics</h1>
              <p className="text-[10px] font-tech tracking-[0.1em] uppercase" style={{ color: "rgba(250,250,250,0.4)" }}>Real-time incident insights</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${SD.glassBorder}` }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: SD.emerald }}
            />
            <span className="font-tech text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Live Updates</span>
          </div>
        </div>
      </motion.header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-20 px-6 py-10 space-y-10 z-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ShimmerCard delay={0.1} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(59, 130, 246, 0.1)" }}>
                <BarChart3 className="w-5 h-5" style={{ color: COLORS.blue }} />
              </div>
              <span className="font-tech text-[10px] tracking-widest uppercase" style={{ color: SD.textMuted }}>Total</span>
            </div>
            <div className="font-serif text-4xl tracking-tight" style={{ color: SD.text }}>{totalIncidents.toLocaleString()}</div>
          </ShimmerCard>

          <ShimmerCard delay={0.2} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
                <AlertTriangle className="w-5 h-5" style={{ color: COLORS.red }} />
              </div>
              <span className="font-tech text-[10px] tracking-widest uppercase" style={{ color: SD.textMuted }}>High</span>
            </div>
            <div className="font-serif text-4xl tracking-tight" style={{ color: COLORS.red }}>{highCount}</div>
          </ShimmerCard>

          <ShimmerCard delay={0.3} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                <TrendingUp className="w-5 h-5" style={{ color: COLORS.amber }} />
              </div>
              <span className="font-tech text-[10px] tracking-widest uppercase" style={{ color: SD.textMuted }}>Critical</span>
            </div>
            <div className="font-serif text-4xl tracking-tight" style={{ color: COLORS.amber }}>{criticalCount}</div>
          </ShimmerCard>

          <ShimmerCard delay={0.4} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
                <Shield className="w-5 h-5" style={{ color: COLORS.green }} />
              </div>
              <span className="font-tech text-[10px] tracking-widest uppercase" style={{ color: SD.textMuted }}>Monitored</span>
            </div>
            <div className="font-serif text-4xl tracking-tight" style={{ color: COLORS.green }}>{monitoredCount}</div>
          </ShimmerCard>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Severity Donut - Left column, spans 2 rows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-4 lg:row-span-2"
          >
            <ShimmerCard delay={0.5} className="p-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <PieChartIcon className="text-xl" style={{ color: COLORS.blue }} />
                <div>
                  <h3 className="font-serif text-xl tracking-tight" style={{ color: SD.text }}>Severity</h3>
                  <p className="text-[10px] font-tech uppercase tracking-widest" style={{ color: SD.textMuted }}>Distribution by level</p>
                </div>
              </div>
              <DonutChart data={severityData} />
              <div className="mt-8 space-y-3">
                {severityData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>{item.name}</span>
                    </div>
                    <span className="font-tech">
                      {incidents.length > 0 ? Math.round((item.value / incidents.length) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </ShimmerCard>
          </motion.div>

          {/* Timeline - Right top, spans 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-8"
          >
            <ShimmerCard delay={0.6} className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="text-xl" style={{ color: SD.emerald }} />
                <div>
                  <h3 className="font-serif text-xl tracking-tight" style={{ color: SD.text }}>Timeline</h3>
                  <p className="text-[10px] font-tech uppercase tracking-widest" style={{ color: SD.textMuted }}>Incident trends over time</p>
                </div>
              </div>
              <TimelineChart data={timeSeriesData} />
            </ShimmerCard>
          </motion.div>

          {/* MITRE Tactics - Left bottom, spans 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-4"
          >
            <ShimmerCard delay={0.7} className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-xl" style={{ color: COLORS.purple }} />
                <div>
                  <h3 className="font-serif text-xl tracking-tight" style={{ color: SD.text }}>MITRE Tactics</h3>
                  <p className="text-[10px] font-tech uppercase tracking-widest" style={{ color: SD.textMuted }}>Top attack patterns</p>
                </div>
              </div>
              <MiterBarChart data={mitreData} />
            </ShimmerCard>
          </motion.div>

          {/* Actions - Right bottom, spans 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-4"
          >
            <ShimmerCard delay={0.8} className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-xl" style={{ color: COLORS.amber }} />
                <div>
                  <h3 className="font-serif text-xl tracking-tight" style={{ color: SD.text }}>Actions</h3>
                  <p className="text-[10px] font-tech uppercase tracking-widest" style={{ color: SD.textMuted }}>Response distribution</p>
                </div>
              </div>
              <div className="relative h-32 w-32 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
                  {actionData.length > 0 ? (
                    <>
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke={COLORS.green} strokeWidth="16" strokeDasharray="251" strokeDashoffset="100" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke={COLORS.red} strokeWidth="16" strokeDasharray="251" strokeDashoffset="220" strokeLinecap="butt" style={{ transform: "rotate(150deg)", transformOrigin: "50px 50px" }} />
                    </>
                  ) : (
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="16" />
                  )}
                </svg>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.green }} />
                  <span className="text-[10px] font-tech uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.red }} />
                  <span className="text-[10px] font-tech uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Block</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.blue }} />
                  <span className="text-[10px] font-tech uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Archive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.purple }} />
                  <span className="text-[10px] font-tech uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Escalate</span>
                </div>
              </div>
            </ShimmerCard>
          </motion.div>

          {/* Endpoint Bar Chart - Full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12"
          >
            <ShimmerCard delay={0.9} className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="text-xl" style={{ color: COLORS.cyan }} />
                <div>
                  <h3 className="font-serif text-xl tracking-tight" style={{ color: SD.text }}>Top Endpoints</h3>
                  <p className="text-[10px] font-tech uppercase tracking-widest" style={{ color: SD.textMuted }}>Most targeted API routes</p>
                </div>
              </div>
              <EndpointBars data={endpointData} />
            </ShimmerCard>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="py-12 flex flex-col items-center gap-4">
          <Link
            to="/"
            className="text-xs font-tech uppercase tracking-[0.3em] transition-colors duration-500 hover:!text-emerald-500"
            style={{ color: SD.textDimmest }}
          >
            Back to Monitor
          </Link>
          <p className="text-[9px] font-tech uppercase tracking-[0.5em]" style={{ color: "rgba(255,255,255,0.1)" }}>
            Neural Dynamics // Analytics Engine v2.4
          </p>
        </footer>
      </div>
    </div>
  );
}
