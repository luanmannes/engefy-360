import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'

export default async function DiretorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || !['admin', 'diretor'].includes(profile.role)) redirect('/')

  return (
    <>
      <Navbar profile={profile} />
      <main className="max-w-[1100px] mx-auto px-6 pb-16 relative z-10" style={{ paddingTop: '100px' }}>
        {children}
      </main>
    </>
  )
}
