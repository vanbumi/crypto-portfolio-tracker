'use client'
import { useState, useEffect } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { getCoinData } from '@/lib/coingecko'
import PortfolioHeader from '@/components/PortfolioHeader'
import PriceChart from '@/components/PriceChart'
import CoinCard from '@/components/CoinCard'
import AddCoinModal from '@/components/AddCoinModal'

function SkeletonCard() {
  return (
    <div className="bg-cream-dark rounded-xl p-4 flex items-center gap-3 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-navy/10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-navy/10 rounded w-24" />
        <div className="h-2 bg-navy/10 rounded w-16" />
      </div>
      <div className="space-y-2 text-right">
        <div className="h-3 bg-navy/10 rounded w-20" />
        <div className="h-2 bg-navy/10 rounded w-12 ml-auto" />
      </div>
    </div>
  )
}

export default function Home() {
  const { coins, updatePrices } = usePortfolioStore()
  const [showModal, setShowModal] = useState(false)
  const [selectedCoinId, setSelectedCoinId] = useState<string>('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (coins.length > 0 && !selectedCoinId) {
      setSelectedCoinId(coins[0].id)
    }
  }, [coins, selectedCoinId])

  useEffect(() => {
    if (coins.length === 0) return
    setRefreshing(true)
    getCoinData(coins.map((c) => c.id))
      .then(updatePrices)
      .catch(console.error)
      .finally(() => setRefreshing(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalValue = coins.reduce(
    (sum, c) => sum + (c.current_price ?? 0) * c.amount, 0
  )

  return (
    <main className="max-w-md mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-navy">
          Crypto<span className="text-gold">Folio</span>
        </h1>
        {refreshing && (
          <span className="text-xs text-navy-muted animate-pulse">Memperbarui...</span>
        )}
      </div>

      <PortfolioHeader totalValue={totalValue} coins={coins} />

      {selectedCoinId && <PriceChart coinId={selectedCoinId} />}

      <div className="flex flex-col gap-3 mt-2">
        {refreshing && coins.length === 0
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : coins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                onClick={() => setSelectedCoinId(coin.id)}
                isSelected={selectedCoinId === coin.id}
              />
            ))}
      </div>

      {!refreshing && coins.length === 0 && (
        <div className="text-center mt-16">
          <p className="text-4xl mb-3">₿</p>
          <p className="text-navy font-medium mb-1">Portfolio masih kosong</p>
          <p className="text-navy-muted text-sm">
            Tambahkan coin pertamamu untuk mulai tracking
          </p>
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-6 py-3 bg-gold text-cream rounded-xl font-medium
                   hover:opacity-90 active:scale-[0.98] transition-all"
      >
        + Tambah Coin
      </button>

      {showModal && <AddCoinModal onClose={() => setShowModal(false)} />}
    </main>
  )
}