'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { QUIZ_DATA } from '@/lib/constants'
import { getInitials } from '@/lib/utils'
import { Trophy, Download } from 'lucide-react'
import Button from '@/components/ui/Button'

interface RankedPerson {
  name: string
  totalScore: number
  totalMax: number
  avgPct: number
  quizCount: number
  quizNames: string[]
}

export default function RankingPage() {
  const [filter, setFilter] = useState<string>('all')

  // Placeholder: no data yet until Supabase is connected
  const ranked: RankedPerson[] = []

  const filters = [
    { id: 'all', label: 'Todos os modulos' },
    ...QUIZ_DATA.map(q => ({ id: q.id.toString(), label: `${q.module}: ${q.title}` }))
  ]

  const medals = ['\u{1F947}', '\u{1F948}', '\u{1F949}']

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-head text-3xl font-extrabold text-txtprimary mb-2">
            <Trophy size={28} className="inline text-gold mr-2" />
            Ranking
          </h1>
          <p className="text-txtmuted text-base">Classificacao dos colaboradores por desempenho nas avaliacoes.</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download size={14} /> Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg font-head text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === f.id
                ? 'bg-gold/10 text-gold border border-gold/30'
                : 'bg-surface text-txtmuted border border-bordersubtle hover:text-txtprimary hover:bg-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {ranked.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">{'\u{1F3C5}'}</div>
            <h3 className="font-head text-lg font-bold text-txtprimary mb-2">
              Nenhuma avaliacao respondida ainda
            </h3>
            <p className="text-sm text-txtmuted max-w-md mx-auto">
              O ranking sera preenchido conforme os colaboradores completarem as avaliacoes. Configure o Supabase para persistir os resultados.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Podium */}
          <div className="flex items-end justify-center gap-4 mb-8">
            {ranked.slice(0, 3).length >= 2 && (
              <div className="text-center">
                <div className="text-3xl mb-2">{'\u{1F948}'}</div>
                <div className="w-16 h-16 rounded-full bg-surface2 border-2 border-bordersubtle flex items-center justify-center font-head text-lg font-bold text-txtprimary mx-auto mb-2">
                  {getInitials(ranked[1].name)}
                </div>
                <div className="font-head text-sm font-bold text-txtprimary">{ranked[1].name}</div>
                <div className="text-xs text-txtmuted">{ranked[1].totalScore} pts</div>
                <div className="w-20 h-16 bg-surface border border-bordersubtle rounded-t-lg mt-3 flex items-center justify-center font-head text-2xl font-extrabold text-txtmuted">
                  2
                </div>
              </div>
            )}
            {ranked.length >= 1 && (
              <div className="text-center">
                <div className="text-4xl mb-2">{'\u{1F947}'}</div>
                <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center font-head text-xl font-bold text-gold mx-auto mb-2">
                  {getInitials(ranked[0].name)}
                </div>
                <div className="font-head text-base font-bold text-txtprimary">{ranked[0].name}</div>
                <div className="text-xs text-gold">{ranked[0].totalScore} pts</div>
                <div className="w-24 h-24 bg-gold/5 border border-gold/20 rounded-t-lg mt-3 flex items-center justify-center font-head text-3xl font-extrabold text-gold">
                  1
                </div>
              </div>
            )}
            {ranked.length >= 3 && (
              <div className="text-center">
                <div className="text-3xl mb-2">{'\u{1F949}'}</div>
                <div className="w-16 h-16 rounded-full bg-surface2 border-2 border-bordersubtle flex items-center justify-center font-head text-lg font-bold text-txtprimary mx-auto mb-2">
                  {getInitials(ranked[2].name)}
                </div>
                <div className="font-head text-sm font-bold text-txtprimary">{ranked[2].name}</div>
                <div className="text-xs text-txtmuted">{ranked[2].totalScore} pts</div>
                <div className="w-20 h-12 bg-surface border border-bordersubtle rounded-t-lg mt-3 flex items-center justify-center font-head text-2xl font-extrabold text-txtmuted">
                  3
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="space-y-2">
            {ranked.map((p, i) => (
              <div
                key={p.name}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  i === 0 ? 'bg-gold/5 border-gold/20' :
                  i === 1 ? 'bg-surface border-bordersubtle' :
                  i === 2 ? 'bg-surface border-bordersubtle' :
                  'bg-surface/50 border-bordersubtle'
                }`}
              >
                <span className="font-head text-lg font-bold w-8 text-center">
                  {i < 3 ? medals[i] : <span className="text-txtmuted">{i + 1}</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-head text-sm font-bold text-txtprimary">{p.name}</div>
                  <div className="text-xs text-txtmuted">{p.quizCount} modulo{p.quizCount !== 1 ? 's' : ''} · {p.quizNames.join(', ')}</div>
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
