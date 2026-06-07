import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, BadgeCheck, Receipt } from 'lucide-react'
import {
  addWishlist,
  checkout,
  clearStoredToken,
  createReview,
  getLibrary,
  getProductDetail,
  getProducts,
  getProfile,
  getWishlist,
  login,
  normalizeLibraryItem,
  normalizeProfile,
  normalizeProduct,
  normalizeWishlistItem,
  readStoredToken,
  register,
  storeToken,
  topUp,
} from './api/gamevaultApi'
import { Navbar, ProductCard, SectionHeader, Toast } from './appBackend/appBackendComponents'
import { createToastState, dedupeById, formatDate, formatPaymentMethod, formatPrice, getDiscountedPrice, pickPalette } from './appBackend/appBackendUtils'

const HomePage = ({
  products,
  featuredProduct,
  onOpenProduct,
  isAuthenticated,
  ownedCount,
  balance,
}) => {
  const hero = featuredProduct || products[0]
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    if (!products.length) return undefined
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % products.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [products.length])

  const heroProduct = products[heroIndex] || hero
  const topDeals = [...products]
    .sort((a, b) => b.discount - a.discount || a.price - b.price)
    .slice(0, 6)

  return (
    <div className="space-y-12">
      <section className={`rounded-[2rem] border border-white/10 bg-carbon/70 p-4 lg:p-6`}>
        <div className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${pickPalette(heroProduct?.id || 0)} p-4 lg:p-6`}>
          {heroProduct ? (
            <div className="flex min-h-[490px] h-full flex-col justify-between rounded-[1.5rem] border border-white/10 bg-black/25 p-4 backdrop-blur-sm lg:min-h-[560px] lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setHeroIndex((current) => (current === 0 ? products.length - 1 : current - 1))}
                  className="rounded-full bg-black/40 p-2 text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="text-lg font-semibold text-white text-center">{heroProduct.title}</p>
                <button
                  onClick={() => setHeroIndex((current) => (current + 1) % products.length)}
                  className="rounded-full bg-black/40 p-2 text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-8 space-y-3">
                <p className="text-sm text-slate-200">{heroProduct.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                    Platforms: {heroProduct.platforms.map((item) => item.name).join(', ')}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  {heroProduct.discount > 0 ? (
                    <p className="text-xs text-slate-300 line-through">{formatPrice(heroProduct.price)}</p>
                  ) : null}
                  <p className="text-3xl font-semibold text-white">
                    {formatPrice(getDiscountedPrice(heroProduct))}
                  </p>
                </div>
                <button
                  onClick={() => onOpenProduct(heroProduct.id)}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
                >
                  Open Store Page
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader label="Deals" title="Top Discounts" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topDeals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpenProduct}
              onBuy={() => onOpenProduct(product.id)}
              isOwned={false}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
      </section>
    </div>
  )
}

const BrowsePage = ({ products, onOpenProduct, isAuthenticated }) => {
  const [searchInput, setSearchInput] = useState('')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')

  const platforms = useMemo(
    () => ['All', ...new Set(products.flatMap((product) => product.platforms.map((platform) => platform.name)))],
    [products],
  )

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchInput.trim().toLowerCase()
      const matchesSearch =
        query === '' ||
        [product.title, product.description, product.publisher?.name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      const matchesPlatform =
        platformFilter === 'All' || product.platforms.some((platform) => platform.name === platformFilter)
      const discountedPrice = getDiscountedPrice(product)
      const matchesPrice =
        priceFilter === 'All' ||
        (priceFilter === 'Under 200k' && discountedPrice < 200000) ||
        (priceFilter === '200k - 350k' && discountedPrice >= 200000 && discountedPrice <= 350000) ||
        (priceFilter === 'Above 350k' && discountedPrice > 350000)

      return matchesSearch && matchesPlatform && matchesPrice
    })
  }, [products, searchInput, platformFilter, priceFilter])

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-5">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <label className="text-xs text-slate-400">Platform</label>
            <select
              value={platformFilter}
              onChange={(event) => setPlatformFilter(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Price Range</label>
            <select
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              <option value="All">All</option>
              <option value="Under 200k">Under 200k</option>
              <option value="200k - 350k">200k - 350k</option>
              <option value="Above 350k">Above 350k</option>
            </select>
          </div>
        </div>
      </aside>

      <section className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-carbon/70 p-4">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title, description, or publisher..."
              className="w-full bg-transparent text-sm text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpenProduct}
              onBuy={() => onOpenProduct(product.id)}
              isOwned={false}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

const PublisherPage = ({ publisher, products, onOpenProduct, onBack, isAuthenticated }) => {
  if (!publisher) {
    return (
      <div className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <SectionHeader label="Publisher" title="Publisher not found" />
        <p className="text-sm text-slate-400">Pilih game yang punya publisher untuk membuka halaman publisher dedicated.</p>
        <button
          onClick={onBack}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300"
        >
          Back to Store
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionHeader label="Publisher" title={publisher.name} />
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Halaman ini khusus untuk publisher terpilih dan menampilkan semua game yang dimiliki publisher tersebut.
            </p>
          </div>
          <button
            onClick={onBack}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300"
          >
            Back to Store
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
            {products.length} games
          </span>
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
            Publisher ID: {publisher.id}
          </span>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader label="Games" title="Publisher Games" />
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpenProduct}
              onBuy={() => onOpenProduct(product.id)}
              isOwned={false}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

const WishlistPage = ({ wishlist, isAuthenticated, onOpenProduct, onBuyNow, onLogin }) => {
  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6 text-slate-400">
        <h3 className="text-lg font-semibold text-white">Wishlist</h3>
        <p className="mt-2">Login untuk menyimpan game incaran ke wishlist backend.</p>
        <button
          onClick={onLogin}
          className="mt-4 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Login
        </button>
      </div>
    )
  }

  return (
   <div className="space-y-4">
      <SectionHeader label="Favorites" title="Wishlist" />
      {wishlist.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-sm text-slate-400">
          Wishlist masih kosong. Tambahkan dari halaman store.
        </div>
      ) : null}
      
      <div className="space-y-4">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-carbon/70 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex-1">
              <p className="text-lg font-semibold text-white">{item.product.title}</p>
              <p className="text-xs text-slate-500">
                {item.product.publisher?.name || 'Unknown publisher'}
              </p>
              
              {/* Controls untuk Update Wishlist */}
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Priority:</label>
                  <select
                    value={item.priority || 0}
                    onChange={(e) => onUpdateItem(item.id, e.target.value, item.notifyDiscount)}
                    className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-slate-200"
                  >
                    <option value="1">High</option>
                    <option value="2">Medium</option>
                    <option value="3">Low</option>
                  </select>
                </div>
                
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={item.notifyDiscount || false}
                    onChange={(e) => onUpdateItem(item.id, item.priority, e.target.checked)}
                    className="rounded border-white/10 bg-black/40 text-rose-500 focus:ring-rose-500/50"
                  />
                  Notify on Discount
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-2">
              <button
                onClick={() => onOpenProduct(item.product.id)}
                className="w-full rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 md:w-auto"
              >
                Open Store
              </button>
              <button
                onClick={() => onBuyNow(item.product.id)}
                className="w-full rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/20 md:w-auto"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const LibraryPage = ({ library, isAuthenticated, onOpenProduct, onLogin }) => {
  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6 text-slate-400">
        <h3 className="text-lg font-semibold text-white">Library</h3>
        <p className="mt-2">Login untuk melihat game yang sudah dimiliki.</p>
        <button
          onClick={onLogin}
          className="mt-4 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SectionHeader label="Collection" title="Your Library" />
      {library.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-sm text-slate-400">
          Library masih kosong. Setelah checkout berhasil, game akan muncul di sini.
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {library.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/10 bg-carbon/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">{item.product.title}</p>
                <p className="text-xs text-slate-500">Acquired {formatDate(item.acquiredAt)}</p>
              </div>
              <BadgeCheck className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onOpenProduct(item.product.id)}
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300"
              >
                Open Store
              </button>
              <button className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white">
                Play
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProfilePage = ({ user, libraryCount, wishlistCount, onTopUp, onNavigate }) => {
  const [amount, setAmount] = useState(100000)
  const [method, setMethod] = useState('ewallet')

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <SectionHeader label="Account" title="Profile" />
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-300">
          <p className="text-xs text-slate-500">Username</p>
          <p className="mt-1 text-lg font-semibold text-white">{user.username}</p>
          <p className="mt-4 text-xs text-slate-500">Email</p>
          <p className="mt-1 text-sm text-white">{user.email}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-slate-500">Saldo</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatPrice(user.balance)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-slate-500">Library</p>
            <p className="mt-2 text-2xl font-semibold text-white">{libraryCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-slate-500">Wishlist</p>
            <p className="mt-2 text-2xl font-semibold text-white">{wishlistCount}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-100">History</p>
          <p className="mt-2">
            Backend saat ini belum menyediakan endpoint histori transaksi terpisah.
            Setelah endpoint tersedia, bagian ini bisa langsung disambungkan.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <SectionHeader label="Wallet" title="Top Up Saldo" />
        <div>
          <label className="text-xs text-slate-400">Amount</label>
          <input
            type="number"
            value={amount}
            min="10000"
            onChange={(event) => setAmount(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Payment Method</label>
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          >
            <option value="ewallet">E-Wallet</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        <button
          onClick={() => onTopUp(amount, method)}
          className="rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
        >
          Confirm Top Up
        </button>
        <button
          onClick={() => onNavigate('library')}
          className="rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300"
        >
          Open Library
        </button>
      </section>
    </div>
  )
}

const PaymentPage = ({ product, currentBalance, onConfirmPayment, onCancel }) => {
  const [method, setMethod] = useState('balance')
  const price = getDiscountedPrice(product)

  if (!product) {
    return (
      <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6 text-slate-400">
        Select a product to start checkout.
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <SectionHeader label="Checkout" title="Payment" />
        <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${pickPalette(product.id)} p-5`}>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{product.ageRating}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{product.title}</h3>
            <p className="mt-3 text-sm text-slate-200">{product.description}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                Publisher: {product.publisher?.name || 'Unknown'}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                {product.platforms.map((item) => item.name).join(', ')}
              </span>
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400">Payment Method</label>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {[
              { value: 'balance', label: 'Balance' },
              { value: 'ewallet', label: 'E-Wallet' },
              { value: 'credit_card', label: 'Credit Card' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setMethod(item.value)}
                className={`rounded-xl border px-3 py-3 text-xs transition ${
                  method === item.value
                    ? 'border-rose-500/50 bg-rose-500/10 text-white'
                    : 'border-white/10 bg-black/25 text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmPayment(product.id, method)}
            className="flex-1 rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
          >
            Confirm Payment
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
        <h3 className="text-lg font-semibold text-white">Order Summary</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Payment Method</span>
            <span>{formatPaymentMethod(method)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
            <span>Total</span>
            <span>{formatPrice(price)}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-xs text-slate-400">
            Current Balance: {formatPrice(currentBalance)}
          </div>
        </div>
      </section>
    </div>
  )
}

const StorePage = ({
  product,
  isAuthenticated,
  isOwned,
  onOpenPublisher,
  onOpenLibrary,
  onOpenLogin,
  onOpenPayment,
  onAddWishlist,
  onSubmitReview,
  reviewSubmitted,
}) => {
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [isRecommend, setIsRecommend] = useState(true)
  const accent = pickPalette(product?.id || 0)

  if (!product) {
    return (
      <div className="rounded-3xl border border-white/10 bg-carbon/70 p-6 text-slate-400">
        Product not found.
      </div>
    )
  }

  const canReview = isAuthenticated && isOwned && !reviewSubmitted

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
          <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${accent} p-5`}>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                  {product.ageRating}
                </span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                  Release {formatDate(product.releaseDate)}
                </span>
                <button
                  onClick={() => product.publisher && onOpenPublisher(product.publisher.id)}
                  className="rounded-full border border-white/10 bg-black/30 px-3 py-1"
                >
                  {product.publisher?.name || 'Unknown Publisher'}
                </button>
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-white">{product.title}</h1>
              <p className="mt-3 text-sm text-slate-200">{product.description}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-200">
                {product.platforms.map((platform) => (
                  <span
                    key={platform.id}
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1"
                  >
                    {platform.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenLogin()
                  return
                }
                if (!isOwned) {
                  onAddWishlist(product.id)
                  return
                }
                onOpenLibrary()
              }}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${
                isOwned
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                  : isAuthenticated
                    ? 'border border-white/20 text-white'
                    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              }`}
            >
              {isOwned ? 'Play' : isAuthenticated ? 'Add to Wishlist' : 'Login to Wishlist'}
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenLogin()
                  return
                }
                if (isOwned) {
                  onOpenLibrary()
                  return
                }
                onOpenPayment()
              }}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${
                isOwned
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                  : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              }`}
            >
              {isOwned ? 'Owned' : isAuthenticated ? 'Buy Now' : 'Login to Buy'}
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
          <h3 className="text-lg font-semibold text-white">Game Highlights</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="font-semibold text-white">Publisher</p>
              <button
                type="button"
                onClick={() => product.publisher && onOpenPublisher(product.publisher.id)}
                className="mt-2 text-left text-sky-300 transition hover:text-sky-200 disabled:cursor-default disabled:text-slate-400"
                disabled={!product.publisher}
              >
                {product.publisher?.name || 'Not available'}
              </button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="font-semibold text-white">Platforms</p>
              <p className="mt-2 text-slate-400">
                {product.platforms.map((platform) => platform.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">Review</p>
              <h3 className="text-2xl font-semibold text-white">Submit Your Review</h3>
            </div>
            <Receipt className="h-5 w-5 text-rose-300" />
          </div>
          {canReview ? (
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault()
                await onSubmitReview(product.id, {
                  rating: Number(rating),
                  review_text: reviewText,
                  is_recommend: isRecommend,
                })
                setRating(5)
                setReviewText('')
                setIsRecommend(true)
              }}
            >
              <div>
                <label className="text-xs text-slate-400">Rating</label>
                <select
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} Stars
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Review Text</label>
                <textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  rows="4"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  placeholder="Share your experience..."
                />
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={isRecommend}
                  onChange={(event) => setIsRecommend(event.target.checked)}
                />
                Recommend this game
              </label>
              <button
                type="submit"
                className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-400">
              {!isAuthenticated
                ? 'Login untuk membeli game dan membuka form review.'
                : isOwned
                  ? 'Review already submitted or backend will reject duplicates.'
                  : 'Beli game ini terlebih dahulu untuk memberikan ulasan.'}
            </div>
          )}
          <p className="text-xs text-slate-500">
            Backend saat ini belum menyediakan endpoint daftar review, jadi frontend hanya menampilkan form submit review.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-carbon/70 p-6">
          <h3 className="text-lg font-semibold text-white">Publisher</h3>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-400">
            <p className="font-semibold text-white">{product.publisher?.name || 'Unknown'}</p>
            <p className="mt-2">
              Publisher data diambil dari relasi product pada backend, tanpa bergantung pada data dummy.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-carbon/70 p-6">
      <h2 className="text-2xl font-semibold text-white">Login</h2>
      <p className="mt-2 text-sm text-slate-400">Masuk untuk mengakses wishlist, checkout, library, dan top-up.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          await onLogin({ email, password, remember })
        }}
      >
        <div>
          <label className="text-xs text-slate-400">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
        </div>
        <label className="flex items-center gap-3 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          Remember me
        </label>
        <button className="w-full rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white">
          Login
        </button>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="w-full rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300"
        >
          Go to Register
        </button>
      </form>
    </div>
  )
}

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}
    if (form.username.trim().length < 3) nextErrors.username = 'Username minimal 3 karakter.'
    if (!form.email.includes('@')) nextErrors.email = 'Email tidak valid.'
    if (form.password.length < 6) nextErrors.password = 'Password minimal 6 karakter.'
    if (form.password !== confirmPassword) nextErrors.confirmPassword = 'Password tidak cocok.'
    return nextErrors
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-carbon/70 p-6">
      <h2 className="text-2xl font-semibold text-white">Register</h2>
      <p className="mt-2 text-sm text-slate-400">Buat akun baru untuk masuk ke GameVault.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const nextErrors = validate()
          setErrors(nextErrors)
          if (Object.keys(nextErrors).length > 0) return
          await onRegister({ ...form, confirmPassword })
        }}
      >
        <div>
          <label className="text-xs text-slate-400">Username</label>
          <input
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
          {errors.username ? <p className="mt-1 text-xs text-rose-300">{errors.username}</p> : null}
        </div>
        <div>
          <label className="text-xs text-slate-400">Email</label>
          <input
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
          {errors.email ? <p className="mt-1 text-xs text-rose-300">{errors.email}</p> : null}
        </div>
        <div>
          <label className="text-xs text-slate-400">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
          {errors.password ? <p className="mt-1 text-xs text-rose-300">{errors.password}</p> : null}
        </div>
        <div>
          <label className="text-xs text-slate-400">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          />
          {errors.confirmPassword ? (
            <p className="mt-1 text-xs text-rose-300">{errors.confirmPassword}</p>
          ) : null}
        </div>
        <button className="w-full rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white">
          Create Account
        </button>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300"
        >
          Go to Login
        </button>
      </form>
    </div>
  )
}

const AppBackend = () => {
  const [activePage, setActivePage] = useState('home')
  const [token, setToken] = useState(() => readStoredToken())
  const [currentUser, setCurrentUser] = useState(null)
  const [products, setProducts] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [library, setLibrary] = useState([])
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [selectedPublisherId, setSelectedPublisherId] = useState(null)
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [loadingSession, setLoadingSession] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [reviewedProductIds, setReviewedProductIds] = useState([])

  const isAuthenticated = Boolean(token && currentUser)

  const showToast = (message, kind = 'success') => {
    setToast(createToastState(message, kind))
  }

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const loadCatalog = async () => {
    setLoadingCatalog(true)
    setError('')
    try {
      const response = await getProducts('')
      const normalized = (response.data || []).map(normalizeProduct)
      const ordered = dedupeById(normalized)
      setProducts(ordered)
      if (!selectedProductId && ordered.length > 0) setSelectedProductId(ordered[0].id)
      if (!selectedPublisherId && ordered.length > 0 && ordered[0].publisher) {
        setSelectedPublisherId(ordered[0].publisher.id)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoadingCatalog(false)
    }
  }

  const refreshSession = async (accessToken = token) => {
    if (!accessToken) return
    setLoadingSession(true)
    try {
      const [profileResponse, wishlistResponse, libraryResponse] = await Promise.all([
        getProfile(accessToken),
        getWishlist(accessToken),
        getLibrary(accessToken),
      ])
      setCurrentUser(normalizeProfile(profileResponse.data))
      setWishlist((wishlistResponse.data || []).map(normalizeWishlistItem))
      setLibrary((libraryResponse.data || []).map(normalizeLibraryItem))
    } catch (requestError) {
      if (requestError.status === 401) {
        clearStoredToken()
        setToken('')
        setCurrentUser(null)
        setWishlist([])
        setLibrary([])
        showToast('Sesi login habis. Silakan login ulang.', 'error')
      } else {
        showToast(requestError.message, 'error')
      }
    } finally {
      setLoadingSession(false)
    }
  }

  useEffect(() => {
    loadCatalog()
  }, [])

  useEffect(() => {
    if (token) {
      refreshSession(token)
    } else {
      setCurrentUser(null)
      setWishlist([])
      setLibrary([])
      setReviewedProductIds([])
    }
  }, [token])

  useEffect(() => {
    if (selectedProductId || !products.length) return
    setSelectedProductId(products[0].id)
  }, [products, selectedProductId])

  useEffect(() => {
    if (selectedPublisherId || !products.length) return
    const firstPublisher = products.find((product) => product.publisher)
    if (firstPublisher?.publisher) setSelectedPublisherId(firstPublisher.publisher.id)
  }, [products, selectedPublisherId])

  const ownedProductIds = useMemo(
    () => new Set(library.map((item) => item.productId)),
    [library],
  )
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || null,
    [products, selectedProductId],
  )
  const publisherCatalog = useMemo(
    () => products.filter((product) => product.publisher?.id === selectedPublisherId),
    [products, selectedPublisherId],
  )
  const featuredProduct = useMemo(
    () => [...products].sort((a, b) => b.discount - a.discount || a.price - b.price)[0] || null,
    [products],
  )

  const handleNavigate = (page) => {
    if (!isAuthenticated && (page === 'profile' || page === 'payment' || page === 'library')) {
      setActivePage('login')
      showToast('Login diperlukan untuk membuka halaman itu.', 'error')
      return
    }
    setActivePage(page)
  }

  const handleOpenProduct = async (productId) => {
    setSelectedProductId(productId)
    try {
      const response = await getProductDetail(productId)
      const product = normalizeProduct(response.data)
      setProducts((current) =>
        current.map((item) => (item.id === product.id ? product : item)),
      )
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
    setActivePage('store')
  }

  const handleOpenPublisher = (publisherId) => {
    setSelectedPublisherId(publisherId)
    setActivePage('publisher')
  }

  const handleOpenPaymentForProduct = (productId) => {
    setSelectedProductId(productId)
    setActivePage('payment')
  }

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await login({ email, password })
      const responseUser = response.data.user
      const accessToken = response.data.token
      storeToken(accessToken)
      setToken(accessToken)
      setCurrentUser(normalizeProfile(responseUser))
      setActivePage('home')
      showToast('Login berhasil')
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    try {
      await register({ username, email, password })
      const loginResponse = await login({ email, password })
      const responseUser = loginResponse.data.user
      const accessToken = loginResponse.data.token
      storeToken(accessToken)
      setToken(accessToken)
      setCurrentUser(normalizeProfile(responseUser))
      setActivePage('home')
      showToast('Akun berhasil dibuat dan langsung masuk ke sistem.')
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
  }

  const handleLogout = () => {
    clearStoredToken()
    setToken('')
    setCurrentUser(null)
    setWishlist([])
    setLibrary([])
    setReviewedProductIds([])
    setActivePage('home')
    showToast('Logout berhasil')
  }

  const handleAddWishlist = async (productId) => {
    if (!isAuthenticated) {
      setActivePage('login')
      showToast('Login dulu untuk menyimpan wishlist.', 'error')
      return
    }
    try {
      await addWishlist(token, productId)
      await refreshSession(token)
      showToast('Game berhasil ditambahkan ke wishlist')
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
  }

  const handleUpdateWishlist = async (wishlistId, priority, notifyDiscount) => {
    try {
      await updateWishlist(token, wishlistId, {
        priority: Number(priority),
        notify_discount: notifyDiscount,
      })
      
      // Refresh session untuk menarik data wishlist terbaru dari backend
      await refreshSession(token)
      showToast('Preferensi wishlist berhasil diperbarui')
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
  }

  const handleTopUp = async (amount, paymentMethod) => {
    if (!isAuthenticated) {
      setActivePage('login')
      showToast('Login dulu untuk top up saldo.', 'error')
      return
    }
    try {
      const response = await topUp(token, {
        amount: Number(amount),
        payment_method: paymentMethod,
      })
      const newBalance = Number(response.data.new_balance)
      setCurrentUser((current) => (current ? { ...current, balance: newBalance } : current))
      await refreshSession(token)
      showToast(response.message || 'Top up berhasil')
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
  }

  const handleCheckout = async (productId, paymentMethod) => {
    if (!isAuthenticated) {
      setActivePage('login')
      showToast('Login dulu untuk checkout.', 'error')
      return
    }
    try {
      const response = await checkout(token, {
        product_id: Number(productId),
        payment_method: paymentMethod,
      })
      const newBalance = Number(response.data.remaining_balance)
      setCurrentUser((current) => (current ? { ...current, balance: newBalance } : current))
      await refreshSession(token)
      setActivePage('store')
      setSelectedProductId(productId)
      showToast('Pembelian berhasil. Kamu diarahkan kembali ke store page.')
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
  }

  const handleSubmitReview = async (productId, payload) => {
    if (!isAuthenticated) {
      showToast('Login dulu untuk submit review.', 'error')
      return
    }
    try {
      await createReview(token, Number(productId), payload)
      setReviewedProductIds((current) => [...new Set([...current, Number(productId)])])
      showToast('Review berhasil dikirim')
    } catch (requestError) {
      showToast(requestError.message, 'error')
    }
  }

  const loading = loadingCatalog || (isAuthenticated && loadingSession)

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight text-slate-300">
        <div className="rounded-3xl border border-white/10 bg-carbon/80 px-6 py-5">
          Loading GameVault...
        </div>
      </div>
    )
  }

  const ownedCount = library.length
  const wishlistCount = wishlist.length

  return (
    <div className="flex min-h-screen flex-col bg-midnight text-slate-100">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        user={currentUser || { username: 'Guest', balance: 0 }}
        onLogout={handleLogout}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-10 md:px-8">
        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {activePage === 'home' ? (
          <HomePage
            products={products}
            featuredProduct={featuredProduct}
            onOpenProduct={handleOpenProduct}
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            ownedCount={ownedCount}
            wishlistCount={wishlistCount}
            balance={currentUser?.balance || 0}
          />
        ) : null}

        {activePage === 'browse' ? (
          <BrowsePage
            products={products}
            onOpenProduct={handleOpenProduct}
            isAuthenticated={isAuthenticated}
          />
        ) : null}

        {activePage === 'publisher' ? (
          <PublisherPage
            publisher={products.find((product) => product.publisher?.id === selectedPublisherId)?.publisher || null}
            products={publisherCatalog}
            onOpenProduct={handleOpenProduct}
            onBack={() => handleNavigate('store')}
            isAuthenticated={isAuthenticated}
          />
        ) : null}

        {activePage === 'wishlist' ? (
          <WishlistPage
            wishlist={wishlist}
            isAuthenticated={isAuthenticated}
            onOpenProduct={handleOpenProduct}
            onBuyNow={handleOpenPaymentForProduct}
            onLogin={() => handleNavigate('login')}
            onUpdateItem={handleUpdateWishlist}
          />
        ) : null}

        {activePage === 'library' ? (
          <LibraryPage
            library={library}
            isAuthenticated={isAuthenticated}
            onOpenProduct={handleOpenProduct}
            onLogin={() => handleNavigate('login')}
          />
        ) : null}

        {activePage === 'profile' && isAuthenticated ? (
          <ProfilePage
            user={currentUser}
            libraryCount={ownedCount}
            wishlistCount={wishlistCount}
            onTopUp={handleTopUp}
            onNavigate={handleNavigate}
          />
        ) : null}

        {activePage === 'store' ? (
          <StorePage
            product={selectedProduct}
            isAuthenticated={isAuthenticated}
            isOwned={selectedProduct ? ownedProductIds.has(selectedProduct.id) : false}
            onOpenPublisher={handleOpenPublisher}
            onOpenLibrary={() => handleNavigate('library')}
            onOpenLogin={() => handleNavigate('login')}
            onOpenPayment={() => handleNavigate('payment')}
            onAddWishlist={handleAddWishlist}
            onSubmitReview={handleSubmitReview}
            reviewSubmitted={selectedProduct ? reviewedProductIds.includes(selectedProduct.id) : false}
          />
        ) : null}

        {activePage === 'payment' ? (
          <PaymentPage
            product={selectedProduct}
            currentBalance={currentUser?.balance || 0}
            onConfirmPayment={handleCheckout}
            onCancel={() => handleNavigate('store')}
          />
        ) : null}

        {activePage === 'login' ? (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => handleNavigate('register')}
          />
        ) : null}

        {activePage === 'register' ? (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => handleNavigate('login')}
          />
        ) : null}
      </main>

      <footer className="border-t border-white/5 bg-black/40 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 md:px-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">GameVault</h3>
            <p className="mt-2 text-sm text-slate-500">
              Frontend ini kini tersambung ke backend GameVault API.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            <p className="font-semibold text-slate-200">Protected</p>
            <p className="mt-2">Profile</p>
            <p>Library</p>
            <p>Wallet Top Up</p>
          </div>
          <div className="text-sm text-slate-400">
            <p className="font-semibold text-slate-200">Backend Scope</p>
            <p className="mt-2">Products, auth, wishlist, checkout, library, review submit</p>
          </div>
        </div>
      </footer>

      {toast ? <Toast toast={toast} /> : null}
    </div>
  )
}

export default AppBackend
