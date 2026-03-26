'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  profile?: {
    full_name?: string
    role?: string
  } | null
}

export default function Navbar({ profile }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-bordersubtle">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-head text-lg font-extrabold text-txtprimary tracking-tight">
          <span className="text-gold">Engefy</span> 360
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-sm text-txtmuted hover:text-txtprimary transition-colors">
            Inicio
          </Link>
          {profile && (
            <Link href="/meu-progresso" className="text-sm text-txtmuted hover:text-txtprimary transition-colors">
              Meu Progresso
            </Link>
          )}
          {profile && (
            <span className="text-xs text-txtmuted bg-white/5 px-3 py-1.5 rounded-full">
              {profile.full_name || 'Colaborador'}
            </span>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="sm:hidden text-txtmuted hover:text-txtprimary">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden bg-surface border-t border-bordersubtle px-6 py-4 flex flex-col gap-3">
          <Link href="/" className="text-sm text-txtmuted hover:text-txtprimary" onClick={() => setOpen(false)}>
            Inicio
          </Link>
          {profile && (
            <Link href="/meu-progresso" className="text-sm text-txtmuted hover:text-txtprimary" onClick={() => setOpen(false)}>
              Meu Progresso
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
