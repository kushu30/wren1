import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[#1a1a1a]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-5 h-5 relative opacity-90 group-hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="Logo" width={20} height={20} className="object-contain" />
            </div>
            <span className="font-display font-medium text-[15px] text-[#EAEAEA] group-hover:text-white transition-colors">wren</span>
          </Link>

          {/* Links */}
          <div className="flex items-center flex-wrap justify-center gap-6 sm:gap-8">
            {[
              { label: 'Documentation', href: '/docs' },
              { label: 'GitHub', href: 'https://github.com/kushu30/wren1' },
              { label: 'PyPI', href: 'https://pypi.org' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-[13px] text-[#888888] hover:text-[#EAEAEA] transition-colors font-body cursor-pointer">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-[13px] text-[#555555] font-body flex gap-4">
            <p>
              © {new Date().getFullYear()} Wren
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
