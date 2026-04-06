'use client'
import { Coin } from '@/types'
import { usePortfolioStore } from '@/store/portfolioStore'

interface Props {
  coin: Coin
  onClick: () => void
  isSelected: boolean
}

export default function CoinCard({ coin, onClick, isSelected }: Props) {
  const { removeCoin } = usePortfolioStore()
  const isUp = coin.price_change_percentage_24h >= 0
  const value = (coin.current_price ?? 0) * coin.amount

  return (
    <div
      onClick={onClick}
      className={`bg-cream-dark rounded-xl p-4 flex items-center gap-3 cursor-pointer
        transition-all active:scale-[0.99]
        ${isSelected ? 'ring-2 ring-gold' : 'hover:bg-cream-dark/80'}`}
    >
      <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-navy text-sm">{coin.name}</p>
        <p className="text-navy-muted text-xs">
          {coin.amount} {coin.symbol.toUpperCase()}
        </p>
      </div>

      <div className="text-right">
        <p className="font-mono text-navy text-sm">
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className={`text-xs font-medium ${isUp ? 'text-up' : 'text-down'}`}>
          {isUp ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          removeCoin(coin.id)
        }}
        className="ml-1 text-navy-muted hover:text-down transition-colors text-sm flex-shrink-0"
        title="Hapus coin"
      >
        ✕
      </button>
    </div>
  )
}