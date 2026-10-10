"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCardEffects({ className }: { className?: string }) {
  return (
    <span className={cn("stat-card-effects pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <motion.span
        className="absolute size-12 rounded-full bg-white/20 blur-xl"
        animate={{ top: ["10%", "10%", "75%", "75%", "10%"], left: ["10%", "80%", "80%", "10%", "10%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="absolute left-1/2 top-1/2 h-[50px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="absolute left-[10%] top-[12%] h-px w-[80%] bg-gradient-to-r from-white/30 to-transparent"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.span
        className="absolute bottom-[12%] left-[10%] h-px w-[80%] bg-gradient-to-r from-transparent to-white/30"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </span>
  );
}

export default function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div className={cn("relative h-[250px] w-[300px] overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-[2px]", className)}>
      <StatCardEffects />
      <div className="relative flex size-full flex-col items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-neutral-900/80 to-black/60 backdrop-blur-md">
        <motion.div
          className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-5xl font-extrabold text-transparent"
          animate={{ textShadow: ["0 0 10px rgba(255,255,255,0.6)", "0 0 2px rgba(255,255,255,0.2)", "0 0 10px rgba(255,255,255,0.6)"] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {value}
        </motion.div>
        <div className="mt-3 text-sm tracking-wide text-neutral-400">{label}</div>
      </div>
    </div>
  );
}
