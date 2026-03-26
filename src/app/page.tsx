import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import CourseGrid from '@/components/courses/CourseGrid'
import { QUIZ_DATA } from '@/lib/constants'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  // For now, use QUIZ_DATA as course data (will migrate to DB later)
  const courses = QUIZ_DATA.map(q => ({
    id: q.id.toString(),
    title: q.title,
    subtitle: q.subtitle,
    module: q.module,
    date: q.date,
    accent: q.accent,
    questionCount: q.questions.filter(x => x.type === 'mc').length,
  }))

  return (
    <>
      <Navbar profile={profile} />
      <main className="max-w-[1100px] mx-auto px-6 pb-16 relative z-10" style={{ paddingTop: '120px' }}>
        {/* Hero */}
        <div className="text-center pt-8 pb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />
            <span className="font-head text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
              PPI 360 — Treinamento Interno
            </span>
          </div>

          <h1 className="font-head text-4xl sm:text-5xl font-extrabold text-txtprimary leading-tight mb-4">
            Programa de Performance <em className="not-italic text-gold">Integrada</em>
          </h1>

          <p className="text-txtmuted text-base max-w-lg mx-auto leading-relaxed">
            Avaliações de absorção dos treinamentos internos. Selecione um módulo para iniciar.
          </p>
        </div>

        {/* Course Grid */}
        <CourseGrid courses={courses} />
      </main>
    </>
  )
}
