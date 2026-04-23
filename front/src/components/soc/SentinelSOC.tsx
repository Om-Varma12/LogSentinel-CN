import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIncidentsStream } from "@/hooks/useIncidentsStream";
import IncidentCard from "./IncidentCard";
import IncidentDetail from "./IncidentDetail";
import TerminalPanel from "./TerminalPanel";
import { Shield, AlertTriangle, AlertCircle, Info, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const INCIDENTS_PER_PAGE = 10;

export default function SentinelSOC() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { incidents, terminal } = useIncidentsStream();

  const stats = {
    total: incidents.length,
    high: incidents.filter(i => i.level === 'HIGH').length,
    medium: incidents.filter(i => i.level === 'MEDIUM').length,
    low: incidents.filter(i => i.level === 'LOW').length,
  };

  const selectedIncident = incidents.find(i => i.id === selectedId);
  const totalPages = Math.ceil(incidents.length / INCIDENTS_PER_PAGE);
  const paginatedIncidents = incidents.slice(
    (currentPage - 1) * INCIDENTS_PER_PAGE,
    currentPage * INCIDENTS_PER_PAGE
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.21, 1.02, 0.73, 1] }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full flex flex-col p-5 gap-6 overflow-hidden bg-soc-bg"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 1.02, 0.73, 1] }}
        className="flex justify-between items-center border-b border-soc-border-strong pb-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-soc-text">LogSentinel</h1>
            <p className="text-xs text-soc-text-tertiary mt-0.5">Security Operations Center</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-soc-surface border border-soc-border"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-soc-green"
          />
          <span className="text-xs font-medium text-soc-text-secondary tracking-wide">LIVE</span>
        </motion.div>

        <Link
          to="/analytics"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-soc-surface border border-soc-border hover:border-soc-border-strong transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-soc-blue" />
          <span className="text-xs font-medium text-soc-text-secondary">Analytics</span>
        </Link>
      </motion.header>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Main Content */}
        <div className="w-3/4 flex flex-col gap-5 min-h-0">
          <AnimatePresence mode="wait">
            {!selectedId ? (
              <motion.div
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5 h-full"
              >
                {/* Stats Grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-4 gap-4"
                >
                  <motion.div
                    variants={itemVariants}
                    className="bg-soc-surface border border-soc-border rounded-xl p-5 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-soc-surface3 flex items-center justify-center">
                          <Info className="w-4 h-4 text-soc-text-secondary" />
                        </div>
                        <span className="text-xs font-medium text-soc-text-tertiary uppercase tracking-wider">Total</span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display text-3xl font-bold tabular-nums text-soc-text"
                      >
                        {String(stats.total).padStart(3, '0')}
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-soc-surface border border-soc-border rounded-xl p-5 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-soc-red-muted/20 to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-soc-red-muted flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-soc-red" />
                        </div>
                        <span className="text-xs font-medium text-soc-text-tertiary uppercase tracking-wider">High</span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display text-3xl font-bold tabular-nums text-soc-red"
                      >
                        {String(stats.high).padStart(3, '0')}
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-soc-surface border border-soc-border rounded-xl p-5 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-soc-amber-muted/20 to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-soc-amber-muted flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-soc-amber" />
                        </div>
                        <span className="text-xs font-medium text-soc-text-tertiary uppercase tracking-wider">Medium</span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display text-3xl font-bold tabular-nums text-soc-amber"
                      >
                        {String(stats.medium).padStart(3, '0')}
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-soc-surface border border-soc-border rounded-xl p-5 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-soc-green-muted/20 to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-soc-green-muted flex items-center justify-center">
                          <Info className="w-4 h-4 text-soc-green" />
                        </div>
                        <span className="text-xs font-medium text-soc-text-tertiary uppercase tracking-wider">Low</span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display text-3xl font-bold tabular-nums text-soc-green"
                      >
                        {String(stats.low).padStart(3, '0')}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* List with pagination */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3"
                >
                  {paginatedIncidents.map((inc, index) => (
                    <motion.div
                      key={inc.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(index * 0.05, 0.5),
                        ease: [0.21, 1.02, 0.73, 1]
                      }}
                    >
                      <IncidentCard
                        incident={inc}
                        onClick={() => setSelectedId(inc.id)}
                      />
                    </motion.div>
                  ))}

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center gap-2 py-4 mt-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 rounded-lg bg-soc-surface border border-soc-border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-soc-border-strong transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-soc-text-secondary" />
                      </motion.button>

                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <motion.button
                            key={page}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                              currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "bg-soc-surface border border-soc-border text-soc-text-secondary hover:border-soc-border-strong"
                            }`}
                          >
                            {page}
                          </motion.button>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-9 h-9 rounded-lg bg-soc-surface border border-soc-border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-soc-border-strong transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-soc-text-secondary" />
                      </motion.button>
                    </motion.div>
                  )}

                  <div className="text-center text-xs text-soc-text-quaternary pb-2">
                    Showing {Math.min((currentPage - 1) * INCIDENTS_PER_PAGE + 1, incidents.length)}–{Math.min(currentPage * INCIDENTS_PER_PAGE, incidents.length)} of {incidents.length} incidents
                  </div>
                </motion.div>
              </motion.div>
            ) : selectedIncident ? (
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.21, 1.02, 0.73, 1] }}
                className="flex-1 flex flex-col min-h-0"
              >
                <IncidentDetail
                  incident={selectedIncident}
                  onBack={() => setSelectedId(null)}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Terminal */}
        <TerminalPanel lines={terminal} />
      </div>
    </motion.div>
  );
}
