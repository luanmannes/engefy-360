import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Nao autenticado' }, { status: 401 })
  }

  const { quizId, quizName, score, maxScore, percentage, answers, openAnswers } = await request.json()

  // Check if user already has submissions for this quiz
  const { data: existing } = await supabase
    .from('quiz_submissions')
    .select('id, score, max_score, percentage, attempt_number')
    .eq('user_id', user.id)
    .eq('quiz_id', quizId)
    .order('attempt_number', { ascending: true })

  const attemptNumber = (existing?.length || 0) + 1
  const isFirstAttempt = attemptNumber === 1

  // Save submission
  const { error } = await supabase
    .from('quiz_submissions')
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      quiz_name: quizName,
      score,
      max_score: maxScore,
      percentage,
      answers: answers || {},
      open_answers: openAnswers || {},
      attempt_number: attemptNumber,
      is_first_attempt: isFirstAttempt,
    })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const firstAttempt = existing?.[0] || null

  return Response.json({
    success: true,
    isFirstAttempt,
    attemptNumber,
    rankingScore: isFirstAttempt
      ? { score, maxScore, percentage }
      : {
          score: firstAttempt!.score,
          maxScore: firstAttempt!.max_score,
          percentage: firstAttempt!.percentage,
        },
  })
}
