import { QUIZ_DATA } from '@/lib/constants'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { FileText, Play, ArrowRight } from 'lucide-react'

export default async function CourseDetailPage(props: { params: Promise<{ courseId: string }> }) {
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

  const mcCount = quiz.questions.filter(q => q.type === 'mc').length
  const openCount = quiz.questions.filter(q => q.type === 'open').length

  return (
    <>
      <Navbar profile={profile} />
      <main className="max-w-[900px] mx-auto px-6 pt-20 pb-16 relative z-10">
        <div className="animate-fade-up">
          <Badge variant={quiz.accent} size="md">
            {quiz.module} · {quiz.date}
          </Badge>

          <h1 className="font-head text-3xl sm:text-4xl font-extrabold text-text-primary mt-4 mb-2">
            {quiz.title}
          </h1>

          <p className="text-text-muted text-base leading-relaxed mb-8">
            {quiz.subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card accent={quiz.accent}>
              <div className="flex items-center gap-3 mb-3">
                <FileText size={20} className={quiz.accent === 'gold' ? 'text-gold' : 'text-steel-light'} />
                <h3 className="font-head text-lg font-bold text-text-primary">Avaliacao</h3>
              </div>
              <p className="text-sm text-text-muted mb-1">{mcCount} questoes de multipla escolha</p>
              <p className="text-sm text-text-muted mb-4">{openCount} questoes dissertativas</p>
              <Link href={`/cursos/${quiz.id}/avaliacao`}>
                <Button accent={quiz.accent} size="sm">
                  Fazer avaliacao <ArrowRight size={14} />
                </Button>
              </Link>
            </Card>

            <Card accent={quiz.accent}>
              <div className="flex items-center gap-3 mb-3">
                <Play size={20} className={quiz.accent === 'gold' ? 'text-gold' : 'text-steel-light'} />
                <h3 className="font-head text-lg font-bold text-text-primary">Video-aulas</h3>
              </div>
              <p className="text-sm text-text-muted mb-4">
                Os videos ficam disponiveis apos a aprovacao na avaliacao de capacitacao (30 dias apos a aula presencial).
              </p>
              <Button accent={quiz.accent} variant="secondary" size="sm" disabled>
                Em breve
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
