const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const TOKEN_STORAGE_KEY = 'gamevault.token'

const buildUrl = (path) => `${API_BASE_URL}${path}`

const readStoredToken = () => {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) || ''
}

const storeToken = (token) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

const clearStoredToken = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const request = async (path, { method = 'GET', body, token } = {}) => {
  let response
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    throw new Error(`Backend API tidak dapat dijangkau di ${API_BASE_URL}. Jalankan server backend terlebih dahulu.`)
  }

  let payload = null
  try {
    payload = await response.json()
  } catch (error) {
    payload = null
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed (${response.status})`
    const error = new Error(message)
    error.status = response.status
    error.data = payload?.data
    throw error
  }

  return payload
}

const normalizeDecimal = (value) => Number(value ?? 0)

const normalizeProduct = (product) => ({
  id: product.product_id,
  productId: product.product_id,
  title: product.title,
  description: product.description || 'Deskripsi belum tersedia dari backend.',
  price: normalizeDecimal(product.price),
  discount: Number(product.discount || 0),
  releaseDate: product.release_date || null,
  ageRating: product.age_rating || 'Unknown',
  publisher: product.publisher
    ? {
        id: product.publisher.publisher_id,
        name: product.publisher.name,
      }
    : null,
  platforms: Array.isArray(product.platforms)
    ? product.platforms.map((platform) => ({
        id: platform.platform_id,
        name: platform.name,
      }))
    : [],
})

const normalizeProfile = (profile) => ({
  id: profile.user_id,
  username: profile.username,
  email: profile.email,
  balance: normalizeDecimal(profile.balance),
})

const normalizeWishlistItem = (item) => ({
  id: item.wishlist_id,
  productId: item.product_id,
  priority: item.priority,
  notifyDiscount: Boolean(item.notify_discount),
  product: normalizeProduct(item.product),
})

const normalizeLibraryItem = (item) => ({
  id: item.id,
  productId: item.product_id,
  acquiredAt: item.acquired_at,
  status: item.status,
  product: normalizeProduct(item.product),
})

const login = (payload) => request('/api/auth/login', { method: 'POST', body: payload })
const register = (payload) => request('/api/auth/register', { method: 'POST', body: payload })
const getProfile = (token) => request('/api/users/profile', { token })
const getProducts = (search, token) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return request(`/api/products${query}`, { token })
}
const getProductDetail = (productId, token) => request(`/api/products/${productId}`, { token })
const getWishlist = (token) => request('/api/wishlists', { token })
const addWishlist = (token, productId) => request('/api/wishlists', { method: 'POST', token, body: { product_id: productId } })
const getLibrary = (token) => request('/api/library', { token })
const checkout = (token, payload) => request('/api/checkout', { method: 'POST', token, body: payload })
const topUp = (token, payload) => request('/api/wallet/topup', { method: 'POST', token, body: payload })
const createReview = (token, productId, payload) => request(`/api/products/${productId}/reviews`, { method: 'POST', token, body: payload })
const markHelpful = (token, reviewId) => request(`/api/reviews/${reviewId}/helpful`, { method: 'POST', token })

export {
  API_BASE_URL,
  TOKEN_STORAGE_KEY,
  addWishlist,
  clearStoredToken,
  checkout,
  createReview,
  getLibrary,
  getProductDetail,
  getProducts,
  getProfile,
  getWishlist,
  login,
  markHelpful,
  normalizeLibraryItem,
  normalizeProfile,
  normalizeProduct,
  normalizeWishlistItem,
  readStoredToken,
  register,
  request,
  storeToken,
  topUp,
}
