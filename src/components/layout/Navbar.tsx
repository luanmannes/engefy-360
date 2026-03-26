'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  profile?: {
    full_name?: string
    role?: string
  } | null
}

export default function Navbar({ profile }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isAdmin = profile?.role === 'admin'
  const isDiretor = profile?.role === 'diretor'

  const navLinks = [
    { href: '/', label: 'Inicio' },
    ...(profile ? [{ href: '/meu-progresso', label: 'Meu Progresso' }] : []),
    ...(isAdmin || isDiretor ? [{ href: isAdmin ? '/admin/ranking' : '/diretor/ranking', label: 'Ranking' }] : []),
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
    ...(isAdmin ? [{ href: '/admin/usuarios', label: 'Usuarios' }] : []),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-bordersubtle">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-head text-lg font-extrabold text-txtprimary tracking-tight">
          <span className="text-gold">Engefy</span> 360
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-xs font-head font-semibold uppercase tracking-wider transition-all ${
                pathname === link.href
                  ? 'text-gold bg-gold/10'
                  : 'text-txtmuted hover:text-txtprimary hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {profile && (
            <>
              <span className="text-xs text-txtmuted bg-white/5 px-3 py-1.5 rounded-full ml-2">
                {profile.full_name || 'Colaborador'}
              </span>
              <button
                onClick={handleSignOut}
                className="ml-1 p-1.5 rounded-md text-txtmuted hover:text-error hover:bg-error/10 transition-all"
                title="Sair"
              >
                <LogOut size={14} />
              </button>
            </>
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
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm ${pathname === link.href ? 'text-gold' : 'text-txtmuted hover:text-txtprimary'}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {profile && (
            <button
              onClick={handleSignOut}
              className="text-sm text-txtmuted hover:text-error text-left flex items-center gap-2"
            >
              <LogOut size={14} /> Sair
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
