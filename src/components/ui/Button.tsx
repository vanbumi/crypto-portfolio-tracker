interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'ghost'
}

export default function Button({ children, onClick, className = '', variant = 'primary' }: ButtonProps) {
  const base = 'px-4 py-2 rounded-xl font-sans font-medium transition-all'
  const styles = {
    primary: 'bg-gold text-cream hover:opacity-90',
    ghost: 'border border-navy/20 text-navy hover:bg-cream-dark',
  }
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}