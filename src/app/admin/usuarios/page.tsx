import Card from '@/components/ui/Card'
import { Users } from 'lucide-react'

export default function UsuariosPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="font-head text-3xl font-extrabold text-txtprimary mb-2">
        <Users size={28} className="inline text-steel-light mr-2" />
        Gerenciar Usuarios
      </h1>
      <p className="text-txtmuted text-base mb-8">Gerencie roles e departamentos dos colaboradores.</p>

      <Card>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">{'\u{1F465}'}</div>
          <h3 className="font-head text-lg font-bold text-txtprimary mb-2">
            Em construcao
          </h3>
          <p className="text-sm text-txtmuted max-w-md mx-auto">
            Aqui voce podera ver todos os colaboradores cadastrados, alterar roles (admin, diretor, colaborador) e gerenciar departamentos. Configure o Supabase para ativar.
          </p>
        </div>
      </Card>
    </div>
  )
}
