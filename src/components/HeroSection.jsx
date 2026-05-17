import { motion } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut', delay },
  }),
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden">

      {/* Warm radial glow behind headline */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(249,115,22,0.18) 0%, rgba(234,88,12,0.08) 50%, transparent 80%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Decorative string-light row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="flex gap-3 mb-10 px-4"
        aria-hidden="true"
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{
              background: ['#fbbf24','#fb923c','#f9a8d4','#a3e635','#67e8f9'][i % 5],
              animationDelay: `${i * 0.18}s`,
              boxShadow: `0 0 6px 2px ${ ['#fbbf24','#fb923c','#f9a8d4','#a3e635','#67e8f9'][i % 5] }55`,
            }}
          />
        ))}
      </motion.div>

      {/* Eyebrow */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="text-xs uppercase tracking-[0.35em] text-amber-400/80 mb-4 font-light"
      >
        Yacht Harbour Wedding · 2026
      </motion.p>

      {/* Main title */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="font-display text-center leading-tight mb-2"
        style={{ fontSize: 'clamp(2.6rem, 10vw, 5.5rem)' }}
      >
        <span className="gradient-text-sunset animate-glow-pulse block">
          Griffey
        </span>
        <span className="text-zinc-400 text-2xl md:text-3xl font-light tracking-widest block my-1">
          &amp;
        </span>
        <span className="gradient-text-gold animate-glow-pulse block">
          Evon
        </span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.55}
        className="mt-6 text-center text-zinc-300 text-lg md:text-xl font-light leading-relaxed max-w-xs md:max-w-md"
      >
        這不是一場喜宴，
        <br />
        <span className="text-amber-400 font-medium text-glow-gold">
          是一場極致的狂歡派對。
        </span>
      </motion.p>

      {/* Date & Location badges */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.75}
        className="mt-10 flex flex-col sm:flex-row gap-3 items-center"
      >
        <div className="flex items-center gap-2 bg-zinc-900/70 border border-orange-500/30 rounded-full px-5 py-2.5 neon-border">
          <CalendarDays size={15} className="text-amber-400" />
          <span className="text-sm tracking-widest text-amber-300 font-medium">
            2026 · 11 · 07
          </span>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/70 border border-zinc-700/50 rounded-full px-5 py-2.5">
          <MapPin size={15} className="text-pink-400" />
          <span className="text-sm tracking-wide text-zinc-300">
            福爾摩沙遊艇酒店
          </span>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/70 border border-amber-500/30 rounded-full px-5 py-2.5">
          <span className="text-amber-400 text-sm">🕐</span>
          <span className="text-sm tracking-widest text-amber-300 font-medium">
            11:30 入場
          </span>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: [0, 1, 0], y: [0, 12, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-orange-500/60 to-transparent" />
      </motion.div>
    </section>
  )
}
