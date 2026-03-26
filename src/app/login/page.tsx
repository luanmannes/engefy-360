import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/')

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />
          <span className="font-head text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
            Plataforma de Treinamento
          </span>
        </div>

        <h1 className="font-head text-4xl sm:text-5xl font-extrabold text-txtprimary leading-tight mb-4">
          ENGEFY <span className="text-gold">360</span>
        </h1>

        <p className="text-txtmuted text-base mb-10 max-w-sm mx-auto leading-relaxed">
          Acesse a plataforma de treinamento e desenvolvimento da Construtora Engefy.
        </p>

        {searchParams.error === 'domain' && (
          <div className="bg-error/10 border border-error/30 text-error rounded-xl px-5 py-3 text-sm mb-6">
            Acesso permitido apenas para emails @construtoraengefy.com.br
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  )
}
