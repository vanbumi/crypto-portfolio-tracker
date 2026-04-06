import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CryptoFolio — Portfolio Tracker',
  description: 'Track your crypto portfolio in realtime. Built with Next.js 14 + CoinGecko API.',
  openGraph: {
    title: 'CryptoFolio',
    description: 'Realtime crypto portfolio tracker',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}