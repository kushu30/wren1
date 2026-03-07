import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/6 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
              <path
                d="M14 2L4 7V14C4 19.5 8.5 24.7 14 26C19.5 24.7 24 19.5 24 14V7L14 2Z"
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M10 14L13 17L18 11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-display font-700 text-sm">wren<span className="text-amber-500">.</span></span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {[
              { label: 'Docs', href: '#' },
              { label: 'GitHub', href: 'https://github.com' },
              { label: 'PyPI', href: 'https://pypi.org' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-white/35 hover:text-white/70 transition-colors font-body">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/25 font-mono">
            © {new Date().getFullYear()} Wren. MIT License.
          </p>
        </div>
      </div>
    </footer>
  )
}
