'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [role, setRole] = useState(currentRole)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleChange = async (newRole: string) => {
    if (newRole === role) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (!error) {
      setRole(newRole)
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <select
      value={role}
      onChange={e => handleChange(e.target.value)}
      disabled={saving}
      className="bg-surface2 border border-bordersubtle rounded-lg px-3 py-1.5 text-xs font-head font-semibold text-txtsecondary uppercase tracking-wider cursor-pointer disabled:opacity-50 outline-none focus:border-gold"
    >
      <option value="colaborador">Colaborador</option>
      <option value="diretor">Diretor</option>
      <option value="admin">Admin</option>
    </select>
  )
}
