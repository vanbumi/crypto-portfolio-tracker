import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Coin, PortfolioStore } from '@/types'

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      coins: [],
      addCoin: (coin) =>
        set((state) => ({
          coins: [...state.coins.filter((c) => c.id !== coin.id), coin],
        })),
      removeCoin: (id) =>
        set((state) => ({ coins: state.coins.filter((c) => c.id !== id) })),
      updatePrices: (updatedCoins) =>
        set((state) => ({
          coins: state.coins.map((c) => {
            const updated = updatedCoins.find((u) => u.id === c.id)
            return updated ? { ...c, ...updated } : c
          }),
        })),
    }),
    { name: 'crypto-portfolio' }
  )
)