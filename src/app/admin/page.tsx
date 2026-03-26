import Card from '@/components/ui/Card'
import { Users, BookOpen, Trophy, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const cards = [
    { title: 'Ranking', description: 'Ver ranking dos colaboradores', icon: Trophy, href: '/admin/ranking', color: 'text-gold' },
    { title: 'Usuarios', description: 'Gerenciar usuarios e roles', icon: Users, href: '/admin/usuarios', color: 'text-steel-light' },
    { title: 'Cursos', description: 'Gerenciar cursos e avaliacoes', icon: BookOpen, href: '/admin/cursos', color: 'text-success' },
    { title: 'Analytics', description: 'Metricas e relatorios', icon: BarChart3, href: '#', color: 'text-gold-light' },
  ]

  return (
    <div className="animate-fade-up">
      <h1 className="font-head text-3xl font-extrabold text-txtprimary mb-2">Painel Admin</h1>
      <p className="text-txtmuted text-base mb-8">Gerencie a plataforma de treinamento.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(card => (
          <Link key={card.title} href={card.href}>
            <Card hover accent="gold" className="h-full">
              <card.icon size={24} className={card.color + ' mb-3'} />
              <h3 className="font-head text-lg font-bold text-txtprimary mb-1">{card.title}</h3>
              <p className="text-sm text-txtmuted">{card.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
