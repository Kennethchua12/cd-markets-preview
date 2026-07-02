import HlsVideo from './HlsVideo.jsx'

const HLS_SRC =
  'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8'

export default function CtaFooter() {
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
      <div className="relative z-10 px-8 lg:px-16 pt-40 pb-10 flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white leading-[0.85] max-w-3xl">
          Your next website starts here.
        </h2>
        <p className="mt-8 text-white/60 font-body font-light text-sm md:text-base max-w-md">
          Book a free strategy call. See what AI-powered design can do. No
          commitment, no pressure. Just possibilities.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <a
            href="#"
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium text-white font-body"
          >
            Book a Call
          </a>
          <a
            href="#"
            className="bg-white text-black rounded-full px-6 py-3 text-sm font-medium font-body"
          >
            View Pricing
          </a>
        </div>
        <div className="mt-32 pt-8 border-t border-white/10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white/40 text-xs font-body">
            © 2026 Studio. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/40 text-xs font-body">Privacy</a>
            <a href="#" className="text-white/40 text-xs font-body">Terms</a>
            <a href="#" className="text-white/40 text-xs font-body">Contact</a>
          </div>
        </div>
      </div>
    </section>
  )
}
