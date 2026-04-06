import axios from 'axios'
import { Coin } from '@/types'

const BASE = 'https://api.coingecko.com/api/v3'

// Cache sederhana agar tidak kena rate limit
const cache: Record<string, { data: unknown; ts: number }> = {}
const CACHE_TTL = 60_000 // 1 menit

async function cachedGet<T>(url: string, params?: object): Promise<T> {
  const key = url + JSON.stringify(params ?? {})
  const now = Date.now()
  if (cache[key] && now - cache[key].ts < CACHE_TTL) {
    return cache[key].data as T
  }
  const { data } = await axios.get(url, { params })
  cache[key] = { data, ts: now }
  return data
}

export async function searchCoins(query: string) {
  const data = await cachedGet<{ coins: { id: string; name: string; symbol: string; thumb: string }[] }>(
    `${BASE}/search`, { query }
  )
  return data.coins.slice(0, 8)
}

export async function getCoinData(ids: string[]): Promise<Coin[]> {
  return cachedGet<Coin[]>(`${BASE}/coins/markets`, {
    vs_currency: 'usd',
    ids: ids.join(','),
    sparkline: true,
    price_change_percentage: '24h',
  })
}

export async function getCoinHistory(
  id: string,
  days: number = 7
): Promise<[number, number][]> {
  const data = await cachedGet<{ prices: [number, number][] }>(
    `${BASE}/coins/${id}/market_chart`,
    { vs_currency: 'usd', days }
  )
  return data.prices
}