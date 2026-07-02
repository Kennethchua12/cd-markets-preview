import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import StartSection from './components/StartSection.jsx'
import FeaturesChess from './components/FeaturesChess.jsx'
import FeaturesGrid from './components/FeaturesGrid.jsx'
import Stats from './components/Stats.jsx'
import Testimonials from './components/Testimonials.jsx'
import CtaFooter from './components/CtaFooter.jsx'

export default function App() {
  return (
    <div className="bg-black min-h-screen">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <div className="bg-black">
          <StartSection />
          <FeaturesChess />
          <FeaturesGrid />
          <Stats />
          <Testimonials />
          <CtaFooter />
        </div>
      </div>
    </div>
  )
}
