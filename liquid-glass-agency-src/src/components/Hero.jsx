import { motion } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'
import BlurText from './BlurText.jsx'

const HERO_MP4 =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4'

const partners = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma']

export default function Hero() {
  return (
    <section className="relative overflow-visible" style={{ height: '1000px' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="images/hero_bg.jpeg"
        className="absolute left-0 w-full h-auto object-contain z-0"
        style={{ top: '20%' }}
      >
        <source src={HERO_MP4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/5 z-0" />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '300px',
          background: 'linear-gradient(to bottom, transparent, black)',
        }}
      />
      <div
        className="relative z-10 flex flex-col items-center h-full px-6"
        style={{ paddingTop: '150px' }}
      >
        <div className="liquid-glass rounded-full px-1 py-1 flex items-center gap-2 mb-8">
          <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold font-body">
            New
          </span>
          <span className="text-xs text-white/90 font-body pr-3">
            Introducing AI-powered web design.
          </span>
        </div>
        <BlurText
          text="The Website Your Brand Deserves"
          delay={100}
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] max-w-2xl tracking-[-4px] text-center"
        />
        <motion.p
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-sm md:text-base text-white font-body font-light leading-tight max-w-md text-center"
        >
          Stunning design. Blazing performance. Built by AI, refined by
          experts. This is web design, wildly reimagined.
        </motion.p>
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-8 flex items-center gap-6"
        >
          <a
            href="#"
            className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white font-body"
          >
            Get Started
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-white font-body"
          >
            <Play className="h-4 w-4 fill-white" />
            Watch the Film
          </a>
        </motion.div>
        <div className="mt-auto pb-8 pt-16 flex flex-col items-center gap-6">
          <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
            Trusted by the teams behind
          </span>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {partners.map((p) => (
              <span
                key={p}
                className="text-2xl md:text-3xl font-heading italic text-white"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
