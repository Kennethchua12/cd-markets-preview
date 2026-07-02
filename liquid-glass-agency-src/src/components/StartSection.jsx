import { ArrowUpRight } from 'lucide-react'
import HlsVideo from './HlsVideo.jsx'

const HLS_SRC =
  'https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8'

export default function StartSection() {
  return (
    <section className="relative overflow-hidden">
      <HlsVideo
        src={HLS_SRC}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[1]"
        style={{ height: '200px', background: 'linear-gradient(to bottom, black, transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{ height: '200px', background: 'linear-gradient(to top, black, transparent)' }}
      />
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32"
        style={{ minHeight: '500px' }}
      >
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
          How It Works
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          You dream it. We ship it.
        </h2>
        <p className="mt-6 text-white/60 font-body font-light text-sm md:text-base max-w-md">
          Share your vision. Our AI handles the rest—wireframes, design, code,
          launch. All in days, not quarters.
        </p>
        <a
          href="#"
          className="mt-8 liquid-glass-strong rounded-full px-6 py-3 flex items-center gap-2 text-sm font-medium text-white font-body"
        >
          Get Started
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
