import { Coin } from '@/types'

interface Props {
  totalValue: number
  coins: Coin[]
}

export default function PortfolioHeader({ totalValue, coins }: Props) {
  return (
    <div className="bg-navy rounded-2xl p-5 mb-4">
      <p className="text-navy-muted text-xs uppercase tracking-widest">Total Portfolio</p>
      <p className="font-serif text-cream text-3xl mt-1">
        ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className="text-navy-muted text-sm mt-1">{coins.length} aset</p>
    </div>
  )
}