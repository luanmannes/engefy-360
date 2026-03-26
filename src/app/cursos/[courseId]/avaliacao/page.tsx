import { QUIZ_DATA } from '@/lib/constants'
import { notFound } from 'next/navigation'
import QuizClient from './QuizClient'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'

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

  return (
    <>
      <Navbar profile={profile} />
      <main className="max-w-[900px] mx-auto px-6 pt-20 pb-16 relative z-10">
        <QuizClient quiz={quiz} userId={user?.id} />
      </main>
    </>
  )
}
