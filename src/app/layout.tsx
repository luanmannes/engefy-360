import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-head',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Engefy 360 | Plataforma de Treinamento',
  description: 'Plataforma de treinamento e desenvolvimento da Construtora Engefy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-bg text-text-secondary font-body antialiased">
        {children}
      </body>
    </html>
  )
}
