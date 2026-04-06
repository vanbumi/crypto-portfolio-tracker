'use client'
import { useState, useEffect, useRef } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { searchCoins, getCoinData } from '@/lib/coingecko'
import { Coin } from '@/types'

interface SearchResult {
  id: string
  name: string
  symbol: string
  thumb: string
}

export default function AddCoinModal({ onClose }: { onClose: () => void }) {
  const { addCoin } = usePortfolioStore()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selected, setSelected] = useState<SearchResult | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim() || selected) {
      setResults([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const coins = await searchCoins(query)
        setResults(coins)
      } catch {
        setError('Gagal mencari coin. Cek koneksi internet kamu.')
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [query, selected])

  async function handleSave() {
    if (!selected || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Masukkan jumlah coin yang valid.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const [coinData] = await getCoinData([selected.id])
      if (!coinData) throw new Error('Data coin tidak ditemukan.')
      const newCoin: Coin = {
        ...coinData,
        amount: Number(amount),
      }
      addCoin(newCoin)
      onClose()
    } catch {
      setError('Gagal mengambil data harga. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  function handleSelect(coin: SearchResult) {
    setSelected(coin)
    setQuery(coin.name)
    setResults([])
  }

  function handleClear() {
    setSelected(null)
    setQuery('')
    setAmount('')
    setError('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div
      className="fixed inset-0 bg-navy/60 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="bg-cream w-full max-w-sm rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-navy text-xl">Tambah Coin</h2>
          <button
            onClick={onClose}
            className="text-navy-muted hover:text-navy text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-3">
          <label className="text-xs text-navy-muted uppercase tracking-wider block mb-1.5">
            Cari Coin
          </label>
          <div className="flex items-center gap-2 border border-navy/20 rounded-xl px-3 py-2.5 bg-white focus-within:border-gold transition-colors">
            <span className="text-navy-muted text-sm">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
              placeholder="Bitcoin, Ethereum, Solana..."
              className="flex-1 bg-transparent text-navy text-sm outline-none placeholder:text-navy-muted"
            />
            {query && (
              <button onClick={handleClear} className="text-navy-muted hover:text-navy text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Dropdown hasil search */}
          {(results.length > 0 || loading) && (
            <div className="absolute top-full mt-1 w-full bg-white border border-navy/10 rounded-xl overflow-hidden shadow-lg z-10">
              {loading && (
                <div className="px-4 py-3 text-sm text-navy-muted">Mencari...</div>
              )}
              {results.map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => handleSelect(coin)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cream transition-colors text-left"
                >
                  <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full" />
                  <span className="text-navy text-sm font-medium">{coin.name}</span>
                  <span className="text-navy-muted text-xs uppercase ml-auto">{coin.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Coin terpilih badge */}
        {selected && (
          <div className="flex items-center gap-2 bg-navy/5 rounded-xl px-3 py-2 mb-3">
            <img src={selected.thumb} alt={selected.name} className="w-5 h-5 rounded-full" />
            <span className="text-navy text-sm font-medium">{selected.name}</span>
            <span className="text-navy-muted text-xs uppercase">{selected.symbol}</span>
          </div>
        )}

        {/* Input jumlah */}
        <div className="mb-4">
          <label className="text-xs text-navy-muted uppercase tracking-wider block mb-1.5">
            Jumlah yang Dimiliki
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="any"
            className="w-full border border-navy/20 rounded-xl px-3 py-2.5 text-navy text-sm
                       bg-white outline-none focus:border-gold transition-colors
                       placeholder:text-navy-muted font-mono"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-down text-xs mb-3">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-navy/20 text-navy rounded-xl text-sm font-medium
                       hover:bg-cream-dark transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!selected || !amount || saving}
            className="flex-1 py-2.5 bg-gold text-cream rounded-xl text-sm font-medium
                       hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}