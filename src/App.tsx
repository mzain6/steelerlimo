import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { MobileBar } from './components/MobileBar'
import { ScrollProgress } from './components/ScrollProgress'
import { IntroProvider, Preloader } from './components/Intro'
import { Page } from './components/Page'
import Home from './pages/Home'
import Services from './pages/Services'
import Fleet from './pages/Fleet'
import About from './pages/About'
import Book from './pages/Book'
import NotFound from './pages/NotFound'

// Pages are imported eagerly on purpose. They were code-split before, and a lazy page makes React hide the
// whole routed area (curtain included) while it resolves, so the footer flashed on its own during navigation.
// The five pages together are ~40 KB, so instant, gap-free transitions are worth far more than the split.

export default function App() {
  const location = useLocation()
  const [introDone, setIntroDone] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <IntroProvider value={introDone}>
        <a
          href="#main"
          className="label-caps fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-gold-300 px-5 py-3 text-xs text-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <Preloader onReveal={() => setIntroDone(true)} />
        <ScrollProgress />
        <Header />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/services" element={<Page><Services /></Page>} />
            <Route path="/fleet" element={<Page><Fleet /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="/book" element={<Page><Book /></Page>} />
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <MobileBar />
      </IntroProvider>
    </MotionConfig>
  )
}
