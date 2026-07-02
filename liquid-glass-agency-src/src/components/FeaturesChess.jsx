import { ArrowUpRight } from 'lucide-react'

const GIF_1 = 'https://motionsites.ai/assets/hero-finlytic-preview-CV9g0FHP.gif'
const GIF_2 = 'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif'

const rows = [
  {
    title: 'Designed to convert. Built to perform.',
    body: 'Every pixel is intentional. Our AI studies what works across thousands of top sites—then builds yours to outperform them all.',
    cta: 'Learn more',
    gif: GIF_1,
    reverse: false,
  },
  {
    title: 'It gets smarter. Automatically.',
    body: 'Your site evolves on its own. AI monitors every click, scroll, and conversion—then optimizes in real time. No manual updates. Ever.',
    cta: 'See how it works',
    gif: GIF_2,
    reverse: true,
  },
]

export default function FeaturesChess() {
  return (
    <section className="relative z-10 px-8 lg:px-16 py-24">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
          Capabilities
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          Pro features. Zero complexity.
        </h2>
      </div>
      <div className="flex flex-col gap-20 max-w-6xl mx-auto">
        {rows.map((row) => (
          <div
            key={row.title}
            className={`flex flex-col ${
              row.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
            } items-center gap-12`}
          >
            <div className="flex-1 flex flex-col items-start gap-5">
              <h3 className="text-3xl md:text-4xl font-heading italic text-white tracking-tight leading-[0.95]">
                {row.title}
              </h3>
              <p className="text-white/60 font-body font-light text-sm md:text-base max-w-md">
                {row.body}
              </p>
              <a
                href="#"
                className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white font-body"
              >
                {row.cta}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="flex-1 liquid-glass rounded-2xl overflow-hidden">
              <img
                src={row.gif}
                alt={row.title}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
