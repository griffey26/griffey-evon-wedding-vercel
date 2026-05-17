import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  User, Phone, Users, Send,
  CheckCircle2, AlertCircle, Baby, Salad, Heart,
  Home, Car, MapPin,
} from 'lucide-react'

const FORMSPREE_URL = 'https://formspree.io/f/maqlvvwn'
const GSHEET_URL    = 'https://script.google.com/macros/s/AKfycbzgWJ_VjrkcYzQAdFabtwb9TWxFzKKexjlSKTC6kVGt1OBUXREodY7ghyx--Kxfg3OGrQ/exec'

const ATTENDANCE_OPTIONS = [
  { value: 'attending',  label: '✅  我會到',        clean: '我會到',       showDetails: true  },
  { value: 'gift_only',  label: '🎁  禮到人不到',    clean: '禮到人不到',   showDetails: false },
  { value: 'blessing',   label: '🤍  不參加純祝福',  clean: '不參加純祝福', showDetails: false },
]

const ACCOM_FEATURES = [
  '🏊 戶外戲水池',
  '🍖 烤肉區',
  '🀄 手搓麻將',
  '🎤 KTV',
  '🛵 Gogoro 免費借',
  '🚗 停車場',
]

const inputBase =
  'w-full bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-white text-sm ' +
  'placeholder-zinc-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 ' +
  'focus:ring-orange-500/30 transition-all duration-200'

const slideDown = {
  initial:    { opacity: 0, height: 0 },
  animate:    { opacity: 1, height: 'auto' },
  exit:       { opacity: 0, height: 0 },
  transition: { duration: 0.35, ease: 'easeInOut' },
}

const INIT_FORM = {
  name: '', contact: '', attendance: '', message: '',
  guests: '2', highchairs: '0', veggie: '0',
  accommodation: '',
  accomGuests: '2', driving: '',
}

export default function RSVPSection() {
  const headerRef    = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  const [form,    setForm]    = useState(INIT_FORM)
  const [status,  setStatus]  = useState('idle')
  const [touched, setTouched] = useState({})

  const nameError    = touched.name    && form.name.trim() === ''
  const contactError = touched.contact && form.contact.trim() === ''

  const selectedAtt  = ATTENDANCE_OPTIONS.find(o => o.value === form.attendance)
  const isAttending  = form.attendance === 'attending'
  const wantsAccom   = isAttending && form.accommodation === 'yes'

  // 兒童椅上限 = 人數 - 1（至少留 1 位大人）
  // 素食上限   = 人數（全員皆可素食）
  const guestCount   = parseInt(form.guests) || 1
  const highchairMax = Math.max(0, guestCount - 1)
  const veggieMax    = guestCount

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => {
      const next = { ...prev, [name]: value }
      // 若人數調低，自動修正超過上限的值
      if (name === 'guests') {
        const newHCMax  = Math.max(0, parseInt(value) - 1)
        const newVegMax = parseInt(value)
        if (parseInt(next.highchairs) > newHCMax)  next.highchairs = String(newHCMax)
        if (parseInt(next.veggie)     > newVegMax) next.veggie     = String(newVegMax)
      }
      return next
    })
  }
  function handleBlur(e) {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, contact: true })
    if (!form.name.trim() || !form.contact.trim() || !form.attendance) return

    setStatus('submitting')
    try {
      const data = new FormData()
      data.append('_subject', '婚禮出席確認 - Griffey & Evon')
      data.append('姓名',       form.name)
      data.append('電話_LINE',  form.contact)
      data.append('attendance', selectedAtt?.clean || form.attendance)
      data.append('出席狀態',   selectedAtt?.clean || form.attendance)
      if (form.message.trim()) data.append('給新人的話', form.message.trim())
      if (isAttending) {
        data.append('參加人數',       `${form.guests} 人`)
        data.append('兒童椅',         form.highchairs === '0' ? '不需要' : `${form.highchairs} 張`)
        data.append('素食餐點',       form.veggie     === '0' ? '不需要' : `${form.veggie} 份`)
        data.append('包棟住宿意願',   form.accommodation === 'yes' ? '有興趣' : '不參加')
        if (wantsAccom) {
          data.append('包棟人數', `${form.accomGuests} 人`)
          data.append('自行開車', form.driving === 'yes' ? '是' : form.driving === 'no' ? '否（搭大眾交通）' : '未填')
        }
      }

      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { Accept: 'application/json' },
        body:    data,
      })

      // 同時寫入 Google Sheet（fire-and-forget，不影響主流程）
      if (GSHEET_URL) {
        fetch(GSHEET_URL, {
          method:  'POST',
          mode:    'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            '姓名':         form.name,
            '電話_LINE':    form.contact,
            '出席狀態':     selectedAtt?.clean || form.attendance,
            '給新人的話':   form.message.trim(),
            '參加人數':     isAttending ? `${form.guests} 人` : '',
            '兒童椅':       isAttending ? (form.highchairs === '0' ? '不需要' : `${form.highchairs} 張`) : '',
            '素食餐點':     isAttending ? (form.veggie === '0' ? '不需要' : `${form.veggie} 份`) : '',
            '包棟住宿意願': isAttending ? (form.accommodation === 'yes' ? '有興趣' : '不參加') : '',
            '包棟人數':     wantsAccom ? `${form.accomGuests} 人` : '',
            '自行開車':     wantsAccom ? (form.driving === 'yes' ? '是' : form.driving === 'no' ? '否（搭大眾交通）' : '未填') : '',
          }),
        }).catch(() => {})
      }

      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => { setStatus('idle'); setForm(INIT_FORM); setTouched({}) }

  /* ─────────────────────────────────────────── */
  return (
    <section className="relative py-20 px-5 overflow-hidden">
      {/* Top glow divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #f97316, #fbbf24, #f97316, transparent)',
          boxShadow:  '0 0 20px 6px rgba(249,115,22,0.12)',
        }}
      />

      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-amber-500/70 mb-3">RSVP</p>
        <h2 className="font-display text-4xl md:text-5xl text-white">
          出席<span className="gradient-text-sunset"> 確認</span>
        </h2>
        <p className="mt-3 text-zinc-500 text-sm">
          告訴我們你會來，我們替你留好位置和那杯 Shot。
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="relative bg-zinc-900/80 border border-orange-500/20 rounded-2xl p-6 overflow-hidden"
          style={{ boxShadow: '0 0 0 1px rgba(249,115,22,0.1), 0 8px 40px rgba(0,0,0,0.5)' }}
        >
          {/* Ambient glow blob */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
          />

          {/* ─── SUCCESS STATE ─── */}
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-10 text-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(52,211,153,0.4)' }}
              >
                <CheckCircle2 size={30} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-white mb-2">感謝你的回覆！</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  我們收到你的 RSVP 了。<br />11 月 7 日，無論如何都謝謝你 🥃
                </p>
              </div>
              <button
                onClick={reset}
                className="mt-2 text-xs text-zinc-600 underline underline-offset-2 hover:text-zinc-400 transition-colors"
              >
                重新填寫
              </button>
            </motion.div>

          ) : (
            /* ─── FORM ─── */
            <form onSubmit={handleSubmit} noValidate className="space-y-5 relative">
              {/* Honeypot */}
              <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} readOnly />

              {/* ══════════════════════════════════
                  STEP 1 — 基本資料（always shown）
                  ══════════════════════════════════ */}
              <p className="text-[10px] uppercase tracking-[0.35em] text-orange-500/60 font-medium">
                基本資料
              </p>

              {/* Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-2">
                  <User size={11} /> 姓名 <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="你的大名"
                  className={`${inputBase} ${nameError ? 'border-red-500/60' : ''}`}
                />
                {nameError && (
                  <p className="flex items-center gap-1 text-red-400 text-xs mt-1.5">
                    <AlertCircle size={11} /> 請填寫姓名
                  </p>
                )}
              </div>

              {/* Contact */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-2">
                  <Phone size={11} /> 電話 或 LINE ID <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="方便聯絡你的方式"
                  className={`${inputBase} ${contactError ? 'border-red-500/60' : ''}`}
                />
                {contactError && (
                  <p className="flex items-center gap-1 text-red-400 text-xs mt-1.5">
                    <AlertCircle size={11} /> 請填寫聯絡方式
                  </p>
                )}
              </div>

              {/* Attendance — radio cards */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                  出席狀態 <span className="text-orange-500">*</span>
                </label>
                <div className="space-y-2">
                  {ATTENDANCE_OPTIONS.map(o => (
                    <label
                      key={o.value}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                        form.attendance === o.value
                          ? 'bg-orange-500/15 border border-orange-500/40'
                          : 'bg-zinc-900/60 border border-zinc-700/50 hover:border-zinc-600/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={o.value}
                        checked={form.attendance === o.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className={`text-sm ${form.attendance === o.value ? 'text-white' : 'text-zinc-400'}`}>
                        {o.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 禮到人不到 → 匯款資訊 */}
              <AnimatePresence>
                {form.attendance === 'gift_only' && (
                  <motion.div
                    key="bank-info"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="rounded-2xl px-5 py-4 space-y-2"
                      style={{
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.10), rgba(249,115,22,0.06))',
                        border: '1px solid rgba(251,191,36,0.28)',
                      }}
                    >
                      <p className="text-amber-300 text-xs font-medium">💳 禮金匯款帳號</p>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-zinc-400 text-[11px]">銀行：812 台新銀行</p>
                          <p className="text-white text-sm font-mono tracking-widest mt-0.5">
                            28881016959773
                          </p>
                        </div>
                      </div>
                      <p className="text-zinc-500 text-[11px] leading-relaxed pt-1 border-t border-white/5">
                        匯款後請在下方留下你的地址，我們會寄謝卡給你 ✉️
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-2">
                  <Heart size={11} /> 給新人的話
                  <span className="text-zinc-700 normal-case tracking-normal ml-1">（可選填）</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={
                    form.attendance === 'gift_only'
                      ? '留下你的祝福，以及收謝卡的地址 📬'
                      : '留下你的祝福或悄悄話 💌'
                  }
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
              </div>

              {/* ══════════════════════════════════
                  STEP 2 — 出席詳情（if attending）
                  ══════════════════════════════════ */}
              <AnimatePresence>
                {isAttending && (
                  <motion.div key="step2" {...slideDown} className="space-y-5 overflow-hidden">

                    {/* Section divider */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1 h-px" style={{ background: 'rgba(249,115,22,0.2)' }} />
                      <p className="text-[10px] uppercase tracking-[0.35em] text-orange-500/60 font-medium shrink-0">
                        出席詳情
                      </p>
                      <div className="flex-1 h-px" style={{ background: 'rgba(249,115,22,0.2)' }} />
                    </div>

                    {/* Guest count */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-2">
                        <Users size={11} /> 參加人數
                      </label>
                      <select
                        name="guests"
                        value={form.guests}
                        onChange={handleChange}
                        className={`${inputBase} appearance-none cursor-pointer`}
                        style={{ backgroundImage: 'none' }}
                      >
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(n => (
                          <option key={n} value={String(n)} className="bg-zinc-900">
                            {n} 人{n === 1 ? '（只有我）' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Highchairs */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-2">
                        <Baby size={11} /> 需要幾張兒童椅？
                        {highchairMax === 0 && (
                          <span className="text-zinc-700 normal-case tracking-normal ml-1">（1 人出席不適用）</span>
                        )}
                      </label>
                      <select
                        name="highchairs"
                        value={form.highchairs}
                        onChange={handleChange}
                        disabled={highchairMax === 0}
                        className={`${inputBase} appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                        style={{ backgroundImage: 'none' }}
                      >
                        {Array.from({ length: highchairMax + 1 }, (_, i) => i).map(n => (
                          <option key={n} value={String(n)} className="bg-zinc-900">
                            {n === 0 ? '0 — 不需要' : `${n} 張`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Veggie */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-2">
                        <Salad size={11} /> 需要幾份素食餐點？
                      </label>
                      <select
                        name="veggie"
                        value={form.veggie}
                        onChange={handleChange}
                        className={`${inputBase} appearance-none cursor-pointer`}
                        style={{ backgroundImage: 'none' }}
                      >
                        {Array.from({ length: veggieMax + 1 }, (_, i) => i).map(n => (
                          <option key={n} value={String(n)} className="bg-zinc-900">
                            {n === 0 ? '0 — 不需要' : `${n} 份`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Accommodation interest */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-1">
                        <Home size={11} /> 有意願一起包棟住宿嗎？
                      </label>
                      <p className="text-[11px] text-zinc-600 mb-2 ml-4">
                        台南安平 · 拾光旅宿，名額有限 20 人
                      </p>
                      <div className="space-y-2">
                        {[
                          { value: 'yes', label: '🏡  有！想跟大家一起住' },
                          { value: 'no',  label: '🚗  謝謝，我當天自行安排' },
                        ].map(o => (
                          <label
                            key={o.value}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                              form.accommodation === o.value
                                ? 'bg-orange-500/15 border border-orange-500/40'
                                : 'bg-zinc-900/60 border border-zinc-700/50 hover:border-zinc-600/60'
                            }`}
                          >
                            <input
                              type="radio"
                              name="accommodation"
                              value={o.value}
                              checked={form.accommodation === o.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <span className={`text-sm ${form.accommodation === o.value ? 'text-white' : 'text-zinc-400'}`}>
                              {o.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* ══════════════════════════════════
                  STEP 3 — 包棟詳情（if wants accom）
                  ══════════════════════════════════ */}
              <AnimatePresence>
                {wantsAccom && (
                  <motion.div key="step3" {...slideDown} className="space-y-5 overflow-hidden">

                    {/* Section divider */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1 h-px" style={{ background: 'rgba(251,191,36,0.2)' }} />
                      <p className="text-[10px] uppercase tracking-[0.35em] text-amber-500/60 font-medium shrink-0">
                        包棟資訊
                      </p>
                      <div className="flex-1 h-px" style={{ background: 'rgba(251,191,36,0.2)' }} />
                    </div>

                    {/* Accommodation info card */}
                    <div
                      className="rounded-2xl p-5 space-y-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(251,191,36,0.05))',
                        border: '1px solid rgba(251,191,36,0.22)',
                      }}
                    >
                      {/* Title row */}
                      <div className="flex items-start gap-3">
                        <div
                          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(251,191,36,0.2))',
                            border: '1px solid rgba(249,115,22,0.3)',
                          }}
                        >
                          <Home size={16} className="text-amber-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">拾光旅宿（世平二館）</p>
                          <p className="text-amber-400/70 text-xs mt-0.5">台南安平 · 包棟民宿</p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2">
                        <MapPin size={12} className="text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          台南市安平區世平路 55、57、59 號
                        </p>
                      </div>

                      {/* Capacity notice */}
                      <div
                        className="rounded-xl px-4 py-3 space-y-1"
                        style={{
                          background: 'rgba(249,115,22,0.10)',
                          border: '1px solid rgba(249,115,22,0.18)',
                        }}
                      >
                        <p className="text-orange-300 text-xs font-medium">📋 包棟說明</p>
                        <ul className="text-zinc-400 text-xs space-y-1 leading-relaxed">
                          <li>· 名額有限，共 <strong className="text-white">20 名大人</strong></li>
                          <li>· 提供四人房與六人房，需與朋友共住</li>
                          <li>· 歡迎揪團，十人可包一棟</li>
                          <li>· 聯絡：<strong className="text-amber-300">LINE @dur2947z</strong></li>
                        </ul>
                      </div>

                      {/* Features grid */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {ACCOM_FEATURES.map((f, i) => (
                          <div
                            key={i}
                            className="text-center rounded-lg px-2 py-2 text-[11px] text-zinc-400"
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            {f}
                          </div>
                        ))}
                      </div>

                      {/* Link */}
                      <a
                        href="https://shihkuang.my.canva.site/page-6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-medium transition-all duration-200 hover:bg-white/10"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.10)',
                          color: '#a1a1aa',
                        }}
                      >
                        🔗 查看完整民宿資訊
                      </a>
                    </div>

                    {/* Accommodation guest count */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-2">
                        <Users size={11} /> 預計包棟人數
                      </label>
                      <select
                        name="accomGuests"
                        value={form.accomGuests}
                        onChange={handleChange}
                        className={`${inputBase} appearance-none cursor-pointer`}
                        style={{ backgroundImage: 'none' }}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                          <option key={n} value={String(n)} className="bg-zinc-900">{n} 人</option>
                        ))}
                      </select>
                    </div>

                    {/* Driving */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-widest mb-2">
                        <Car size={11} /> 是否自行開車前往？
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'yes', label: '🚗  自行開車' },
                          { value: 'no',  label: '🚌  自行搭大眾交通' },
                        ].map(o => (
                          <label
                            key={o.value}
                            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 cursor-pointer text-sm transition-all duration-200 ${
                              form.driving === o.value
                                ? 'bg-orange-500/15 border border-orange-500/40 text-white'
                                : 'bg-zinc-900/60 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600/60'
                            }`}
                          >
                            <input
                              type="radio"
                              name="driving"
                              value={o.value}
                              checked={form.driving === o.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            {o.label}
                          </label>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              {status === 'error' && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  <AlertCircle size={15} />
                  送出失敗，請稍後再試。
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'submitting' || !form.attendance}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm
                           bg-gradient-to-r from-orange-500 to-amber-500 text-white
                           hover:from-orange-400 hover:to-amber-400
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 neon-border"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    送出中…
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    {isAttending ? '確認出席，我們來了！' : form.attendance ? '送出回覆' : '請先選擇出席狀態'}
                  </>
                )}
              </button>

              <p className="text-center text-zinc-700 text-xs">
                表單由 Formspree 提供，資料僅供婚禮統計使用。
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
