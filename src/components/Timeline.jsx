import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  UtensilsCrossed,
  Wine,
  Zap,
  Beer,
  Music2,
} from 'lucide-react'

const events = [
  {
    time:    '11:30 — 13:00',
    phase:   '高雅午宴期',
    title:   '享用主餐',
    desc:    '入座、享用精心準備的午宴，一切還很優雅。',
    music:   'Chill-out · R&B',
    icon:    UtensilsCrossed,
    color:   'from-amber-600 to-orange-500',
    glow:    '#f97316',
    border:  'border-orange-500/40',
    badge:   'bg-orange-500/10 text-orange-300',
    energy:  1,
  },
  {
    time:    '13:00 — 13:30',
    phase:   '敬酒時刻',
    title:   '逐桌敬酒，酒精發酵的開始',
    desc:    '新人逐桌感謝，氣氛開始微妙升溫。你的第一杯可能還沒空。',
    music:   '輕快 Funk · Disco',
    icon:    Wine,
    color:   'from-rose-500 to-pink-500',
    glow:    '#ec4899',
    border:  'border-pink-500/40',
    badge:   'bg-pink-500/10 text-pink-300',
    energy:  2,
  },
  {
    time:    '13:30 — 13:45',
    phase:   '派對啟動',
    title:   '宣布派對開始！',
    desc:    '敬完最後一桌，DJ 切換模式，House 重拍落下的瞬間，一切變了。',
    music:   'House 重拍落下',
    icon:    Zap,
    color:   'from-yellow-400 to-amber-500',
    glow:    '#fbbf24',
    border:  'border-yellow-400/50',
    badge:   'bg-yellow-400/10 text-yellow-300',
    energy:  3,
    highlight: true,
  },
  {
    time:    '13:45 — 14:15',
    phase:   '吧台狂歡',
    title:   '「烏魚子小公煮」限定 Shot 吧台開張',
    desc:    '主廚現做烏魚子搭配精選 Shot，全場限定體驗，錯過不補。',
    music:   'Deep House · Afro Beat',
    icon:    Beer,
    color:   'from-amber-500 to-yellow-400',
    glow:    '#f59e0b',
    border:  'border-amber-400/40',
    badge:   'bg-amber-400/10 text-amber-300',
    energy:  4,
  },
  {
    time:    '14:15 — 15:00',
    phase:   '舞池爆發',
    title:   '全場離開座位，瘋狂搖擺',
    desc:    '草地舞池全面開放。這一刻，你的鞋子是敵人。',
    music:   'Peak Hour Mix · EDM',
    icon:    Music2,
    color:   'from-violet-500 to-purple-600',
    glow:    '#a855f7',
    border:  'border-violet-500/40',
    badge:   'bg-violet-500/10 text-violet-300',
    energy:  5,
  },
]

function EnergyBar({ level }) {
  return (
    <div className="flex gap-0.5 mt-2" aria-label={`能量等級 ${level}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i < level ? 'bg-orange-400' : 'bg-zinc-700'
          }`}
          style={i < level ? { boxShadow: '0 0 4px #fb923c' } : {}}
        />
      ))}
    </div>
  )
}

function TimelineItem({ event, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const Icon = event.icon
  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
      className={`relative flex ${isLeft ? 'justify-start' : 'justify-end'} mb-8`}
    >
      {/* Card */}
      <div
        className={`w-full max-w-sm bg-zinc-900/80 border ${event.border} rounded-2xl p-5 backdrop-blur-sm
          ${event.highlight ? 'ring-1 ring-yellow-400/30' : ''}`}
        style={
          event.highlight
            ? { boxShadow: `0 0 24px ${event.glow}44, 0 4px 24px rgba(0,0,0,0.5)` }
            : { boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }
        }
      >
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Icon bubble */}
          <div
            className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center`}
            style={{ boxShadow: `0 0 12px ${event.glow}66` }}
          >
            <Icon size={18} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono text-zinc-500 tracking-wider mb-0.5">
              {event.time}
            </p>
            <p className={`text-[11px] font-medium rounded-full inline-block px-2 py-0.5 ${event.badge}`}>
              {event.phase}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-white leading-snug mb-1.5">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-3">
          {event.desc}
        </p>

        {/* Music tag */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Music2 size={11} />
          <span className="tracking-wide">{event.music}</span>
        </div>

        {/* Energy bar */}
        <EnergyBar level={event.energy} />
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      {/* Section glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, #f97316, #fbbf24, #f97316, transparent)',
          boxShadow: '0 0 30px 10px rgba(249,115,22,0.15)',
        }}
      />

      {/* Section header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500/70 mb-3">
          Party Schedule
        </p>
        <h2 className="font-display text-4xl md:text-5xl gradient-text-sunset">
          狂歡進程
        </h2>
        <p className="mt-3 text-zinc-500 text-sm tracking-wide">
          從優雅晚宴到極致瘋狂，我們替你排好了。
        </p>
      </motion.div>

      {/* Vertical spine line */}
      <div className="relative max-w-lg mx-auto">
        {/* Center line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px pointer-events-none hidden sm:block"
          style={{
            background:
              'linear-gradient(180deg, #f97316 0%, #ec4899 50%, #a855f7 100%)',
            opacity: 0.25,
          }}
        />

        {events.map((event, i) => (
          <TimelineItem key={i} event={event} index={i} />
        ))}
      </div>
    </section>
  )
}
