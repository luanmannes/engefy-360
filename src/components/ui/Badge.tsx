interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'steel' | 'success' | 'error' | 'neutral'
  size?: 'sm' | 'md'
}

export default function Badge({ children, variant = 'gold', size = 'sm' }: BadgeProps) {
  const colors = {
    gold: 'bg-gold/10 text-gold border-gold/20',
    steel: 'bg-steel/10 text-steel-light border-steel/20',
    success: 'bg-success/10 text-success border-success/20',
    error: 'bg-error/10 text-error border-error/20',
    neutral: 'bg-white/5 text-txtmuted border-bordersubtle',
  }

  const sizes = {
    sm: 'px-3 py-1 text-[10px]',
    md: 'px-4 py-1.5 text-xs',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-head font-bold uppercase tracking-widest border rounded-full ${colors[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}
