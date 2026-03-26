import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default async function MeuProgressoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <>
      <Navbar profile={profile} />
      <main className="max-w-[900px] mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="animate-fade-up">
          <h1 className="font-head text-3xl font-extrabold text-txtprimary mb-2">
            Meu Progresso
          </h1>
          <p className="text-txtmuted text-base mb-8">
            Acompanhe seu desempenho nos treinamentos.
          </p>

          <Card>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">&#x1F4CA;</div>
              <h3 className="font-head text-lg font-bold text-txtprimary mb-2">
                Em construcao
              </h3>
              <p className="text-sm text-txtmuted max-w-md mx-auto">
                Seu historico de avaliacoes e progresso nos cursos aparecera aqui assim que o sistema estiver integrado com o banco de dados.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
