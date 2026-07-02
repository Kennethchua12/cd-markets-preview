import HlsVideo from './HlsVideo.jsx'

const HLS_SRC =
  'https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8'

const stats = [
  { value: '200+', label: 'Sites launched' },
  { value: '98%', label: 'Client satisfaction' },
  { value: '3.2x', label: 'More conversions' },
  { value: '5 days', label: 'Average delivery' },
]

export default function Stats() {
  return (
    <section className="relative overflow-hidden">
      <HlsVideo
        src={HLS_SRC}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(0)' }}
      />
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[1]"
        style={{ height: '200px', background: 'linear-gradient(to bottom, black, transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{ height: '200px', background: 'linear-gradient(to top, black, transparent)' }}
      />
      <div className="relative z-10 px-8 lg:px-16 py-32 flex justify-center">
        <div className="liquid-glass rounded-3xl p-12 md:p-16 w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <span className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white">
                  {s.value}
                </span>
                <span className="text-white/60 font-body font-light text-sm">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
