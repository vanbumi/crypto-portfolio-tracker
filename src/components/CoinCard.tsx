import { Coin } from '@/types'

interface Props {
  coin: Coin
  onClick: () => void
  isSelected: boolean
}

export default function CoinCard({ coin, onClick, isSelected }: Props) {
  const isUp = coin.price_change_percentage_24h >= 0
  return (
    <div
      onClick={onClick}
      className={`bg-cream-dark rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-gold' : ''}`}
    >
      <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full" />
      <div className="flex-1">
        <p className="font-medium text-navy text-sm">{coin.name}</p>
        <p className="text-navy-muted text-xs">{coin.amount} {coin.symbol.toUpperCase()}</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-navy text-sm">${coin.current_price.toLocaleString()}</p>
        <p className={`text-xs ${isUp ? 'text-up' : 'text-down'}`}>
          {isUp ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  )
}