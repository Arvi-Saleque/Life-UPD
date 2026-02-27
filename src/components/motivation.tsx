"use client";

import { motion } from "framer-motion";
import { Lightbulb, Brain, Coffee, Flame, Heart, Star } from "lucide-react";
import { useState, useEffect } from "react";

const TIPS = [
  {
    icon: Brain,
    tip: "Use the Pomodoro technique — 25 min focus, 5 min break. Repeat.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Coffee,
    tip: "Don't skip meals before exams. Your brain needs fuel to perform.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Flame,
    tip: "Start with the hardest subject first when your energy is highest.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Heart,
    tip: "Sleep > Last-minute cramming. 7+ hours the night before a CT.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Star,
    tip: "Review notes within 24 hours of a lecture to retain 80% more.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Lightbulb,
    tip: "Teach a concept to a friend — if you can explain it, you know it.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export function Motivation() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = TIPS[tipIndex];
  const Icon = currentTip.icon;

  return (
    <section className="relative py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="relative px-5 py-5 sm:px-8 sm:py-6">
            {/* Background accent */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/5 to-violet-500/5 blur-2xl" />

            <div className="relative flex items-start gap-4 sm:items-center">
              <motion.div
                key={tipIndex}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${currentTip.bg}`}
              >
                <Icon className={`h-5 w-5 ${currentTip.color}`} />
              </motion.div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">
                  Student Pro Tip
                </p>
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm sm:text-base text-slate-300 leading-relaxed"
                >
                  {currentTip.tip}
                </motion.p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="mt-4 flex justify-center gap-1.5">
              {TIPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTipIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === tipIndex
                      ? "w-6 bg-blue-400"
                      : "w-1.5 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Tip ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
