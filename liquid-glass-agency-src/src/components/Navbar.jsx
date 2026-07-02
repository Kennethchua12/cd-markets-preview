import { ArrowUpRight } from 'lucide-react'
import logoIcon from '../assets/logo-icon.png'

const links = ['Home', 'Services', 'Work', 'Process', 'Pricing']

export default function Navbar() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 py-3 flex items-center justify-between">
      <img src={logoIcon} alt="Studio logo" className="h-12 w-12" />
      <div className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="px-3 py-2 text-sm font-medium text-foreground/90 font-body"
          >
            {link}
          </a>
        ))}
        <a
          href="#"
          className="flex items-center gap-1 bg-white text-black rounded-full px-3.5 py-1.5 text-sm font-medium font-body"
        >
          Get Started
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  )
}
