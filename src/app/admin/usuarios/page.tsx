import { createClient } from '@/lib/supabase/server'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Users } from 'lucide-react'
import UserRoleSelect from './UserRoleSelect'

export default async function UsuariosPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="animate-fade-up">
      <h1 className="font-head text-3xl font-extrabold text-txtprimary mb-2 flex items-center gap-3">
        <Users size={28} className="text-steel-light" />
        Gerenciar Usuarios
      </h1>
      <p className="text-txtmuted text-base mb-8">
        {users?.length || 0} usuario{(users?.length || 0) !== 1 ? 's' : ''} cadastrado{(users?.length || 0) !== 1 ? 's' : ''}
      </p>

      {!users || users.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">{'\u{1F465}'}</div>
            <h3 className="font-head text-lg font-bold text-txtprimary mb-2">Nenhum usuario cadastrado</h3>
            <p className="text-sm text-txtmuted">Os usuarios aparecerao aqui apos fazerem login com Google.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-bordersubtle">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-head text-sm font-bold text-gold flex-shrink-0">
                {user.full_name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '??'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-head text-sm font-bold text-txtprimary truncate">{user.full_name}</div>
                <div className="text-xs text-txtmuted truncate">{user.email}</div>
              </div>
              <Badge variant={user.role === 'admin' ? 'gold' : user.role === 'diretor' ? 'steel' : 'neutral'}>
                {user.role}
              </Badge>
              <UserRoleSelect userId={user.id} currentRole={user.role} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
