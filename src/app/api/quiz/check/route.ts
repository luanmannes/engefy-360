import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Nao autenticado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get('quizId')

  if (!quizId) {
    return Response.json({ error: 'quizId required' }, { status: 400 })
  }

  const { data: submissions } = await supabase
    .from('quiz_submissions')
    .select('*')
    .eq('user_id', user.id)
    .eq('quiz_id', parseInt(quizId))
    .order('attempt_number', { ascending: true })

  const firstAttempt = submissions?.find(s => s.is_first_attempt) || submissions?.[0] || null
  const totalAttempts = submissions?.length || 0

  return Response.json({
    hasAttempted: totalAttempts > 0,
    totalAttempts,
    firstAttempt: firstAttempt
      ? {
          score: firstAttempt.score,
          maxScore: firstAttempt.max_score,
          percentage: firstAttempt.percentage,
          completedAt: firstAttempt.completed_at,
        }
      : null,
  })
}
