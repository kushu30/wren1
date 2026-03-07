'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#14120B] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto h-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-7 h-7 relative opacity-90 group-hover:opacity-100 transition-opacity">
            <Image src="/logo.png" alt="Logo" width={28} height={28} />
          </div>
          <span className="font-display font-medium text-lg tracking-tight text-[#EAEAEA] group-hover:text-white transition-colors">
            wren
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'How It Works', href: '/#how-it-works' },
            { label: 'Features', href: '/#features' },
            { label: 'Docs', href: '/docs' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] text-[#888] hover:text-[#EAEAEA] transition-colors font-body cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-neutral-500 text-sm px-3 py-0.5 hover:bg-neutral-800/50 hover:text-white hover:border-neutral-400 transition-colors cursor-pointer text-neutral-300"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-neutral-500 text-neutral-800 bg-neutral-50 text-sm px-3 py-0.5 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {open ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            ) : (
              <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#222] px-6 py-4 flex flex-col gap-4 bg-[#14120B]/95 backdrop-blur-lg">
          {[
            { label: 'How It Works', href: '/#how-it-works' },
            { label: 'Features', href: '/#features' },
            { label: 'Docs', href: '/docs' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="text-[14px] text-[#888] hover:text-[#EAEAEA] transition-colors cursor-pointer" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-[#222]">
            <Link href="/login" className="rounded-full border border-neutral-500 text-neutral-300 text-sm px-4 py-2 flex-1 text-center hover:bg-neutral-800/50 hover:text-white hover:border-neutral-400 transition-colors cursor-pointer">Sign in</Link>
            <Link href="/signup" className="rounded-full border border-neutral-500 text-neutral-800 bg-neutral-50 text-sm px-4 py-2 flex-1 text-center hover:bg-neutral-200 transition-colors cursor-pointer">Get started</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
