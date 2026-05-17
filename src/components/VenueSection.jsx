import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Anchor, Waves, MapPin, Phone, ExternalLink, Sparkles, Ship, UtensilsCrossed, TreePine, Sunset } from 'lucide-react'

const VENUE_IMAGES = [
  {
    src: 'https://www.formosayacht.com.tw/upload/banner_list/twL_banner_24G16_v60y1Nuaf1.jpg',
    alt: '福爾摩沙遊艇酒店外觀',
  },
  {
    src: 'https://www.formosayacht.com.tw/upload/marqueepic_list/twL_marqueepic_22A12_2uriMk9f2Z.jpg',
    alt: '宴會廳',
  },
  {
    src: 'https://www.formosayacht.com.tw/upload/home_about_list/twL_home_about_22A25_y4vDGzKCdb.jpg',
    alt: '酒店環境',
  },
  {
    src: 'https://www.formosayacht.com.tw/upload/banner_list/twL_banner_22G06_v4SVrBX79e.jpg',
    alt: '酒店景色',
  },
]

const HIGHLIGHTS = [
  { icon: Ship,            label: '台灣唯一遊艇碼頭酒店', sub: '安平港水景灣畔' },
  { icon: Waves,           label: '無邊際泳池',           sub: '海天一色的療癒享受' },
  { icon: UtensilsCrossed, label: '星級廚師團隊',          sub: '威尼斯西餐廳 & 湖光中餐廳' },
  { icon: TreePine,        label: '私人花園草地',          sub: '戶外草地派對首選' },
  { icon: Anchor,          label: '遊艇碼頭體驗',          sub: '微醺後的浪漫海景' },
  { icon: Sunset,          label: '絕美落日景觀',          sub: '夕陽染金安平港' },
]

export default function VenueSection() {
  const headerRef    = useRef(null)
  const mapRef       = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const mapInView    = useInView(mapRef, { once: true, margin: '-60px' })

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      {/* Top glow divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #fbbf24, #f97316, #fbbf24, transparent)',
          boxShadow:  '0 0 30px 8px rgba(251,191,36,0.10)',
        }}
      />

      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(249,115,22,0.04) 0%, transparent 70%)',
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
        <p className="text-xs uppercase tracking-[0.4em] text-amber-500/70 mb-3">
          Venue
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-white">
          婚宴
          <span className="gradient-text-sunset"> 場地</span>
        </h2>
        <p className="mt-4 font-display italic text-zinc-400 text-lg tracking-wider">
          源起安平，緣聚 Formosa
        </p>
        <p className="mt-2 text-zinc-600 text-sm">
          台灣唯一擁有遊艇碼頭的酒店 · 安平港水景灣畔
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto space-y-6">

        {/* Main venue image card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src={VENUE_IMAGES[0].src}
            alt={VENUE_IMAGES[0].alt}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
            }}
          />
          {/* Hotel name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white font-display text-xl mb-0.5">福爾摩沙遊艇酒店</p>
            <p className="text-amber-300/80 text-xs tracking-widest">FORMOSA YACHT HOTEL</p>
          </div>
          {/* Top badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium tracking-wide"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(251,191,36,0.4)',
              color: '#fbbf24',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={10} />
            台南 · 安平
          </div>
        </motion.div>

        {/* Secondary images row */}
        <div className="grid grid-cols-3 gap-2">
          {VENUE_IMAGES.slice(1).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-xl overflow-hidden"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.parentElement.style.background = 'rgba(39,39,42,0.8)'
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Highlights grid */}
        <div className="grid grid-cols-2 gap-3">
          {HIGHLIGHTS.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{
                  background: 'rgba(24,24,27,0.7)',
                  border: '1px solid rgba(251,191,36,0.12)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(251,191,36,0.15))',
                    border: '1px solid rgba(249,115,22,0.25)',
                  }}
                >
                  <Icon size={14} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium leading-snug">{item.label}</p>
                  <p className="text-zinc-600 text-[11px] mt-0.5 leading-snug">{item.sub}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Address & Contact card */}
        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, y: 30 }}
          animate={mapInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            background: 'rgba(24,24,27,0.8)',
            border: '1px solid rgba(249,115,22,0.20)',
            boxShadow: '0 0 0 1px rgba(249,115,22,0.08), 0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-shimmer pointer-events-none opacity-30" />

          <div className="relative space-y-4">
            {/* Hotel name */}
            <div className="flex items-center gap-2">
              <Anchor size={16} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">福爾摩沙遊艇酒店</p>
                <p className="text-zinc-500 text-xs">Formosa Yacht Hotel</p>
              </div>
            </div>

            <div className="w-full h-px" style={{ background: 'rgba(249,115,22,0.15)' }} />

            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-300 text-sm">708 台南市安平區安平路 988 號</p>
                <p className="text-zinc-600 text-xs mt-0.5">No. 988, Anping Rd, Anping District, Tainan</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="text-orange-500 shrink-0" />
              <a
                href="tel:+886-6-391-1313"
                className="text-zinc-300 text-sm hover:text-amber-400 transition-colors"
              >
                06-3911313
              </a>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2 pt-1">
              <a
                href="https://maps.google.com/?q=福爾摩沙遊艇酒店+台南市安平區安平路988號"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                  color: '#fff',
                  boxShadow: '0 0 12px rgba(249,115,22,0.3)',
                }}
              >
                <MapPin size={12} />
                Google Maps 導航
              </a>
              <a
                href="https://www.formosayacht.com.tw/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#a1a1aa',
                }}
              >
                <ExternalLink size={12} />
                官網
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
