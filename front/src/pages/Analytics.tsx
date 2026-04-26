import { motion } from "framer-motion";
import { useIncidentsStream } from "@/hooks/useIncidentsStream";
import { Shield, TrendingUp, AlertTriangle, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMemo, useRef } from "react";

const COLORS = {
  red: "var(--soc-red)",
  amber: "var(--soc-amber)",
  green: "var(--soc-green)",
  blue: "var(--soc-blue)",
  purple: "#a855f7",
  cyan: "#06b6d4",
};

// Superdesign color palette
const SD = {
  bg: "var(--soc-bg)",
  text: "var(--soc-text)",
  textMuted: "var(--soc-text-secondary)",
  textTertiary: "var(--soc-text-tertiary)",
  textDimmest: "var(--soc-text-quaternary)",
  glassBg: "var(--soc-surface)",
  glassBorder: "var(--soc-border)",
  emerald: "var(--soc-green)",
  surface: "var(--soc-surface2)",
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
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.12), transparent 40%)`,
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

  // Build segments: each has dashLen (arc length) and where it starts in the circle
  const segments: { dashLen: number; dashOffset: number; color: string }[] = [];
  let accumulated = 0;

  data.forEach((entry) => {
    const proportion = total > 0 ? entry.value / total : 0;
    const dashLen = circumference * proportion;
    const dashOffset = circumference - accumulated;
    segments.push({ dashLen, dashOffset, color: entry.color });
    accumulated += dashLen;
  });

  return (
    <div className="relative aspect-square w-full max-w-[240px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <circle cx={cx} cy={cy} r={radius} fill="transparent" stroke={SD.glassBorder} strokeWidth={strokeWidth} />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="transparent"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.dashLen} ${circumference - seg.dashLen}`}
            strokeDashoffset={seg.dashOffset}
            strokeLinecap="butt"
          />
        ))}
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

  // Y-axis tick positions and labels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: padding + (height - padding * 2) * pct,
    label: Math.round(maxVal * (1 - pct)),
  }));

  // X-axis: show every Nth label so they don't crowd
  const labelStep = Math.max(1, Math.floor(data.length / 6));
  const xLabels = data.filter((_, i) => i % labelStep === 0 || i === data.length - 1);

  return (
    <div className="h-[240px] w-full relative flex">
      {/* Y-axis labels */}
      <div className="flex flex-col justify-between pr-3 pb-6" style={{ height: height - padding * 2 }}>
        {yTicks.map((tick, i) => (
          <span key={i} className="text-[9px] font-tech text-right leading-none" style={{ color: SD.textDimmest }}>
            {tick.label}
          </span>
        ))}
      </div>

      <div className="flex-1">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: SD.emerald, stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: SD.emerald, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={`${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`} fill="url(#gradEmerald)" />
          <path d={pathD} fill="none" stroke={SD.emerald} strokeWidth="2" />
          {yTicks.map((tick, i) => (
            <line
              key={i}
              x1={padding}
              y1={tick.y}
              x2={width - padding}
              y2={tick.y}
              stroke={SD.glassBorder}
              strokeDasharray="4"
            />
          ))}
        </svg>
        <div className="flex justify-between mt-2 px-1">
          {xLabels.map((d, globalIdx) => {
            const originalIdx = data.findIndex((x) => x === d);
            return (
              <span key={globalIdx} className="text-[9px] font-tech uppercase" style={{ color: SD.textDimmest }}>
                {d.time}
              </span>
            );
          })}
        </div>
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
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: SD.surface }}>
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
function EndpointBars({ data }: { data: { name: string; value: number; risk?: "low" | "medium" | "high" }[] }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const riskColor = (risk?: "low" | "medium" | "high") =>
    risk === "high" ? COLORS.red : risk === "medium" ? COLORS.amber : COLORS.green;
  return (
    <div className="flex items-end gap-6 h-[200px] px-4 overflow-x-auto">
      {data.slice(0, 8).map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-3">
          <div className="w-full rounded-t-lg relative group h-full flex flex-col justify-end">
            <div
              className="absolute inset-x-0 bottom-0 rounded-t-lg transition-all duration-1000"
              style={{ height: `${maxVal > 0 ? (item.value / maxVal) * 100 : 0}%`, background: riskColor(item.risk) }}
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

  // Predefined endpoint categories
  const PREDEF_ENDPOINTS = [
    // Low-risk (health/metrics/info)
    { name: "/api/v1/health", risk: "low" as const },
    { name: "/api/v1/metrics", risk: "low" as const },
    { name: "/api/v1/users", risk: "low" as const },
    { name: "/api/v1/dashboard", risk: "low" as const },
    { name: "/api/v2/stream", risk: "low" as const },
    { name: "/webhook", risk: "low" as const },
    // Medium-risk (login/auth — brute-force targets)
    { name: "/login", risk: "medium" as const },
    { name: "/api/v1/auth/login", risk: "medium" as const },
    { name: "/api/v1/auth/logout", risk: "medium" as const },
    { name: "/register", risk: "medium" as const },
    // High-risk (admin/config — sqlmap/scanner targets)
    { name: "/admin", risk: "high" as const },
    { name: "/admin/panel", risk: "high" as const },
    { name: "/admin/users", risk: "high" as const },
    { name: "/api/v1/settings", risk: "high" as const },
    { name: "/api/v1/profile", risk: "high" as const },
    { name: "/config", risk: "high" as const },
    { name: "/etc/config", risk: "high" as const },
    // Path traversal / enumeration targets
    { name: "/usr", risk: "high" as const },
    { name: "/bin", risk: "high" as const },
    { name: "/api/v1/logs", risk: "medium" as const },
    { name: "/api/v1/alerts", risk: "medium" as const },
    // Destructive methods
    { name: "_DELETE_", risk: "high" as const },
    { name: "_PUT_", risk: "high" as const },
  ];

  const endpointData = useMemo(() => {
    const counts: Record<string, number> = {};
    PREDEF_ENDPOINTS.forEach(({ name }) => { counts[name] = 0; });

    incidents.forEach((inc) => {
      const method = inc.parsed["Request Method"];
      const ep = inc.endpoint;

      // Check for DELETE/PUT first
      if (method === "DELETE") {
        counts["_DELETE_"] = (counts["_DELETE_"] || 0) + 1;
      } else if (method === "PUT") {
        counts["_PUT_"] = (counts["_PUT_"] || 0) + 1;
      } else {
        // Match predefined endpoints
        const matched = PREDEF_ENDPOINTS.find(({ name }) =>
          name !== "_DELETE_" && name !== "_PUT_" && ep.includes(name)
        );
        if (matched) {
          counts[matched.name] = (counts[matched.name] || 0) + 1;
        } else {
          // Fallback: use first path segment
          const seg = "/" + ep.split("/")[1];
          counts[seg] = (counts[seg] || 0) + 1;
        }
      }
    });

    return PREDEF_ENDPOINTS
      .map(({ name, risk }) => ({ name, value: counts[name] || 0, risk }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
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
    if (incidents.length === 0) return [];
    // Bucket into 5-minute intervals
    const intervalMs = 5 * 60 * 1000;
    const startTime = Date.now() - (incidents.length - 1) * 5 * 1000;
    const firstBucketTime = Math.floor(startTime / intervalMs) * intervalMs;

    const buckets: Record<number, { high: number; medium: number; low: number }> = {};
    incidents.forEach((inc, idx) => {
      const incidentTime = startTime + idx * 5 * 1000;
      const bucketKey = Math.round((incidentTime - firstBucketTime) / intervalMs);
      if (!buckets[bucketKey]) buckets[bucketKey] = { high: 0, medium: 0, low: 0 };
      buckets[bucketKey][inc.level.toLowerCase() as "high" | "medium" | "low"]++;
    });

    return Object.entries(buckets)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([bucketIdx, counts]) => {
        const ms = firstBucketTime + Number(bucketIdx) * intervalMs;
        const ts = new Date(ms).toISOString().slice(11, 19);
        return { time: ts, ...counts };
      });
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
        style={{ background: "rgba(34, 197, 94, 0.1)" }}
      />
      <div
        className="fixed bottom-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full blur-[120px] z-0 pointer-events-none"
        style={{ background: "rgba(34, 197, 94, 0.05)" }}
      />

      {/* Fixed Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shrink-0 fixed top-0 left-0 right-0 h-20 z-50 flex items-center"
        style={{
          background: SD.glassBg,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${SD.glassBorder}`,
        }}
      >
        <div className="w-full px-5 flex items-center">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              style={{ background: SD.surface, border: `1px solid ${SD.glassBorder}` }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: SD.textMuted }} />
            </Link>
            <div className="h-8 w-[1px]" style={{ background: SD.glassBorder }} />
            <div>
              <h1 className="font-serif text-2xl tracking-tighter" style={{ color: SD.text }}>Analytics</h1>
              <p className="text-[10px] font-tech tracking-[0.1em] uppercase" style={{ color: SD.textTertiary }}>Real-time incident insights</p>
            </div>
          </div>

        </div>
      </motion.header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-20 px-6 py-10 space-y-10 z-10">
        {/* Stats Overview */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                      <span style={{ color: SD.textMuted }}>{item.name}</span>
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
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke={SD.glassBorder} strokeWidth="16" />
                  {actionData.length > 0 ? (
                    <>
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke={COLORS.green} strokeWidth="16" strokeDasharray="251" strokeDashoffset="100" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke={COLORS.red} strokeWidth="16" strokeDasharray="251" strokeDashoffset="220" strokeLinecap="butt" style={{ transform: "rotate(150deg)", transformOrigin: "50px 50px" }} />
                    </>
                  ) : (
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke={SD.glassBorder} strokeWidth="16" />
                  )}
                </svg>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.green }} />
                  <span className="text-[10px] font-tech uppercase" style={{ color: SD.textMuted }}>Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.red }} />
                  <span className="text-[10px] font-tech uppercase" style={{ color: SD.textMuted }}>Block</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.blue }} />
                  <span className="text-[10px] font-tech uppercase" style={{ color: SD.textMuted }}>Archive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.purple }} />
                  <span className="text-[10px] font-tech uppercase" style={{ color: SD.textMuted }}>Escalate</span>
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
