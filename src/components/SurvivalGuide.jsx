import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shirt, Star, Camera, Waves, ChefHat } from 'lucide-react'

const highlights = [
  {
    icon:  ChefHat,
    title: '烏魚子 Live Station',
    desc:  '主廚現切現烤金黃烏魚子，搭配限定 Shot，只此一次。',
    color: 'from-amber-500 to-yellow-400',
    glow:  '#fbbf24',
    tag:   '限定體驗',
  },
  {
    icon:  Camera,
    title: '隨機即可拍捕捉醜照',
    desc:  '場內隨機流竄的即可拍，沒有濾鏡、沒有美顏，只有真實狂歡。',
    color: 'from-pink-500 to-rose-400',
    glow:  '#ec4899',
    tag:   '必玩',
  },
  {
    icon:  Waves,
    title: '草地舞池狂歡',
    desc:  '脫鞋、脫外套，全場解放。草地是最好的舞台。',
    color: 'from-green-500 to-emerald-400',
    glow:  '#34d399',
    tag:   '全場必到',
  },
]

function HighlightCard({ item, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon   = item.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className="relative bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 overflow-hidden backdrop-blur-sm"
      style={{ boxShadow: `0 0 0 1px ${item.glow}20, 0 8px 32px rgba(0,0,0,0.4)` }}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${item.glow}30 0%, transparent 70%)`,
        }}
      />

      {/* Tag */}
      <span
        className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block"
        style={{
          background: `${item.glow}18`,
          color:      item.glow,
          border:     `1px solid ${item.glow}40`,
        }}
      >
        {item.tag}
      </span>

      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}
          style={{ boxShadow: `0 0 12px ${item.glow}55` }}
        >
          <Icon size={18} className="text-white" />
        </div>
        <h3 className="font-display text-lg text-white leading-tight">
          {item.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 leading-relaxed">
        {item.desc}
      </p>
    </motion.div>
  )
}

export default function SurvivalGuide() {
  const headerRef    = useRef(null)
  const dressRef     = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const dressInView  = useInView(dressRef,  { once: true, margin: '-60px' })

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      {/* Top divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, #a855f7, #ec4899, #a855f7, transparent)',
          boxShadow: '0 0 20px 6px rgba(168,85,247,0.12)',
        }}
      />

      {/* Section header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-violet-400/70 mb-3">
          Survival Guide
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-white">
          派對
          <span className="gradient-text-sunset"> 生存指南</span>
        </h2>
        <p className="mt-3 text-zinc-500 text-sm">
          帶著這份指南，你絕對不會錯過任何精彩。
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto space-y-6">

        {/* Dress Code Card */}
        <motion.div
          ref={dressRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={dressInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative bg-zinc-900/80 border border-orange-500/30 rounded-2xl p-6 overflow-hidden"
          style={{
            boxShadow: '0 0 0 1px rgba(249,115,22,0.15), 0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Background shimmer */}
          <div className="absolute inset-0 bg-shimmer pointer-events-none opacity-40" />

          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shrink-0 neon-border">
              <Shirt size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-display text-xl text-white">Dress Code</h3>
                <Star size={13} className="text-amber-400 fill-amber-400" />
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                別穿太緊！晚宴後請隨時準備
                <span className="text-amber-400 font-medium"> 脫掉西裝外套、換上平底鞋</span>。
                今晚的重點是
                <span className="text-orange-400 font-medium"> 草地、音樂跟微醺</span>。
              </p>
            </div>
          </div>
        </motion.div>

        {/* Highlights */}
        <div className="pt-2">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.35em] text-zinc-600 mb-5 text-center"
          >
            Must-Do Highlights
          </motion.p>
          <div className="space-y-4">
            {highlights.map((item, i) => (
              <HighlightCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center pt-6 pb-2"
        >
          <p className="text-zinc-600 text-xs tracking-widest uppercase mb-2">
            see you on the dance floor
          </p>
          <p
            className="font-display text-2xl gradient-text-sunset animate-glow-pulse"
          >
            Griffey &amp; Evon ♥
          </p>
        </motion.div>
      </div>
    </section>
  )
}
