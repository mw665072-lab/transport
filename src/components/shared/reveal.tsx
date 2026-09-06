"use client";
import { motion, useReducedMotion } from "framer-motion";
export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) { const reduce = useReducedMotion(); return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .4, ease: "easeOut" }}>{children}</motion.div>; }
