import HeroSection from './components/HeroSection'
import VenueSection from './components/VenueSection'
import Timeline from './components/Timeline'
import SurvivalGuide from './components/SurvivalGuide'
import RSVPSection from './components/RSVPSection'
import StarField from './components/StarField'

export default function App() {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-x-hidden">
      <StarField />

      {/* Page-wide gradient overlay: sunset → night */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(180deg, #1c0a00 0%, #0f0505 40%, #09090b 100%)',
          opacity: 0.85,
        }}
      />

      <main className="relative z-10">
        <HeroSection />
        <VenueSection />
        {/* <Timeline /> */}{/* 暫時隱藏，細節確認後開放 */}
        {/* <SurvivalGuide /> */}{/* 暫時隱藏，細節確認後開放 */}
        <RSVPSection />
      </main>

      <footer className="relative z-10 text-center py-10 text-zinc-600 text-sm font-light tracking-widest">
        <p>Made with love &amp; a little too much whiskey 🥃</p>
        <p className="mt-1 text-zinc-700">Griffey &amp; Evon · 2026.11.07</p>
      </footer>
    </div>
  )
}
