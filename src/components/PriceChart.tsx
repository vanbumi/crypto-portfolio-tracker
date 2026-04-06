'use client'
import { useEffect, useRef, useState } from 'react'
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
} from 'chart.js'
import { getCoinHistory } from '@/lib/coingecko'
import { usePortfolioStore } from '@/store/portfolioStore'

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler, Tooltip)

const PERIODS = [
  { label: '1H', days: 0.042 },
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
]

export default function PriceChart({ coinId }: { coinId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const [activePeriod, setActivePeriod] = useState(1)
  const [loading, setLoading] = useState(true)
  const [priceNow, setPriceNow] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number | null>(null)
  const { coins } = usePortfolioStore()

  const coin = coins.find((c) => c.id === coinId)

  useEffect(() => {
    if (!canvasRef.current) return
    let cancelled = false

    async function buildChart() {
      setLoading(true)
      try {
        const raw = await getCoinHistory(coinId, PERIODS[activePeriod].days)
        if (cancelled) return

        const prices = raw.map(([, p]) => p)
        const labels = raw.map(([ts]) => {
          const d = new Date(ts)
          if (PERIODS[activePeriod].days <= 1) {
            return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }
          return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        })

        const first = prices[0]
        const last = prices[prices.length - 1]
        const change = ((last - first) / first) * 100
        setPriceNow(last)
        setPriceChange(change)

        const isUp = change >= 0
        const lineColor = isUp ? '#5ECC8B' : '#E07070'
        const fillColor = isUp ? 'rgba(94,204,139,0.12)' : 'rgba(224,112,112,0.12)'

        // Destroy chart lama kalau ada
        if (chartRef.current) {
          chartRef.current.destroy()
          chartRef.current = null
        }

        const ctx = canvasRef.current!.getContext('2d')!
        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              data: prices,
              borderColor: lineColor,
              borderWidth: 2,
              fill: true,
              backgroundColor: fillColor,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: lineColor,
              tension: 0.4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1B2A4A',
                titleColor: '#8FA3C0',
                bodyColor: '#F5F0E8',
                padding: 10,
                displayColors: false,
                callbacks: {
                  title: (items) => items[0].label,
                  label: (item) =>
                    '$' + Number(item.raw).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                  color: '#8FA3C0',
                  font: { size: 10, family: 'DM Sans' },
                  maxTicksLimit: 6,
                  maxRotation: 0,
                },
              },
              y: {
                position: 'right',
                grid: { color: 'rgba(27,42,74,0.08)' },
                border: { display: false },
                ticks: {
                  color: '#8FA3C0',
                  font: { size: 10, family: 'DM Sans' },
                  maxTicksLimit: 4,
                  callback: (val) => '$' + Number(val).toLocaleString('en-US', { notation: 'compact' }),
                },
              },
            },
          },
        })
      } catch (err) {
        console.error('Chart error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    buildChart()
    return () => {
      cancelled = true
    }
  }, [coinId, activePeriod])

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      chartRef.current?.destroy()
    }
  }, [])

  const isUp = (priceChange ?? 0) >= 0

  return (
    <div className="bg-navy rounded-2xl p-4 mb-4">
      {/* Header: nama coin + harga */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-navy-muted text-xs uppercase tracking-wider">
            {coin?.name ?? coinId}
          </p>
          <p className="font-mono text-cream text-xl font-medium mt-0.5">
            {priceNow !== null
              ? '$' + priceNow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : '—'}
          </p>
        </div>
        {priceChange !== null && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-lg mt-1
              ${isUp ? 'bg-up/10 text-up' : 'bg-down/10 text-down'}`}
          >
            {isUp ? '+' : ''}{priceChange.toFixed(2)}%
          </span>
        )}
      </div>

      {/* Period selector */}
      <div className="flex gap-1 mb-3">
        {PERIODS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setActivePeriod(i)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
              ${activePeriod === i
                ? 'bg-gold text-cream'
                : 'text-navy-muted hover:text-cream'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Canvas chart */}
      <div className="relative h-36">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-navy-muted text-xs">Memuat chart...</p>
          </div>
        )}
        <canvas ref={canvasRef} className={loading ? 'opacity-0' : 'opacity-100 transition-opacity'} />
      </div>
    </div>
  )
}