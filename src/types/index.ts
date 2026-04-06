export interface Coin {
  id: string
  symbol: string
  name: string
  amount: number
  current_price: number
  price_change_percentage_24h: number
  image: string
  sparkline_in_7d?: { price: number[] }
}

export interface PortfolioStore {
  coins: Coin[]
  addCoin: (coin: Coin) => void
  removeCoin: (id: string) => void
  updatePrices: (updatedCoins: Coin[]) => void
}