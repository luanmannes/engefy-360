import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="pt-BR">
      <body className="min-h-screen bg-bg text-txtsecondary font-body antialiased">
        {children}
      </body>
    </html>
  )
}
