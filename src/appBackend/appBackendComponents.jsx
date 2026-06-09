import {
  BadgeCheck,
  Gamepad2,
  Heart,
  Library,
  LogIn,
  LogOut,
  Search,
  User,
  UserPlus,
} from 'lucide-react'
import { formatPrice, getDiscountedPrice, pickPalette } from './appBackendUtils'

export const SectionHeader = ({ label, title, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
    </div>
    {action ? <div>{action}</div> : null}
  </div>
)

export const Toast = ({ toast }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 rounded-2xl border px-4 py-3 text-sm shadow-2xl ${
      toast.kind === 'error'
        ? 'border-rose-500/40 bg-rose-500/15 text-rose-100'
        : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-50'
    }`}
  >
    {toast.message}
  </div>
)

export const Navbar = ({ activePage, onNavigate, isAuthenticated, user, onLogout }) => {
  const items = isAuthenticated
    ? [
        { key: 'home', label: 'Home', icon: Gamepad2 },
        { key: 'browse', label: 'Browse', icon: Search },
        { key: 'library', label: 'Library', icon: Library },
        { key: 'wishlist', label: 'Wishlist', icon: Heart },
        { key: 'profile', label: 'Profile', icon: User },
        
      ]
    : [
        { key: 'home', label: 'Home', icon: Gamepad2 },
        { key: 'browse', label: 'Browse', icon: Search },
        { key: 'wishlist', label: 'Wishlist', icon: Heart },
        { key: 'login', label: 'Login', icon: LogIn },
        { key: 'register', label: 'Register', icon: UserPlus },
      ]

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15">
            <Gamepad2 className="h-5 w-5 text-rose-300" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-100">GameVault</p>
            <p className="text-xs text-slate-500">Backend-connected digital store</p>
          </div>
        </button>

        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex items-center gap-2 rounded-full px-3 py-2 transition ${
                  activePage === item.key
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div className="text-right">
              <p className="text-xs text-slate-400">Saldo</p>
              <p className="text-sm font-semibold text-slate-100">{formatPrice(user.balance)}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-rose-500/25" />
            <div>
              <p className="text-sm font-semibold text-slate-100">{user.username}</p>
              <p className="text-xs text-slate-500">Signed in</p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-rose-500/40 hover:text-white"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-500/40 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export const ProductCard = ({ product, onOpen, onBuy, isOwned, isAuthenticated }) => {
  const discountedPrice = getDiscountedPrice(product)
  const accent = pickPalette(product.id)

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-carbon/70 transition hover:-translate-y-0.5 hover:border-rose-500/30">
      <div className={`h-44 bg-gradient-to-br ${accent} p-4`}>
        <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{product.ageRating}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{product.title}</h3>
            </div>
            {product.discount > 0 ? (
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white">
                -{product.discount}%
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-200">
            {product.platforms.slice(0, 3).map((platform) => (
              <span
                key={platform.id}
                className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1"
              >
                {platform.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <p className="line-clamp-2 text-sm text-slate-400">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            {product.discount > 0 ? (
              <p className="text-xs text-slate-500 line-through">{formatPrice(product.price)}</p>
            ) : null}
            <p className="text-lg font-semibold text-slate-100">{formatPrice(discountedPrice)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpen(product.id)}
              className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              Detail
            </button>
            <button
              onClick={() => onBuy(product.id)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                isOwned
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                  : isAuthenticated
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              }`}
            >
              {isOwned ? 'Play' : isAuthenticated ? 'Buy' : 'Login to Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
