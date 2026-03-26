interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  accent?: 'gold' | 'steel'
}

export default function Card({ children, className = '', hover, accent }: CardProps) {
  const hoverClasses = hover
    ? accent === 'steel'
      ? 'cursor-pointer hover:border-steel/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40'
      : 'cursor-pointer hover:border-gold/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40'
    : ''

  return (
    <div className={`bg-surface border border-border-subtle rounded-2xl p-7 relative overflow-hidden transition-all duration-250 ${hoverClasses} ${className}`}>
      {hover && (
        <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-250 ${
          accent === 'steel'
            ? 'bg-gradient-to-br from-steel/[0.08] to-transparent'
            : 'bg-gradient-to-br from-gold/[0.06] to-transparent'
        }`} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
