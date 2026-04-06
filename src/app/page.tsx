'use client'
import { useState, useEffect } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { getCoinData } from '@/lib/coingecko'
import PortfolioHeader from '@/components/PortfolioHeader'
import PriceChart from '@/components/PriceChart'
import CoinCard from '@/components/CoinCard'
import AddCoinModal from '@/components/AddCoinModal'

export default function Home() {
  const { coins, updatePrices } = usePortfolioStore()
  const [showModal, setShowModal] = useState(false)
  const [selectedCoinId, setSelectedCoinId] = useState<string>('')

  // Auto-set selected coin saat coins berubah
  useEffect(() => {
    if (coins.length > 0 && !selectedCoinId) {
      setSelectedCoinId(coins[0].id)
    }
  }, [coins, selectedCoinId])

  // Fetch harga terbaru saat pertama load
  useEffect(() => {
    if (coins.length === 0) return
    const ids = coins.map((c) => c.id)
    getCoinData(ids).then(updatePrices).catch(console.error)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalValue = coins.reduce(
    (sum, c) => sum + (c.current_price ?? 0) * c.amount,
    0
  )

  return (
    <main className="max-w-md mx-auto px-4 py-8 min-h-screen">
      <h1 className="font-serif text-2xl text-navy mb-6">
        Crypto<span className="text-gold">Folio</span>
      </h1>

      <PortfolioHeader totalValue={totalValue} coins={coins} />

      {selectedCoinId && (
        <PriceChart coinId={selectedCoinId} />
      )}

      <div className="flex flex-col gap-3 mt-2">
        {coins.map((coin) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            onClick={() => setSelectedCoinId(coin.id)}
            isSelected={selectedCoinId === coin.id}
          />
        ))}
      </div>

      {coins.length === 0 && (
        <div className="text-center mt-16">
          <p className="text-4xl mb-3">₿</p>
          <p className="text-navy font-medium mb-1">Portfolio masih kosong</p>
          <p className="text-navy-muted text-sm">Tambahkan coin pertamamu untuk mulai tracking</p>
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-6 py-3 bg-gold text-cream rounded-xl font-medium
                   hover:opacity-90 active:scale-[0.98] transition-all"
      >
        + Tambah Coin
      </button>

      {showModal && (
        <AddCoinModal onClose={() => setShowModal(false)} />
      )}
    </main>
  )
}