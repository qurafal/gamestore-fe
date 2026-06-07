export const formatPrice = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'

export const formatPaymentMethod = (method) =>
  ({ balance: 'Balance', ewallet: 'E-Wallet', credit_card: 'Credit Card' }[method] || method)

export const getDiscountedPrice = (product) => {
  const discount = Number(product.discount || 0)
  return Math.round(Number(product.price || 0) * (1 - discount / 100))
}

export const palette = [
  'from-rose-500/30 via-orange-400/20 to-amber-300/20',
  'from-cyan-500/30 via-blue-400/20 to-indigo-300/20',
  'from-emerald-500/30 via-teal-400/20 to-lime-300/20',
  'from-fuchsia-500/30 via-pink-400/20 to-purple-300/20',
  'from-sky-500/30 via-slate-400/20 to-slate-300/20',
]

export const pickPalette = (seed) => palette[Math.abs(Number(seed) || 0) % palette.length]

export const dedupeById = (items) => {
  const seen = new Set()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export const createToastState = (message, kind = 'success') => ({
  id: Date.now(),
  message,
  kind,
})
