'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { ArrowRight, RotateCcw, Home, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface QuizData {
  id: number
  title: string
  subtitle: string
  module: string
  date: string
  accent: 'gold' | 'steel'
  questions: Array<{
    type: 'mc' | 'open'
    text: string
    options?: string[]
    correct?: number
    feedback?: string
  }>
}

interface QuizClientProps {
  quiz: QuizData
  userId?: string
  classDate?: string | null
  availableAfterDays?: number
}

interface AiGradingResult {
  score: number
  feedback: string
  loading: boolean
}

type View = 'name' | 'quiz' | 'result'

export default function QuizClient({ quiz, userId, classDate, availableAfterDays = 30 }: QuizClientProps) {
  // Time-lock check
  const now = new Date()
  let isLocked = false
  let daysRemaining = 0
  let unlockDate: Date | null = null

  if (classDate) {
    unlockDate = new Date(classDate)
    unlockDate.setDate(unlockDate.getDate() + availableAfterDays)
    isLocked = now < unlockDate
    if (isLocked) {
      daysRemaining = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }
  }

  const [view, setView] = useState<View>('name')
  const [name, setName] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [saving, setSaving] = useState(false)

  // First-attempt tracking
  const [existingResult, setExistingResult] = useState<{ score: number; maxScore: number; percentage: number } | null>(null)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{ isFirstAttempt: boolean; rankingScore: { score: number; maxScore: number; percentage: number } } | null>(null)

  // AI grading state
  const [aiGrading, setAiGrading] = useState<Record<number, AiGradingResult>>({})
  const [grading, setGrading] = useState(false)

  const isGold = quiz.accent === 'gold'
  const mcQuestions = quiz.questions.filter(q => q.type === 'mc')
  const maxScore = mcQuestions.length
  const question = quiz.questions[currentQ]

  // Check for existing quiz submissions on mount
  useEffect(() => {
    if (userId) {
      fetch(`/api/quiz/check?quizId=${quiz.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.hasAttempted) {
            setHasAttempted(true)
            setExistingResult(data.firstAttempt)
          }
        })
        .catch(() => {})
    }
  }, [quiz.id, userId])

  const startQuiz = () => {
    if (!name.trim()) return
    setView('quiz')
    setCurrentQ(0)
    setScore(0)
    setAnswers({})
    setAiGrading({})
  }

  const selectOption = (optIdx: number) => {
    if (selectedOption !== null) return
    setSelectedOption(optIdx)
    setShowFeedback(true)

    const q = quiz.questions[currentQ]
    const isCorrect = optIdx === q.correct
    if (isCorrect) setScore(prev => prev + 1)

    setAnswers(prev => ({ ...prev, [currentQ]: optIdx }))
  }

  const handleOpenAnswer = (text: string) => {
    setAnswers(prev => ({ ...prev, [currentQ]: text }))
  }

  const gradeOpenAnswer = async () => {
    setGrading(true)
    setAiGrading(prev => ({
      ...prev,
      [currentQ]: { score: 0, feedback: '', loading: true }
    }))

    try {
      const res = await fetch('/api/quiz/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.text,
          answer: answers[currentQ] as string,
          quizContext: quiz.module + ' - ' + quiz.title,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setAiGrading(prev => ({
          ...prev,
          [currentQ]: { score: data.score, feedback: data.feedback, loading: false }
        }))
      } else {
        setAiGrading(prev => ({
          ...prev,
          [currentQ]: { score: 5, feedback: 'Nao foi possivel avaliar automaticamente. Sua resposta foi registrada.', loading: false }
        }))
      }
    } catch {
      setAiGrading(prev => ({
        ...prev,
        [currentQ]: { score: 5, feedback: 'Erro de conexao. Sua resposta foi registrada.', loading: false }
      }))
    }

    setGrading(false)
  }

  const nextQuestion = async () => {
    setSelectedOption(null)
    setShowFeedback(false)

    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      setSaving(true)

      // Calculate total score including AI scores for open questions
      const aiTotalScore = Object.values(aiGrading).reduce((sum, g) => sum + g.score, 0)
      const aiMaxScore = Object.keys(aiGrading).length * 10
      const combinedScore = score + aiTotalScore
      const combinedMaxScore = maxScore + aiMaxScore
      const pct = combinedMaxScore > 0 ? Math.round((combinedScore / combinedMaxScore) * 100) : 0

      if (userId) {
        try {
          const res = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quizId: quiz.id,
              quizName: quiz.title,
              score: combinedScore,
              maxScore: combinedMaxScore,
              percentage: pct,
              answers: Object.fromEntries(
                Object.entries(answers).filter(([k]) => quiz.questions[Number(k)].type === 'mc').map(([k, v]) => [k, v])
              ),
              openAnswers: Object.fromEntries(
                Object.entries(answers).filter(([k]) => quiz.questions[Number(k)].type === 'open').map(([k, v]) => [k, v])
              ),
              aiGrades: Object.fromEntries(
                Object.entries(aiGrading).map(([k, v]) => [k, { score: v.score, feedback: v.feedback }])
              ),
            }),
          })
          const data = await res.json()
          if (data.success) {
            setSubmissionResult(data)
          }
        } catch {
          // silently fail if API is not available yet
        }
      }

      setSaving(false)
      setView('result')
    }
  }

  // For open questions: need text > 10 chars AND either already graded or ready to grade
  const currentIsOpen = question?.type === 'open'
  const currentOpenText = typeof answers[currentQ] === 'string' ? (answers[currentQ] as string) : ''
  const currentOpenHasText = currentOpenText.length > 10
  const currentIsGraded = currentIsOpen && aiGrading[currentQ] && !aiGrading[currentQ].loading
  const canProceed = question?.type === 'mc'
    ? selectedOption !== null
    : currentIsGraded

  // Calculate combined scores for result view
  const aiTotalScore = Object.values(aiGrading).reduce((sum, g) => sum + g.score, 0)
  const aiMaxScoreTotal = Object.keys(aiGrading).length * 10
  const combinedScore = score + aiTotalScore
  const combinedMaxScore = maxScore + aiMaxScoreTotal
  const pct = combinedMaxScore > 0 ? Math.round((combinedScore / combinedMaxScore) * 100) : 0
  const ringOffset = 427 - ((pct / 100) * 427)

  // LOCKED VIEW
  if (isLocked) {
    return (
      <div className="max-w-md mx-auto text-center animate-fade-up">
        <div className="bg-surface border border-bordersubtle rounded-2xl p-10">
          <div className="text-5xl mb-4">{'\u{1F512}'}</div>
          <h2 className="font-head text-2xl font-extrabold text-txtprimary mb-2">
            Avaliacao Bloqueada
          </h2>
          <p className="text-txtmuted text-sm mb-6">
            Esta avaliacao estara disponivel <strong className="text-txtsecondary">{daysRemaining} dia{daysRemaining !== 1 ? 's' : ''}</strong> apos a aula presencial.
          </p>
          <div className="bg-surface2 rounded-xl p-4 mb-4">
            <div className="text-xs text-txtmuted uppercase tracking-wider mb-1">Disponivel em</div>
            <div className="font-head text-lg font-bold text-gold">
              {unlockDate?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <a href="/" className="inline-flex items-center gap-2 font-head text-xs font-bold uppercase tracking-wider text-txtmuted hover:text-txtprimary">
            &larr; Voltar ao inicio
          </a>
        </div>
      </div>
    )
  }

  // NAME VIEW
  if (view === 'name') {
    return (
      <div className="max-w-md mx-auto text-center animate-fade-up">
        <div className="bg-surface border border-bordersubtle rounded-2xl p-10">
          <Badge variant={quiz.accent} size="md">
            {quiz.module} &#8212; {quiz.title}
          </Badge>

          <h2 className="font-head text-2xl font-extrabold text-txtprimary mt-6 mb-2">
            Avaliacao de {quiz.title}
          </h2>

          <p className="text-txtmuted text-sm mb-6">{quiz.subtitle}</p>

          {hasAttempted && existingResult && (
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-6 text-left">
              <div className="text-xs font-head font-bold uppercase tracking-wider text-gold mb-1">Voce ja fez esta avaliacao</div>
              <p className="text-sm text-txtsecondary">
                Sua nota no ranking: <strong className="text-txtprimary">{existingResult.score}/{existingResult.maxScore} ({existingResult.percentage}%)</strong>
              </p>
              <p className="text-xs text-txtmuted mt-1">Voce pode refazer para estudar, mas a nota do ranking sera sempre a primeira.</p>
            </div>
          )}

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && startQuiz()}
            placeholder="Seu nome completo"
            className={`w-full bg-white/[0.04] border rounded-xl px-5 py-4 text-txtprimary font-body text-base text-center outline-none transition-colors duration-200 mb-6 ${
              isGold
                ? 'border-white/10 focus:border-gold'
                : 'border-white/10 focus:border-steel-light'
            }`}
            autoFocus
          />

          <Button onClick={startQuiz} accent={quiz.accent} fullWidth size="lg">
            {hasAttempted ? 'Refazer Avaliacao' : 'Iniciar Avaliacao'} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    )
  }

  // QUIZ VIEW
  if (view === 'quiz') {
    const letters = ['A', 'B', 'C', 'D']

    return (
      <div className="animate-fade-up">
        <ProgressBar
          value={currentQ + 1}
          max={quiz.questions.length}
          accent={quiz.accent}
          showLabel
        />

        <div className="bg-surface border border-bordersubtle rounded-2xl p-8 mt-4">
          <div className={`font-head text-[11px] font-bold uppercase tracking-[0.15em] mb-4 ${
            isGold ? 'text-gold' : 'text-steel-light'
          }`}>
            Questao {currentQ + 1} de {quiz.questions.length} &middot; {question.type === 'mc' ? 'Multipla escolha' : 'Resposta aberta'}
          </div>

          <p className="text-[17px] font-medium text-txtprimary leading-relaxed mb-6">
            {question.text}
          </p>

          {question.type === 'mc' && question.options ? (
            <div className="flex flex-col gap-2.5">
              {question.options.map((opt, i) => {
                let optClass = 'border-bordersubtle bg-white/[0.02] hover:bg-white/[0.04]'

                if (selectedOption !== null) {
                  if (i === question.correct) {
                    optClass = 'border-success/50 bg-success/10'
                  } else if (i === selectedOption && i !== question.correct) {
                    optClass = 'border-error/50 bg-error/10'
                  } else {
                    optClass = 'border-bordersubtle bg-white/[0.01] opacity-50'
                  }
                } else {
                  optClass += isGold ? ' hover:border-gold/30' : ' hover:border-steel/30'
                }

                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    disabled={selectedOption !== null}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer disabled:cursor-default ${optClass}`}
                  >
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-head text-xs font-bold ${
                      selectedOption !== null && i === question.correct
                        ? 'bg-success text-white'
                        : selectedOption === i && i !== question.correct
                        ? 'bg-error text-white'
                        : isGold
                        ? 'bg-gold/10 text-gold'
                        : 'bg-steel/10 text-steel-light'
                    }`}>
                      {letters[i]}
                    </span>
                    <span className="text-sm text-txtsecondary leading-relaxed pt-0.5">{opt}</span>
                  </button>
                )
              })}

              {showFeedback && question.feedback && (
                <div className={`mt-3 p-4 rounded-xl text-sm leading-relaxed ${
                  selectedOption === question.correct
                    ? 'bg-success/10 border border-success/20 text-success'
                    : 'bg-error/10 border border-error/20 text-error'
                }`}>
                  {selectedOption === question.correct ? 'Correto! ' : 'Incorreto. '}
                  {question.feedback}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <textarea
                value={(answers[currentQ] as string) || ''}
                onChange={e => handleOpenAnswer(e.target.value)}
                placeholder="Escreva sua resposta aqui..."
                rows={5}
                disabled={currentIsGraded}
                className={`w-full bg-white/[0.04] border rounded-xl px-5 py-4 text-txtprimary font-body text-sm outline-none transition-colors resize-y min-h-[120px] disabled:opacity-60 ${
                  isGold ? 'border-white/10 focus:border-gold' : 'border-white/10 focus:border-steel-light'
                }`}
              />

              {/* AI grading feedback */}
              {aiGrading[currentQ]?.loading && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-bordersubtle">
                  <Loader2 size={18} className="animate-spin text-gold" />
                  <span className="text-sm text-txtmuted">Avaliando sua resposta com IA...</span>
                </div>
              )}

              {currentIsGraded && (
                <div className={`p-4 rounded-xl text-sm leading-relaxed border ${
                  aiGrading[currentQ].score >= 8
                    ? 'bg-success/10 border-success/20'
                    : aiGrading[currentQ].score >= 5
                    ? 'bg-gold/10 border-gold/20'
                    : 'bg-error/10 border-error/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-head text-lg font-extrabold ${
                      aiGrading[currentQ].score >= 8
                        ? 'text-success'
                        : aiGrading[currentQ].score >= 5
                        ? 'text-gold'
                        : 'text-error'
                    }`}>
                      {aiGrading[currentQ].score}/10
                    </span>
                    <span className="text-xs text-txtmuted uppercase tracking-wider">Nota IA</span>
                  </div>
                  <p className="text-txtsecondary">{aiGrading[currentQ].feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons for open questions: show "Avaliar" first, then "Proxima" after grading */}
        {currentIsOpen && !currentIsGraded && currentOpenHasText && (
          <div className="flex justify-end mt-4">
            <Button onClick={gradeOpenAnswer} accent={quiz.accent} disabled={grading}>
              {grading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Avaliando...
                </>
              ) : (
                <>
                  Avaliar resposta <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        )}

        {/* "Proxima" button for MC (after selecting) or open (after grading) */}
        {canProceed && (
          <div className="flex justify-end mt-4">
            <Button onClick={nextQuestion} accent={quiz.accent}>
              {currentQ === quiz.questions.length - 1 ? 'Ver resultado' : 'Proxima'} <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    )
  }

  // RESULT VIEW
  const resultTitle = pct >= 80 ? 'Excelente absorcao!' : pct >= 60 ? 'Bom resultado!' : 'Continue estudando!'
  const resultSub = pct >= 80
    ? name + ', voce demonstrou otimo dominio do conteudo. Parabens!'
    : pct >= 60
    ? name + ', voce absorveu bem o conteudo central. Vale revisar os pontos em que errou.'
    : name + ', o treinamento foi denso. Revise o material e os conceitos com duvida.'
  const ringColor = pct >= 80 ? '#3aab6e' : pct >= 60 ? (isGold ? '#c8993a' : '#8ab0c8') : '#d94f4f'

  const hasOpenQuestions = Object.keys(aiGrading).length > 0

  return (
    <div className="max-w-md mx-auto text-center animate-fade-up">
      <div className="bg-surface border border-bordersubtle rounded-2xl p-10">
        {/* Score Ring */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle
              cx="75" cy="75" r="68" fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="427"
              strokeDashoffset={ringOffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-head text-4xl font-extrabold text-txtprimary">{combinedScore}</span>
            <span className="text-xs text-txtmuted">de {combinedMaxScore}</span>
          </div>
        </div>

        <h2 className="font-head text-2xl font-extrabold text-txtprimary mb-2">
          {resultTitle}
        </h2>

        <p className="text-txtmuted text-sm leading-relaxed mb-6">{resultSub}</p>

        {/* Stats */}
        <div className={`grid gap-3 bg-surface2 rounded-xl p-4 mb-6 ${hasOpenQuestions ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {maxScore > 0 && (
            <>
              <div className="text-center">
                <div className="font-head text-2xl font-extrabold text-success">{score}</div>
                <div className="text-[10px] text-txtmuted uppercase tracking-wider mt-1">Acertos MC</div>
              </div>
              <div className="text-center">
                <div className="font-head text-2xl font-extrabold text-error">{maxScore - score}</div>
                <div className="text-[10px] text-txtmuted uppercase tracking-wider mt-1">Erros MC</div>
              </div>
            </>
          )}
          {hasOpenQuestions && (
            <div className="text-center">
              <div className="font-head text-2xl font-extrabold text-gold">{aiTotalScore}/{aiMaxScoreTotal}</div>
              <div className="text-[10px] text-txtmuted uppercase tracking-wider mt-1">Nota IA</div>
            </div>
          )}
          <div className="text-center">
            <div className="font-head text-2xl font-extrabold" style={{ color: ringColor }}>{pct}%</div>
            <div className="text-[10px] text-txtmuted uppercase tracking-wider mt-1">Aproveit.</div>
          </div>
        </div>

        {/* AI feedback summary for open questions */}
        {hasOpenQuestions && (
          <div className="mb-6 space-y-2">
            <div className="text-xs font-head font-bold uppercase tracking-wider text-txtmuted mb-2">Feedback das questoes abertas</div>
            {Object.entries(aiGrading).map(([qIdx, gradeResult]) => (
              <div key={qIdx} className={`text-left p-3 rounded-xl border text-sm ${
                gradeResult.score >= 8
                  ? 'bg-success/5 border-success/15'
                  : gradeResult.score >= 5
                  ? 'bg-gold/5 border-gold/15'
                  : 'bg-error/5 border-error/15'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-txtmuted">Q{Number(qIdx) + 1}</span>
                  <span className={`font-head text-sm font-bold ${
                    gradeResult.score >= 8 ? 'text-success' : gradeResult.score >= 5 ? 'text-gold' : 'text-error'
                  }`}>{gradeResult.score}/10</span>
                </div>
                <p className="text-xs text-txtsecondary leading-relaxed">{gradeResult.feedback}</p>
              </div>
            ))}
          </div>
        )}

        {/* Ranking info for retakes */}
        {submissionResult && !submissionResult.isFirstAttempt && (
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-3 mb-4 text-sm text-txtsecondary">
            <strong className="text-gold">Nota do ranking:</strong> {submissionResult.rankingScore.score}/{submissionResult.rankingScore.maxScore} ({submissionResult.rankingScore.percentage}%) — primeira tentativa
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            accent={quiz.accent}
            onClick={() => {
              setView('name')
              setCurrentQ(0)
              setScore(0)
              setAnswers({})
              setSelectedOption(null)
              setShowFeedback(false)
              setSubmissionResult(null)
              setAiGrading({})
            }}
            fullWidth
          >
            <RotateCcw size={14} /> Refazer
          </Button>

          <Link href="/" className="flex-1">
            <Button variant="primary" accent={quiz.accent} fullWidth>
              <Home size={14} /> Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
