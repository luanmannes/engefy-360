import { createClient } from '@/lib/supabase/server'
import Card from '@/components/ui/Card'
import { QUIZ_DATA } from '@/lib/constants'
import { getInitials } from '@/lib/utils'
import { Trophy, Download } from 'lucide-react'

export default async function RankingPage() {
  const supabase = await createClient()

  // Fetch all assessment results with user info
  const { data: results } = await supabase
    .from('assessment_results')
    .select('*, profiles:user_id(full_name, department)')
    .order('completed_at', { ascending: false })

  // Aggregate by person
  const byPerson: Record<string, any> = {}
  ;(results || []).forEach((r: any) => {
    const key = r.user_id
    if (!byPerson[key]) {
      byPerson[key] = {
        user_id: r.user_id,
        name: r.profiles?.full_name || 'Sem nome',
        department: r.profiles?.department,
        totalScore: 0,
        totalMax: 0,
        quizzes: new Set(),
      }
    }
    byPerson[key].totalScore += r.score
    byPerson[key].totalMax += r.max_score
    byPerson[key].quizzes.add(r.assessment_id)
  })

  const ranked = Object.values(byPerson)
    .map((p: any) => ({
      ...p,
      quizCount: p.quizzes.size,
      avgPct: p.totalMax > 0 ? Math.round((p.totalScore / p.totalMax) * 100) : 0,
    }))
    .sort((a: any, b: any) => b.totalScore - a.totalScore || b.avgPct - a.avgPct)

  const medals = ['\u{1F947}', '\u{1F948}', '\u{1F949}']

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-head text-3xl font-extrabold text-txtprimary mb-2 flex items-center gap-3">
            <Trophy size={28} className="text-gold" />
            Ranking
          </h1>
          <p className="text-txtmuted text-base">Classificacao dos colaboradores por desempenho nas avaliacoes.</p>
        </div>
      </div>

      {ranked.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">{'\u{1F3C5}'}</div>
            <h3 className="font-head text-lg font-bold text-txtprimary mb-2">
              Nenhuma avaliacao respondida ainda
            </h3>
            <p className="text-sm text-txtmuted max-w-md mx-auto">
              O ranking sera preenchido conforme os colaboradores completarem as avaliacoes.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Podium */}
          {ranked.length >= 1 && (
            <div className="flex items-end justify-center gap-6 mb-10">
              {ranked.length >= 2 && (
                <div className="text-center">
                  <div className="text-3xl mb-2">{'\u{1F948}'}</div>
                  <div className="w-16 h-16 rounded-full bg-surface2 border-2 border-bordersubtle flex items-center justify-center font-head text-lg font-bold text-txtprimary mx-auto mb-2">
                    {getInitials(ranked[1].name)}
                  </div>
                  <div className="font-head text-sm font-bold text-txtprimary">{ranked[1].name}</div>
                  <div className="text-xs text-txtmuted">{ranked[1].totalScore} pts</div>
                  <div className="w-20 h-16 bg-surface border border-bordersubtle rounded-t-lg mt-3 flex items-center justify-center font-head text-2xl font-extrabold text-txtmuted">2</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-4xl mb-2">{'\u{1F947}'}</div>
                <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center font-head text-xl font-bold text-gold mx-auto mb-2">
                  {getInitials(ranked[0].name)}
                </div>
                <div className="font-head text-base font-bold text-txtprimary">{ranked[0].name}</div>
                <div className="text-xs text-gold">{ranked[0].totalScore} pts</div>
                <div className="w-24 h-24 bg-gold/5 border border-gold/20 rounded-t-lg mt-3 flex items-center justify-center font-head text-3xl font-extrabold text-gold">1</div>
              </div>
              {ranked.length >= 3 && (
                <div className="text-center">
                  <div className="text-3xl mb-2">{'\u{1F949}'}</div>
                  <div className="w-16 h-16 rounded-full bg-surface2 border-2 border-bordersubtle flex items-center justify-center font-head text-lg font-bold text-txtprimary mx-auto mb-2">
                    {getInitials(ranked[2].name)}
                  </div>
                  <div className="font-head text-sm font-bold text-txtprimary">{ranked[2].name}</div>
                  <div className="text-xs text-txtmuted">{ranked[2].totalScore} pts</div>
                  <div className="w-20 h-12 bg-surface border border-bordersubtle rounded-t-lg mt-3 flex items-center justify-center font-head text-2xl font-extrabold text-txtmuted">3</div>
                </div>
              )}
            </div>
          )}

          {/* Table */}
          <div className="space-y-2">
            {ranked.map((p: any, i: number) => (
              <div
                key={p.user_id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  i === 0 ? 'bg-gold/5 border-gold/20' : 'bg-surface border-bordersubtle'
                }`}
              >
                <span className="font-head text-lg font-bold w-8 text-center">
                  {i < 3 ? medals[i] : <span className="text-txtmuted">{i + 1}</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-head text-sm font-bold text-txtprimary">{p.name}</div>
                  <div className="text-xs text-txtmuted">
                    {p.quizCount} modulo{p.quizCount !== 1 ? 's' : ''}{p.department ? ` \u00b7 ${p.department}` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-head text-sm font-bold text-txtprimary">{p.totalScore} pts</div>
                  <div className="text-xs text-txtmuted">{p.avgPct}% aproveit.</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
