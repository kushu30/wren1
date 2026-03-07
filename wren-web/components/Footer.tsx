import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[#1a1a1a]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
              <path
                d="M14 2L4 7V14C4 19.5 8.5 24.7 14 26C19.5 24.7 24 19.5 24 14V7L14 2Z"
                stroke="#EAEAEA"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M10 14L13 17L18 11" stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-display font-medium text-[15px] text-[#EAEAEA]">wren</span>
          </div>

          {/* Links */}
          <div className="flex items-center flex-wrap justify-center gap-6 sm:gap-8">
            {[
              { label: 'Documentation', href: '#' },
              { label: 'GitHub', href: 'https://github.com' },
              { label: 'PyPI', href: 'https://pypi.org' },
              { label: 'Twitter', href: 'https://twitter.com' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-[13px] text-[#888888] hover:text-[#DFDFDF] transition-colors font-body">
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
