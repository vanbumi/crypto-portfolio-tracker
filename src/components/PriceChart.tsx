export default function PriceChart({ coinId }: { coinId: string }) {
  return (
    <div className="bg-navy rounded-2xl p-4 mb-4 h-32 flex items-center justify-center">
      <p className="text-navy-muted text-sm">Chart: {coinId} (coming soon)</p>
    </div>
  )
}