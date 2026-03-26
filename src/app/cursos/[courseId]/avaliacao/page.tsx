import { QUIZ_DATA } from '@/lib/constants'
import { notFound } from 'next/navigation'
import QuizClient from './QuizClient'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'

// Class dates for each module
// Bloqueio: avaliacao disponivel somente 30 dias apos a aula presencial
// Modulo 1 (Climatizacao): aula 28/02 -> liberado 30/03 (liberado manualmente)
// Modulo 2 (Estruturas Metalicas): aula 21/03 -> liberado 20/04
const CLASS_DATES: Record<string, string | null> = {
  '1': null, // Climatizacao - liberado (aula 28 fev ja passou)
  '2': '2026-03-21', // Estruturas Metalicas - bloqueado ate 20 abr 2026
}

export default async function AvaliacaoPage(props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params
  const quiz = QUIZ_DATA.find(q => q.id.toString() === params.courseId)
  if (!quiz) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const classDate = CLASS_DATES[params.courseId] || null

  return (
    <>
      <Navbar profile={profile} />
      <main className="max-w-[900px] mx-auto px-6 pt-24 pb-16 relative z-10">
        <QuizClient
          quiz={quiz}
          userId={user?.id}
          classDate={classDate}
          availableAfterDays={30}
        />
      </main>
    </>
  )
}
