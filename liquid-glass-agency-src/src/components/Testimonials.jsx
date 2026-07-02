const items = [
  {
    quote:
      "A complete rebuild in five days. The result outperformed everything we'd spent months building before.",
    name: 'Sarah Chen',
    role: 'CEO, Luminary',
  },
  {
    quote:
      "Conversions up 4x. That's not a typo. The design just works differently when it's built on real data.",
    name: 'Marcus Webb',
    role: 'Head of Growth, Arcline',
  },
  {
    quote:
      "They didn't just design our site. They defined our brand. World-class doesn't begin to cover it.",
    name: 'Elena Voss',
    role: 'Brand Director, Helix',
  },
]

export default function Testimonials() {
  return (
    <section className="relative z-10 px-8 lg:px-16 py-24">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
          What They Say
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          Don't take our word for it.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map((t) => (
          <div key={t.name} className="liquid-glass rounded-2xl p-8 flex flex-col gap-6">
            <p className="text-white/80 font-body font-light text-sm italic">
              “{t.quote}”
            </p>
            <div className="mt-auto">
              <p className="text-white font-body font-medium text-sm">{t.name}</p>
              <p className="text-white/50 font-body font-light text-xs">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
