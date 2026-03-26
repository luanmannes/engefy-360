import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
  }

  const { questionText, answer, quizContext } = await request.json()

  if (!questionText || !answer) {
    return NextResponse.json({ error: 'Questao e resposta sao obrigatorios' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key nao configurada' }, { status: 500 })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Voce e um avaliador tecnico de treinamentos da Construtora Engefy, especializada em construcao civil para varejo (shoppings, lojas). Avalie respostas dissertativas de colaboradores sobre o modulo "${quizContext}".

Regras:
- De uma nota de 0 a 10 (inteiro)
- Forneca feedback construtivo em portugues brasileiro
- Seja justo: valorize conhecimento pratico e tecnico
- Nota 8-10: resposta completa com exemplos praticos
- Nota 5-7: resposta parcial, faltam detalhes importantes
- Nota 0-4: resposta vaga, incorreta ou insuficiente

Responda APENAS no formato JSON:
{"score": X, "feedback": "seu feedback aqui"}`
          },
          {
            role: 'user',
            content: `Questao: ${questionText}\n\nResposta do colaborador: ${answer}`
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({
        error: 'Erro na API OpenAI',
        details: errorData
      }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // Parse the JSON response from GPT
    try {
      const parsed = JSON.parse(content)
      return NextResponse.json({
        score: Math.min(10, Math.max(0, parsed.score || 0)),
        maxScore: 10,
        feedback: parsed.feedback || 'Sem feedback disponivel.',
      })
    } catch {
      // If GPT didn't return valid JSON, try to extract score
      return NextResponse.json({
        score: 5,
        maxScore: 10,
        feedback: content || 'Avaliacao processada.',
      })
    }
  } catch {
    return NextResponse.json({ error: 'Erro ao processar avaliacao' }, { status: 500 })
  }
}
