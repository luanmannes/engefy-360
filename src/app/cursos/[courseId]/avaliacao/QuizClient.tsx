'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, RotateCcw, Home } from 'lucide-react'
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

type View = 'name' | 'quiz' | 'result'

export default function QuizClient({ quiz, userId }: { quiz: QuizData; userId?: string }) {
  const [view, setView] = useState<View>('name')
  const [name, setName] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [saving, setSaving] = useState(false)

  const isGold = quiz.accent === 'gold'
  const mcQuestions = quiz.questions.filter(q => q.type === 'mc')
  const maxScore = mcQuestions.length
  const question = quiz.questions[currentQ]

  const startQuiz = () => {
    if (!name.trim()) return
    setView('quiz')
    setCurrentQ(0)
    setScore(0)
    setAnswers({})
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

  const nextQuestion = async () => {
    setSelectedOption(null)
    setShowFeedback(false)

    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      setSaving(true)
      const pct = Math.round((score / maxScore) * 100)

      if (userId) {
        try {
          const supabase = createClient()
          await supabase.from('assessment_results').insert({
            user_id: userId,
            score,
            max_score: maxScore,
            percentage: pct,
            answers: Object.fromEntries(
              Object.entries(answers).filter(([k]) => quiz.questions[Number(k)].type === 'mc').map(([k, v]) => [k, v])
            ),
            open_answers: Object.fromEntries(
              Object.entries(answers).filter(([k]) => quiz.questions[Number(k)].type === 'open').map(([k, v]) => [k, v])
            ),
            passed: pct >= 70,
          })
        } catch {
          // silently fail if table does not exist yet
        }
      }

      setSaving(false)
      setView('result')
    }
  }

  const canProceed = question?.type === 'mc'
    ? selectedOption !== null
    : typeof answers[currentQ] === 'string' && (answers[currentQ] as string).length > 10

  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const ringOffset = 427 - ((pct / 100) * 427)

  // NAME VIEW
  if (view === 'name') {
    return (
      <div className="max-w-md mx-auto text-center animate-fade-up">
        <div className="bg-surface border border-border-subtle rounded-2xl p-10">
          <Badge variant={quiz.accent} size="md">
            {quiz.module} &#8212; {quiz.title}
          </Badge>

          <h2 className="font-head text-2xl font-extrabold text-text-primary mt-6 mb-2">
            Avaliacao de {quiz.title}
          </h2>

          <p className="text-text-muted text-sm mb-6">{quiz.subtitle}</p>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && startQuiz()}
            placeholder="Seu nome completo"
            className={`w-full bg-white/[0.04] border rounded-xl px-5 py-4 text-text-primary font-body text-base text-center outline-none transition-colors duration-200 mb-6 ${
              isGold
                ? 'border-white/10 focus:border-gold'
                : 'border-white/10 focus:border-steel-light'
            }`}
            autoFocus
          />

          <Button onClick={startQuiz} accent={quiz.accent} fullWidth size="lg">
            Iniciar Avaliacao <ArrowRight size={16} />
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

        <div className="bg-surface border border-border-subtle rounded-2xl p-8 mt-4">
          <div className={`font-head text-[11px] font-bold uppercase tracking-[0.15em] mb-4 ${
            isGold ? 'text-gold' : 'text-steel-light'
          }`}>
            Questao {currentQ + 1} de {quiz.questions.length} &middot; {question.type === 'mc' ? 'Multipla escolha' : 'Resposta aberta'}
          </div>

          <p className="text-[17px] font-medium text-text-primary leading-relaxed mb-6">
            {question.text}
          </p>

          {question.type === 'mc' && question.options ? (
            <div className="flex flex-col gap-2.5">
              {question.options.map((opt, i) => {
                let optClass = 'border-border-subtle bg-white/[0.02] hover:bg-white/[0.04]'

                if (selectedOption !== null) {
                  if (i === question.correct) {
                    optClass = 'border-success/50 bg-success/10'
                  } else if (i === selectedOption && i !== question.correct) {
                    optClass = 'border-error/50 bg-error/10'
                  } else {
                    optClass = 'border-border-subtle bg-white/[0.01] opacity-50'
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
                    <span className="text-sm text-text-secondary leading-relaxed pt-0.5">{opt}</span>
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
            <textarea
              value={(answers[currentQ] as string) || ''}
              onChange={e => handleOpenAnswer(e.target.value)}
              placeholder="Escreva sua resposta aqui..."
              rows={5}
              className={`w-full bg-white/[0.04] border rounded-xl px-5 py-4 text-text-primary font-body text-sm outline-none transition-colors resize-y min-h-[120px] ${
                isGold ? 'border-white/10 focus:border-gold' : 'border-white/10 focus:border-steel-light'
              }`}
            />
          )}
        </div>

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

  return (
    <div className="max-w-md mx-auto text-center animate-fade-up">
      <div className="bg-surface border border-border-subtle rounded-2xl p-10">
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
            <span className="font-head text-4xl font-extrabold text-text-primary">{score}</span>
            <span className="text-xs text-text-muted">de {maxScore}</span>
          </div>
        </div>

        <h2 className="font-head text-2xl font-extrabold text-text-primary mb-2">
          {resultTitle}
        </h2>

        <p className="text-text-muted text-sm leading-relaxed mb-6">{resultSub}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 bg-surface-2 rounded-xl p-4 mb-6">
          <div className="text-center">
            <div className="font-head text-2xl font-extrabold text-success">{score}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Acertos</div>
          </div>
          <div className="text-center">
            <div className="font-head text-2xl font-extrabold text-error">{maxScore - score}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Erros</div>
          </div>
          <div className="text-center">
            <div className="font-head text-2xl font-extrabold" style={{ color: ringColor }}>{pct}%</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Aproveit.</div>
          </div>
        </div>

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
