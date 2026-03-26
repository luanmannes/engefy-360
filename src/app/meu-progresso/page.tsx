import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { QUIZ_DATA } from '@/lib/constants'

export default async function MeuProgressoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Fetch user's quiz submissions
  const { data: submissions } = await supabase
    .from('quiz_submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  // Group by quiz_id
  const byQuiz: Record<number, any[]> = {}
  ;(submissions || []).forEach((s: any) => {
    if (!byQuiz[s.quiz_id]) byQuiz[s.quiz_id] = []
    byQuiz[s.quiz_id].push(s)
  })

  // Calculate overall stats from first attempts
  const firstAttempts = (submissions || []).filter((s: any) => s.is_first_attempt)
  const totalScore = firstAttempts.reduce((sum: number, s: any) => sum + s.score, 0)
  const totalMax = firstAttempts.reduce((sum: number, s: any) => sum + s.max_score, 0)
  const avgPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0

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

          {firstAttempts.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card>
                <div className="text-center">
                  <div className="font-head text-3xl font-extrabold text-gold">{firstAttempts.length}</div>
                  <div className="text-xs text-txtmuted uppercase tracking-wider mt-1">Avaliacoes</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="font-head text-2xl font-extrabold text-txtprimary">{totalScore}/{totalMax}</div>
                  <div className="text-xs text-txtmuted uppercase tracking-wider mt-1">Pontuacao</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="font-head text-3xl font-extrabold" style={{ color: avgPct >= 70 ? '#3aab6e' : avgPct >= 50 ? '#c8993a' : '#d94f4f' }}>
                    {avgPct}%
                  </div>
                  <div className="text-xs text-txtmuted uppercase tracking-wider mt-1">Aproveitamento</div>
                </div>
              </Card>
            </div>
          )}

          {Object.keys(byQuiz).length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-head text-lg font-bold text-txtprimary mb-2">
                  Nenhuma avaliacao realizada
                </h3>
                <p className="text-sm text-txtmuted max-w-md mx-auto">
                  Faca sua primeira avaliacao para ver seu progresso aqui.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {Object.entries(byQuiz).map(([quizId, attempts]) => {
                const quiz = QUIZ_DATA.find(q => q.id === parseInt(quizId))
                const firstAttempt = attempts.find((a: any) => a.is_first_attempt) || attempts[0]
                const pct = firstAttempt.percentage

                return (
                  <Card key={quizId}>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant={quiz?.accent === 'steel' ? 'steel' : 'gold'} size="sm">
                          {quiz?.module || `Modulo ${quizId}`}
                        </Badge>
                        <h3 className="font-head text-lg font-bold text-txtprimary mt-2">
                          {quiz?.title || firstAttempt.quiz_name}
                        </h3>
                        <p className="text-xs text-txtmuted mt-1">
                          {attempts.length} tentativa{attempts.length !== 1 ? 's' : ''} · {new Date(firstAttempt.completed_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-head text-2xl font-extrabold" style={{ color: pct >= 70 ? '#3aab6e' : pct >= 50 ? '#c8993a' : '#d94f4f' }}>
                          {pct}%
                        </div>
                        <div className="text-xs text-txtmuted">
                          {firstAttempt.score}/{firstAttempt.max_score} pts
                        </div>
                        <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: pct >= 70 ? '#3aab6e' : '#d94f4f' }}>
                          {pct >= 70 ? 'Aprovado' : 'Revisar'}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
