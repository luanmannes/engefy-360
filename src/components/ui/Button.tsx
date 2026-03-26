'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  accent?: 'gold' | 'steel'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', accent = 'gold', fullWidth, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-head font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

    const sizeClasses = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-sm',
    }

    const variantClasses = {
      primary: accent === 'gold'
        ? 'bg-gold text-bg hover:bg-gold-light shadow-lg shadow-gold/20'
        : 'bg-steel text-bg hover:bg-steel-light shadow-lg shadow-steel/20',
      secondary: accent === 'gold'
        ? 'border border-gold/30 text-gold hover:bg-gold/10'
        : 'border border-steel/30 text-steel hover:bg-steel/10',
      danger: 'bg-error text-white hover:bg-error/80',
      ghost: 'text-text-muted hover:text-text-primary hover:bg-white/5',
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
