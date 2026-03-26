import Card from '@/components/ui/Card'
import { BookOpen } from 'lucide-react'

export default function CursosAdminPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="font-head text-3xl font-extrabold text-txtprimary mb-2">
        <BookOpen size={28} className="inline text-success mr-2" />
        Gerenciar Cursos
      </h1>
      <p className="text-txtmuted text-base mb-8">Adicione novos modulos, edite questoes e gerencie conteudo.</p>

      <Card>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">{'\u{1F4DA}'}</div>
          <h3 className="font-head text-lg font-bold text-txtprimary mb-2">
            Em construcao
          </h3>
          <p className="text-sm text-txtmuted max-w-md mx-auto">
            Aqui voce podera criar novos cursos, adicionar aulas com video, fazer upload de transcricoes e gerar apostilas via IA.
          </p>
        </div>
      </Card>
    </div>
  )
}
